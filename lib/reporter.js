var _ = require('lodash');
var istanbul = require('istanbul');
var collector = new istanbul.Collector();
var sync = true;

function CoverageReporter(emitter, stream, options) {
  this.options = options;
  this.reporter = new istanbul.Reporter(false, this.options.dir);
  this.reporter.addAll(this.options.formats)

  emitter.on('sub-suite-end', function(browser, data) {
    collector.add(data.__coverage__);
  })

  emitter.on('run-end', function(error) {
    if (!error) {
      this.report(this);
    }
  }.bind(this));

};

CoverageReporter.prototype.report = function(browser) {
  this.reporter.write(collector, sync, function() {});
};

module.exports = CoverageReporter;

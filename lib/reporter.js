var istanbul = require("istanbul");
var collector = new istanbul.Collector();
var reporter = new istanbul.Reporter();
var sync = true;

function CoverageReporter(emitter, stream, options) {

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
  reporter.add('html');
  reporter.add('text-summary');
  reporter.write(collector, sync, function() {});
};

module.exports = CoverageReporter;

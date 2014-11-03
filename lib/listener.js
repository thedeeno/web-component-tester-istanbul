var _ = require('lodash');
var istanbul = require('istanbul');
var sync = true;

/**
 * Tracks coverage objects and writes results by listening to events
 * emitted from wct test runner.
 */
function Listener(emitter, stream, options) {
  this.options = options;
  this.collector = new istanbul.Collector();
  this.reporter = new istanbul.Reporter(false, this.options.dir);
  this.reporter.addAll(this.options.formats)

  emitter.on('sub-suite-end', function(browser, data) {
    this.collector.add(data.__coverage__);
  }.bind(this))

  emitter.on('run-end', function(error) {
    if (!error) {
      this.reporter.write(this.collector, sync, function() {});
    }
  }.bind(this));

};

module.exports = Listener;

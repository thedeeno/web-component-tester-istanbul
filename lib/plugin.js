var _ = require('lodash');
var middleware = require('./middleware');
var istanbul = require('istanbul');
var sync = true;

/**
* Tracks coverage objects and writes results by listening to events
* emitted from wct test runner.
*/
function Listener(emitter) {

  this.options = emitter.options.plugins['web-component-tester-istanbul'];
  this.collector = new istanbul.Collector();
  this.reporter = new istanbul.Reporter(false, this.options.dir);
  this.reporter.addAll(this.options.reporters)

  emitter.on('sub-suite-end', function(browser, data) {
    if (data.__coverage__) {
      this.collector.add(data.__coverage__);
    }
  }.bind(this));

  emitter.on('run-end', function(error) {
    if (!error) {
      this.reporter.write(this.collector, sync, function() {});
    }
  }.bind(this));

  emitter.hook('prepare:webserver', function(express, done){
    express.use(middleware(emitter.options.root, this.options, emitter));
    done();
  }.bind(this));

};

module.exports = Listener;

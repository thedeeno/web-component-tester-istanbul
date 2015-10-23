var middleware = require('./middleware');
var istanbul = require('istanbul');
var Validator = require('./validator');
var sync = true;

/**
* Tracks coverage objects and writes results by listening to events
* emitted from wct test runner.
*/

function Listener(emitter, pluginOptions) {

  this.options = pluginOptions;
  this.collector = new istanbul.Collector();
  this.reporter = new istanbul.Reporter(false, this.options.dir);
  this.validator = new Validator(this.options.thresholds);
  this.reporter.addAll(this.options.reporters)

  emitter.on('sub-suite-end', function(browser, data) {
    if (data.__coverage__) {
      this.collector.add(data.__coverage__);
    }
  }.bind(this));

  emitter.on('run-end', function(error) {
    if (!error) {
      this.reporter.write(this.collector, sync, function() {});

      if (!validator.validate(this.collector)) {
        throw new Error('Coverage failed');
      }
    }
  }.bind(this));

  emitter.hook('prepare:webserver', function(express, done){
    express.use(middleware(emitter.options.root, this.options, emitter));
    done();
  }.bind(this));

};

module.exports = Listener;

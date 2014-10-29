var fs = require('fs');
var path = require('path');
var istanbul = require('istanbul');

// istanbul
var instrumenter = new istanbul.Instrumenter({
    coverageVariable: "WCT.__coverage__"
});
var collector = new istanbul.Collector();

// helpers
var cache = {}

function instrumentAsset(root, req){
    var asset = req.url;
    var code;

    if ( !cache[asset] ){
        var assetPath = path.join(root, asset);
        code = fs.readFileSync(assetPath, 'utf8');

        // NOTE: the instrumenter must get a file system path not a wct-webserver path.
        // If given a webserver path it will still generate coverage, but some reporters
        // will error, siting that files were not found
        // (thedeeno)
        cache[asset] = instrumenter.instrumentSync(code, assetPath);
    }

    return cache[asset];
}

module.exports = {
    instrumenter: function(req, res, next) {
        res.send( instrumentAsset(this.root, req) );
    },

    collector: function(wct, browser) {
        collector.add(wct.__coverage__);
    },

    reporter: function(browser) {
        var reporter = new istanbul.Reporter();
        var sync = true;
        reporter.add('html');
        reporter.add('text-summary');
        reporter.write( collector, sync, function() {
            // do nothing
        });
    },

    blacklist: [],

    whitelist: [
        '**/*.js'
    ]
}

var _ = require('lodash');
var minimatch = require('minimatch');
var fs = require('fs');
var path = require('path');
var istanbul = require('istanbul');

// istanbul
var instrumenter = new istanbul.Instrumenter({
  coverageVariable: "WCT.share.__coverage__"
});

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

/**
 * Middleware that serves an instrumented asset based on user
 * configuration of coverage
 */
function coverageMiddleware(root, options, emitter) {
  return function(req, res, next) {
    var path = req.url;

    // always ignore platform files in addition to user's blacklist
    var blacklist = ['/web-component-tester/*'].concat(options.exclude);
    var whitelist = options.include;

    // cache the webserver root for user supplied instrumenter
    this.root = root;

    // check asset against rules
    var process = match(path, whitelist) && !match(path, blacklist);

    // instrument unfiltered assets
    if ( process ) {
      emitter.emit('log:debug', 'coverage', 'instrument', path);
      return res.send( instrumentAsset(this.root, req) );
    } else {
      emitter.emit('log:debug', 'coverage', 'skip      ', path);
      return next();
    }
  };
};

/**
 * Returns true if the supplied string mini-matches any of the supplied patterns
 */
function match(str, rules) {
    return _.any(rules, minimatch.bind(null, str));
}

module.exports = coverageMiddleware;

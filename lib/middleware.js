var _ = require('lodash');
var minimatch = require('minimatch');
var fs = require('fs');
var path = require('path');
var istanbul = require('istanbul');
var parseurl = require('parseurl');
var scriptHook = require('html-script-hook');

// istanbul
var instrumenter = new istanbul.Instrumenter({
  coverageVariable: "WCT.share.__coverage__"
});

// helpers
var cache = {};

function instrumentHtml(htmlFilePath, req){
  var asset = req.url;
  var code;

  if ( !cache[asset] ){
    html = fs.readFileSync(htmlFilePath, 'utf8');

    cache[asset] = scriptHook (html, {scriptCallback: gotScript});
  }

  function gotScript(code, loc) {
    return instrumenter.instrumentSync(code, htmlFilePath);
  }

  return cache[asset];
}

function instrumentAsset(assetPath, req){
    var asset = req.url;
    var code;

    if ( !cache[asset] ){
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
  var mappings = emitter.options.webserver.pathMappings;
  var waterfall = _buildWaterfall(mappings, root);

  return function(req, res, next) {
    var absolutePath = _getFilePathFromWaterfall(waterfall, req);
    var relativePath = absolutePath.replace(root, '');

    // always ignore platform files in addition to user's blacklist
    var blacklist = ['/web-component-tester/*'].concat(options.exclude);
    var whitelist = options.include;

    // cache the webserver root for user supplied instrumenter
    this.root = root;

    // check asset against rules
    var process = match(relativePath, whitelist) && !match(relativePath, blacklist);

    // instrument unfiltered assets
    if ( process ) {
      emitter.emit('log:debug', 'coverage', 'instrument', relativePath);

      if (absolutePath.match(/\.htm(l)?$/)) {
        var html = instrumentHtml(absolutePath, req);
        return res.send( html );
      }

      return res.send( instrumentAsset(absolutePath, req) );
    } else {
      emitter.emit('log:debug', 'coverage', 'skip      ', relativePath);
      return next();
    }
  };
}

/**
 * Returns true if the supplied string mini-matches any of the supplied patterns
 */
function match(str, rules) {
    return _.any(rules, minimatch.bind(null, str));
}

function _getFilePathFromWaterfall(waterfall, request) {
  var requestPath = parseurl(request).pathname;
  var pathLookup = _.find(waterfall, function(pathLookup) {
    return requestPath.indexOf(pathLookup.prefix) === 0;
  });

  return requestPath.replace(pathLookup.prefix, pathLookup.target);
}

// Lifted from https://github.com/PolymerLabs/serve-waterfall
/**
 * @param {Mappings} mappings The mappings to serve.
 * @param {string} root The root directory paths are relative to.
 * @return {Array<{prefix: string, target: string}>}
 */
function _buildWaterfall(pathLookups, root) {
  var basename = path.basename(root);
  var waterfall = _.map(pathLookups, function(pathLookup) {
      var prefix = Object.keys(pathLookup)[0];
      return {
        prefix: prefix.replace('<basename>', basename),
        target: path.resolve(root, pathLookup[prefix]),
      };
    });

  return waterfall;
}

module.exports = coverageMiddleware;

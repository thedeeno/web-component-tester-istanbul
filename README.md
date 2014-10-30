Web-Component-Tester-Istanbul
=============================

Istanbul coverage plugin for web-component-tester.

Use this plugin to collect and report test coverage (via istanbul) for
your project on each test run.

# Installation

```sh
npm install web-component-tester-istanbul --saveDev
```

# Usage

Add the following configuration to web-component-tester's config file.

Note: this requires the following pull requests to be merged:

    https://github.com/Polymer/web-component-tester/pull/59
    https://github.com/Polymer/web-component-tester/pull/60

```js
// wct.conf.js
module.exports = function(config) {
    // add coverage plugin
    config.coverage = require('web-component-tester-istanbul');

    // direct plugin to only instrument files that make it through below filters
    config.coverage.whitelist = [""]
    config.coverage.blacklist = [""]

    return config;
}
```

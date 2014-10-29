Web-Component-Tester-Istanbul
=============================

Adds istanbul coverage reporting to web-component-tester.

After configuring this plugin, web-component-tester will report collect
and report test coverage (via istanbul) for your project on each test
run.

# Installation

```sh
npm install web-component-tester-istanbul --saveDev
```

# Usage

Add the following configuration to your web-component-tester's config
file.

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

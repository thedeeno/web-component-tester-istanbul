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

In your project's wct configuration file wire up coverage support by
attaching this plugin to the `coverage` configuration option.

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

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

    https://github.com/Polymer/web-component-tester/pull/62

```js
module.exports = {
  plugins: {
    "web-component-tester-istanbul": {
      include: [
        "**/*.js"
      ],
      exclude: [
        "/polymer/polymer.js"
        "/platform/platform.js"
      ]
    }
  }
}
```

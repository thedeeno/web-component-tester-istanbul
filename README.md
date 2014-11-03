Web-Component-Tester-Istanbul
=============================

Istanbul coverage plugin for web-component-tester.

Use this plugin to collect and report test coverage (via istanbul) for
your project on each test run.

## Installation

```sh
npm install web-component-tester-istanbul --saveDev
```

## Usage

Add the following configuration to web-component-tester's config file.

Note: this requires the following pull requests to be merged:

    https://github.com/Polymer/web-component-tester/pull/62

## Example

```js
module.exports = {
  plugins: {
    "web-component-tester-istanbul": {
      dir: './coverage',

      reporters: ['text-summary', 'lcov'],

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

## Options

Below are the available configuration options:

### dir

The directory to write coverage reports to.

### reporters

An array of istanbul reporters to use.

### include

Files to include in instrumentation.

### exclude

Files to exclude from instrumentation (this trumps files 'included' with
the option above).

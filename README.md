# jquery.filterjitsu.js

Filterjitsu is a jQuery plugin to filter DOM elements based on search query params in the URL. It filters simply by data attributes, making few assumptions on the structure of your DOM.

There are many ways to filter data on the backend before serving it to the client. Filterjitsu is specifically meant to be used on cached HTML pages served from a CDN, relieving filtering from the backend and allowing for fast page loads.

[![Build Status](https://travis-ci.org/Fullscreen/filterjitsu.svg?branch=master)](https://travis-ci.org/Fullscreen/filterjitsu)

[View contributors](https://github.com/Fullscreen/filterjitsu/graphs/contributors)

## Demo
[https://fullscreen.github.io/filterjitsu/](https://fullscreen.github.io/filterjitsu/)

or

```shell
 $ python -m SimpleHTTPServer 3000
```
Navigate to [http://localhost:3000](http://localhost:3000)

## How to use
The filterjitsu plugin is initialized by being called off of jQuery.fn (or $.fn). The plugin
accepts an options object which will override the defaults defined within the plugin.

Filterjitsu assumes a few things about the HTML and the URL structure on the page which it is
initialized. The `DATA_FILTERABLE` selector is required on each item that can be filtered, and for
that reason it is the best jQuery selector to initialize the plugin with (but this is up to you).
The filterable items are filtered based on key value pairs provided in the search query parameters of
the url that match data attributes on the filterable elements. For example, a URL with the search
query `?filter-type=video&filter-genre=comedy` would filter all elements that did not have the
`data-filter-type="video"` or `data-filter-genre="comedy"` data attributes. It is important to note
that the url parameters form a boolean OR when filtering out filterable elements.

Filterjitsu expects encoded URLs. Encoding can be done using a language library such as those suggested in
[this stackoverflow post](http://stackoverflow.com/questions/2834034/how-do-i-raw-url-encode-decode-in-javascript-and-ruby-to-get-the-same-values-in/2834053#2834053).
This is done to percent encode [reserved characters](https://en.wikipedia.org/wiki/Percent-encoding#Types_of_URI_characters) in URLs.
The unencoded URL format would look as follows:
```
?filter-type=music&filter-genre=rock&roll
```
and after properly encoding it changes to:
```
?filter-type=video&filter-genre=rock%26roll
```

The `data-count` attribute can be applied to any elment and will be updated with the current number
of elements displayed on the page after the main list of filterable elements ahve been filtered.
A value can be assigned to `data-count` to give context for the count number. For instance
`data-count="item"` will render `X items` in the html text after filterjitsu runs.

The `data-alert` attribute can be applied to an element and it will be populated with an alert with
a description about the visible elements based on how they were filtered. A value can be assigned to
`data-alert` to give context for the alert text.

Below is an example of how filterjitsu could be structured in HTML and initialized in javascript.
```html
  <!-- links to change url and cause filtering -->
  <a href="/">Clear filters</a>
  <a href="?filter-type=Water">Water Items</a>
  <a href="?filter-type=Land">Land Items</a>
  <a href="?">All</a>
  <!-- items to be filtered -->
  <div data-alert="item"></div>
  <div data-count="item"></div>
  <div>
    <div data-filterable data-filter-type="Water">Surfboard</div>
    <div data-filterable data-filter-type="Land">Skateboard</div>
    <div data-filterable data-filter-type="Water">Skimboard</div>
    <div data-filterable data-filter-type="Water">Paddleboard</div>
    <div data-filterable data-filter-type="Land">Rollerblades</div>
    <div data-filterable data-filter-type="Land">BMX Bike</div>
  </div>
  <!-- filterjitsu plugin -->
  <script>
    $.fn.filterjitsu({
      // plugin options here
    });
  </script>
```

## Plugin Options
```js
  Filterjitsu.defaults = {
    /**
     * jQuery selector for all filterable elements
     * @type {String}
     */
    DATA_FILTERABLE: '[data-filterable]',
    /**
     * jQuery selector for field to show count
     * @type {String}
     */
    DATA_COUNT: '[data-count]',
    /**
     * jQuery selector for info
     * @type {String}
     */
    DATA_ALERT: '[data-alert]'
  };
```

## Development
The development file lives under `src/jquery.filterjitsu.js`. To develop, first run `npm install` to
install the devDependencies.
```shell
 $ npm install
 $ ./node_modules/.bin/gulp
 ... edit jquery.filterjitsu.js
 ... look in terminal for gulp output as you save
 $ python -m SimpleHTTPServer 3000
 ... test in [browser](http://localhost:3000)
```

## Testing with Karma + Jasmine-jQuery
The test files live under the `test` directory. Karma is used as the test runner and
[jasmine](http://jasmine.github.io/) + [jasmine-jquery](https://github.com/velesin/jasmine-jquery)
is the bdd framework.

Each test should have its own spec file and a matching fixtures html template. Tests should be
concise. Limit the number of `expect()`s per `it()` block, this allows for clear test failure
messages. Each `it()` block should have a clear title and describe exactly what is expected.

Execute the tests using gulp.
```shell
 $ ./node_modules/.bin/gulp test
```

## Versioning
Versions will follow the [semver](http://semver.org/) format. All versions will be visible under
[releases](https://github.com/Fullscreen/filterjitsu/releases) with an
[updated changelog](https://github.com/Fullscreen/filterjitsu/blob/master/CHANGELOG.md).

(function (factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
      // AMD
      define(['jquery'], factory);
  } else if (typeof module === 'object' && module.exports) {
      factory(require('jquery'));
  } else {
      // Browser globals
      factory(jQuery);
  }
}(function ($) {
  var Filterjitsu; // declare function to assign to $.fn.filterjitsu

  /**
   * Extract search queries from url
   * @return {Array} list of strings of search queries
   */
  function searchQueries () {
    return window.location.search.replace('?', '').split('&');
  }

  /**
   * Extract parameters from search queries list
   * @return {Object} Search keys with values
   */
  function parameters () {
    var results = {};

    $.each(searchQueries(), function (_index, query) {
      var splitQuery = query.split('=');

      if (splitQuery.length === 2) {
        results[splitQuery[0]] = splitQuery[1];
      }
    });

    return results;
  }

  /**
   * Build the jQuery selector for elements that do not match search query
   * @param  {Object} params   - search query parameters from `parameters()`
   * @param  {Object} settings - plugin settings
   * @return {String} jQuery selector
   */
  function buildQueryString (params, settings) {
    var selectorsArr = [],
        str = '',
        key;

    for (key in params) {
      if (params.hasOwnProperty(key) && params[key] !== settings.ITEM_TYPE) {
        selectorsArr.push(settings.DATA_FILTERABLE + '[data-' + key + '][data-' + key + '!=' + params[key] + ']');
      }
    }

    str = selectorsArr.join(', ');

    return str === settings.DATA_FILTERABLE ? '' : str;
  }

  /**
   * Hide rows that do not match the desired data field
   * @param  {Object} $filterjitsuEl - main jQuery object this plugin is called on
   * @param  {Object} queryString    - jQuery selector
   * @return {Array} array of jQuery objects of elements hidden
   */
  function hideUnmatchedRows ($filterjitsuEl, queryString) {
    // filter the elements that match the `'[data-filterable][data-' + key + '!=' + params[key] + ']'`
    // selector and hide the resulting elements
    return $filterjitsuEl
      .filter(queryString)
      .hide();
  }

  /**
   * Update the count of visible rows
   * @param  {Object} queryString - jQuery selector
   * @param  {Object} settings    - plugin settings
   * @return {Array} array of jQuery objects that match the `[data-count]`` selector
   */
  function updateCount (queryString, settings) {
    var count = $(settings.DATA_FILTERABLE).length - $(queryString).length,
        itemText = (count === 1) ? settings.ITEM_STRING : settings.ITEM_STRING + 's';

    return $(settings.DATA_COUNT).text(count + ' ' + itemText);
  }

  /**
   * Build bootstrap style alert with category type string
   * @param  {String} categoryTypesStr
   * @param  {String} pathname
   * @return {String} valid bootrap html for an alert
   */
  function buildHtmlAlert(categoryTypesStr, pathname, settings) {
    return (
      '<div id="info" class="alert alert-info text-center col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">' +
      '  You are viewing only ' + categoryTypesStr + ' ' + settings.ITEM_STRING + 's.' +
      '  <a href="' + pathname + '">View all ' + settings.ITEM_STRING + 's.</a>' +
      '</div>'
    );
  }

  /**
   * Replace or append an alert to the view
   * @param  {Object} params   - search query parameters from `parameters()`
   * @param  {Object} settings - plugin settings
   */
  function replaceOrAppendAlert (params, settings) {
    var i,
        html,
        param,
        paramsKey,
        paramsKeys = Object.keys(params),
        categoryTypes = [];

    // build array of category types based on the params
    for (i = 0; i < paramsKeys.length; i++) {
      paramsKey = paramsKeys[i];
      param = params[paramsKey];
      if (param !== undefined && param !== settings.ITEM_TYPE) {
        categoryTypes.push(param);
      }
    }

    // only display the html alert if there are categories in the categoryTypes array
    // only replace the html if the info element exists in the dom
    if (categoryTypes.length > 0 && $(settings.INFO_SELECTOR).length > 0) {
      html = buildHtmlAlert(categoryTypes.join(', '), window.location.pathname, settings);
      $(settings.INFO_SELECTOR).html(html);
    }
  }

  /**
   * filterjitsue plugin definition
   * @param  {Object} options - options to be passed into the jQuery plugin
   */
  Filterjitsu = function (options) {
    var defaults = $.fn.filterjitsu.defaults,
        settings = $.extend({}, defaults, options),
        $this = this;

    function init() {
      var params = parameters(),
          queryString = buildQueryString(params, settings);

      hideUnmatchedRows($this, queryString);
      updateCount(queryString, settings);
      replaceOrAppendAlert(params, settings);
    }

    init();
  };

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
    INFO_SELECTOR: '.info',
    /**
     * Descriptive word for what things are being filtered
     * @type {String}
     */
    ITEM_STRING: 'item',
    /**
     * URL param for type being filtered
     * @type {String}
     */
    ITEM_TYPE: 'Item'
  };

  $.fn.filterjitsu = Filterjitsu;
}));
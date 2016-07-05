'use strict';

(function (factory) {
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
        results[splitQuery[0]] = splitQuery[1]
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
      if (params.hasOwnProperty(key) && params[key] !== 'Video') {
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
        videoText = (count === 1) ? 'video' : 'videos';

    return $(settings.DATA_COUNT).text(count + ' ' + videoText);
  }

  /**
   * Build bootstrap style alert with category type string
   * @param  {String} categoryType
   * @param  {String} pathname
   * @return {String} valid bootrap html for an alert
   */
  function buildHtmlAlert(categoryType, pathname) {
    return (
      '<div id="info" class="alert alert-info text-center col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">' +
      '  You are viewing only ' + categoryType + '. <a href="' + pathname + '">View all videos.</a>' +
      '</div>'
    );
  }

  /**
   * Replace or append an alert to the view
   * @param  {Object} params - search query parameters from `parameters()`
   */
  function replaceOrAppendAlert (params) {
    var html,
        categoryType = [],
        categories = {};

    if (typeof params['type'] !== 'undefined' && params['type'] !== 'Video') {
      if (typeof params['category'] !== 'undefined') {
        categoryType.push(categories[params['category']]);
      }

      categoryType.push(params['type'].replace('Video', ' videos'));
      html = buildHtmlAlert(categoryType.join(' '), window.location.pathname);

      if ($('#info').length > 0) {
        $('#info').replaceWith(html);
      } else {
        $('.breadcrumb').after(html);
      }
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
      replaceOrAppendAlert(params);
    }

    init();
  }

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
    DATA_COUNT: '[data-count]'
  };

  $.fn.filterjitsu = Filterjitsu;
}));

'use strict';

jasmine.getFixtures().fixturesPath = "base/test/fixtures";

describe('jquery.filterjitsu.js multiple search params test suite', function () {
  var $fj;

  beforeEach(function () {
    loadFixtures('template-multiple-params.html');

    // HACK (marcus): the following line of code is needed to mock search query params with phantom js
    // http://stackoverflow.com/questions/2494213/changing-window-location-without-triggering-refresh
    window.history.replaceState( {}, '', 'http://localhost:8080/context.html?filter-genre=comedy&filter-year=2007');

    $fj = $.fn.filterjitsu();
  });

  it('should filter down to 8 items', function () {
    expect($('[data-count]')).toHaveText('8 items');
  });

  it('should show genre comedy items', function () {
    expect($('[data-filterable][data-filter-genre="comedy"]')).toBeVisible();
  });

  it('should show year 2007 items', function () {
    expect($('[data-filterable][data-filter-year="2007"]')).toBeVisible();
  });

  it('should hide land all other drama and year items', function () {
    expect($('[data-filterable][data-filter-genre!="comedy"], [data-filterable][data-filter-year!="2007"]')).toBeHidden();
  });

  it('should show an alert', function () {
    expect($('[data-alert]')).toBeVisible();
  });

  it('should show an alert with detailed text', function () {
    expect($('[data-alert]')).toContainHtml(
      '<div id="info" class="alert alert-info text-center col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">' +
      '  You are viewing only comedy, 2007 items.' +
      '  <a href="/context.html">View all items.</a>' +
      '</div>'
    );
  });
});

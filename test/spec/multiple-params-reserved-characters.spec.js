'use strict';

jasmine.getFixtures().fixturesPath = "base/test/fixtures";

describe('jquery.filterjitsu.js multiple search params and reserved url characters test suite', function () {
  var $fj;

  beforeEach(function () {
    loadFixtures('template-multiple-params-reserved-characters.html');

    // HACK (marcus): the following line of code is needed to mock search query params with phantom js
    // http://stackoverflow.com/questions/2494213/changing-window-location-without-triggering-refresh
    window.history.replaceState( {}, '', 'http://localhost:8080/context.html?filter-genre=rock%26roll&filter-year=2007&sort=alphabetical');

    $fj = $.fn.filterjitsu();
  });

  it('should filter down to 8 items', function () {
    expect($('[data-count]')).toHaveText('8 items');
  });

  it('should show genre rock&roll items', function () {
    expect($('[data-filterable][data-filter-genre="rock&roll"]')).toBeVisible();
  });

  it('should show year 2007 items', function () {
    expect($('[data-filterable][data-filter-year="2007"]')).toBeVisible();
  });

  it('should hide land all other drama and year items', function () {
    expect($('[data-filterable][data-filter-genre!="rock&roll"], [data-filterable][data-filter-year!="2007"]')).toBeHidden();
  });

  it('should show an alert', function () {
    expect($('[data-alert]')).toBeVisible();
  });

  it('should show an alert with detailed text', function () {
    expect($('[data-alert]')).toContainHtml(
      '<div id="info" class="alert alert-info text-center col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">' +
      '  You are viewing only rock&roll, 2007 items.' +
      '  <a href="/context.html">View all items.</a>' +
      '</div>'
    );
  });
});

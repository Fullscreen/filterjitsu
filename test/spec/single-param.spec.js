'use strict';

jasmine.getFixtures().fixturesPath = "base/test/fixtures";

describe('jquery.filterjitsu.js single param test suite', function () {
  var $fj;

  beforeEach(function () {
    loadFixtures('template-single-param.html');

    // HACK (marcus): the following line of code is needed to mock search query params with phantom js
    // http://stackoverflow.com/questions/2494213/changing-window-location-without-triggering-refresh
    window.history.replaceState( {}, '', 'http://localhost:8080/context.html?filter-type=Water');

    $fj = $.fn.filterjitsu();
  });

  it('should filter down to 3 items', function () {
    expect($('[data-count]')).toHaveText('3 items');
  });

  it('should show water items', function () {
    expect($('[data-filterable][data-filter-type="Water"]')).toBeVisible();
  });

  it('should hide land items', function () {
    expect($('[data-filterable][data-filter-type!="Water"]')).toBeHidden();
  });

  it('should show an alert', function () {
    expect($('[data-alert]')).toBeVisible();
  });

  it('should show an alert with detailed text', function () {
    expect($('[data-alert]')).toContainHtml(
      '<div id="info" class="alert alert-info text-center col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">' +
      '  You are viewing only Water items.' +
      '  <a href="/context.html">View all items.</a>' +
      '</div>'
    );
  });
});

'use strict';

jasmine.getFixtures().fixturesPath = "base/test/fixtures";

describe('jquery.filterjitsu.js not filterjitsu search query test suite', function () {
  var $fj;

  beforeEach(function () {
    loadFixtures('template-not-filterjitsu-search-query.html');

    // HACK (marcus): the following line of code is needed to mock search query params with phantom js
    // http://stackoverflow.com/questions/2494213/changing-window-location-without-triggering-refresh
    window.history.replaceState( {}, '', 'http://localhost:8080/context.html?sort=alphabetical');

    $fj = $.fn.filterjitsu();
  });

  it('should not filter items', function () {
    expect($('[data-filterable]').length).toBe(6);
  });

  it('should not populate the alert', function () {
    expect($('[data-alert]')).toBeEmpty();
  });
});

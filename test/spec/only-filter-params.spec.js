'use strict';

jasmine.getFixtures().fixturesPath = "base/test/fixtures";

describe('jquery.filterjitsu.js not filterjitsu search query test suite', function () {
  var $fj;

  beforeEach(function () {
    loadFixtures('template-only-filter-params.html');

    // HACK (marcus): the following line of code is needed to mock search query params with phantom js
    // http://stackoverflow.com/questions/2494213/changing-window-location-without-triggering-refresh
    //
    // here we set the search query param to `flight` because it has the same number of characters
    // as `filter`. We are testing that the .slice(0, 6) to remove `filter` is only removing
    // the word filter
    window.history.replaceState( {}, '', 'http://localhost:8080/context.html?flight-type=Water');

    $fj = $.fn.filterjitsu();
  });

  it('should not hide [data-type="Land"] items ', function () {
    expect($('[data-filterable][data-filter-type="Land"]')).toBeVisible();
  });
});

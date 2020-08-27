# Created by siddharththakur at 26/08/20
Feature: Map
  All the Map options such as search, zoom, localities, provinces, municipalities etc.

  Scenario: Verify the search functionality by searching Cape town municipality
    Given I am on the Wazimap Homepage
    And I click on search bar
    And I enter cape town in the search field
    And I select the city of cape town as municipality
    Then User must see country as south africa, province as western cape and municipalities as city of cape town

  Scenario: Verify the zoom in and zoom out on map view
    Given I am on the Wazimap Homepage
    And I click on '+'
    Then map should be zoomed in
    And I click on '-'
    Then map should be zoomed out
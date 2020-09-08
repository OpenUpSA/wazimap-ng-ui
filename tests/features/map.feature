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

  Scenario Outline: Verify the visibility of the location information of the map
    Given I am on the Wazimap Homepage
    Then User must see the profile highlights
    And I click on search bar
    And I select the <province>
    Then User must see the profile highlights
    And I click on search bar
    And I select the <district>
    Then User must see the profile highlights
    And I click on search bar
    And I select the <municipality>
    Then User must see the profile highlights
    And I click on search bar
    And I select the <main place>
    Then User must see the profile highlights
    Examples:
    |district          |province  |municipality|main place|
    |Thabo Mofutsanyane|Free state|Dihlabeng|Dihlabeng NU|

  Scenario Outline: Verify country, province, district, municipality and main place visibility on the map
    Given I am on the Wazimap Homepage
    And I click on search bar
    And I select the <province>
    Then User must be able to see the map of province
    And I select the <district>
    Then User must be able to see the map of district
    And I select the <municipality>
    Then User must be able to see the map of municipality
    And I select the <main place>
    Then User must be able to see the map of main place
    Examples:
      |province     |district|municipality  |main place|
      |Northern Cape|Namakwa|Karoo Hoogland|Sutherland|

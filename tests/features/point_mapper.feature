# Created by siddharththakur at 28/08/20
Feature: Point Mapper
  Select the category, or specific type of point data you would like to overlay onto the map.
  => Grocery Stores

  Scenario: Verify the Grocery stores are displayed on the map view
    Given I am on the Wazimap Homepage
    And I click on Grocery store toggle switch
    Then User must see the Grocery stores highlights on the map
    And I click on Grocery store toggle switch
    Then User must not see the Grocery stores highlights on the map
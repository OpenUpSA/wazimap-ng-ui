Feature: Point Mapper
  Select the category, or specific type of point data you would like to overlay onto the map.
  => Labour

  Scenario: Verify the Labour are displayed on the map view
    Given I am on the Wazimap Homepage
    And I click labour dropdown label
    Then User must see the labours highlights on the map
    And I click labour dropdown label again
    Then User must not see the labours highlights on the map

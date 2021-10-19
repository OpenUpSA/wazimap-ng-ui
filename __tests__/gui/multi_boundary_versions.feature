Feature: Multiple geographic boundary versions

  Scenario: Verify that the map works correctly with multiple boundary versions
    Given I am on the Wazimap Homepage
      Then I wait until map is ready
    And I check if "2011 Boundaries" is the selected version
      Then I switch to "2016 with wards" version
    And I click on the Proceed button in confirmation modal
      Then I check if "2016 with wards" is the selected version
    And I expand Data Mapper
      Then I check if there are 2 categories
    And I select an indicator from Elections category
      Then I click on the Proceed button in confirmation modal
    And I check if "2011 Boundaries" is the selected version
      Then I navigate to a geography with no children
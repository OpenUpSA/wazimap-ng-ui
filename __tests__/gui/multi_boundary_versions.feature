Feature: Multiple geographic boundary versions

  Scenario: Verify that the map works correctly with multiple boundary versions
    Given I am on the Wazimap Homepage
    Then I wait until map is ready
    Then I check if "2011 Boundaries" is the selected version
    Then I check if the profile highlight is hidden

    And I expand Rich Data Panel
    Then I check if the key metric is shown with the version notification
    Then I expand Point Mapper

    And I switch to "2016 with wards" version
    Then I click on the Proceed button in confirmation modal
    Then I check if "2016 with wards" is the selected version
    Then I check if the profile highlight is displayed correctly

    And I expand Rich Data Panel
    Then I check if the key metric is shown without the version notification
    Then I expand Point Mapper

    And I expand Data Mapper
    Then I check if there are 2 categories
    Then I select an indicator from Elections category
    Then I click on the Proceed button in confirmation modal
    Then I check if "2011 Boundaries" is the selected version

    And I switch to "2016 with wards" version
    Then I click on the Proceed button in confirmation modal
    Then I check if the choropleth is removed

    And I navigate to a geography with no children
    Then I check if "2016 with wards" is the selected version

    And I switch to "2011 Boundaries" version
    Then I click on the Proceed button in confirmation modal
    Then I check if "2011 Boundaries" is the selected version

    And I navigate to a geography with multiple child type
    Then I check if "2011 Boundaries / mainplace" is the selected version
    Then I switch to "2011 Boundaries / ward" version
    Then I click on the Proceed button in confirmation modal
    Then I check if "2011 Boundaries / ward" is the selected version
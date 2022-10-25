Feature: Data Mapper

  Scenario: Verify the translations replaced the texts correctly
    Given I am on the Wazimap Homepage
    Then I wait until map is ready
    Then I check if the search box is translated correctly

    And I expand Point Mapper
    Then I check if the Point Mapper is translated correctly

    And I click on "Higher Education" in Point Mapper
    And I click on "TVET colleges" in Point Mapper
    And I expand the filter dialog
    Then I check if the filter dialog is translated correctly

    And I click on a marker
    And I click on the More info button
    Then I check if the facility dialog is translated correctly

    And I navigate to WC
    And I expand Point Mapper
    Then I check if the Point Mapper is translated correctly

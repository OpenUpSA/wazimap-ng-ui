Feature: Point Data

  Scenario: Verify the markers and clusters are working correctly
    Given I am on the Wazimap Homepage
      Then I wait until map is ready
    And I expand Point Mapper
    
    And I expand Higher Education theme
    Then I select TVET colleges category
    Then I check if the marker color is "#3a70ff"

    And I check if the filter dialog is displayed
    Then I check if the filter dialog is collapsed
    Then I check if the point category legend is hidden

    And I expand the filter dialog
    Then I check if the filter dialog is expanded

    And I click on the first filter dropdown
    Then I check if the filter options are "All values, campus, institution type, numerical"

    And I expand Labour theme
    Then I select Additional DEL facilities category
    Then I check if the cluster is created correctly

    And I click on the first filter dropdown
    Then I check if the filter options are "All values, campus, institution type, numerical, website"

    And I filter by "campus:Nongoma"
    Then I check if the marker color is "#3a70ff"

    And I deselect TVET colleges category
    And I click on the first filter dropdown
    Then I check if the filter options are "All values, website, campus"
    Then I check if the marker color is "#993aff"

    # to make sure filter pane is visible when a category is unchecked and checked again
    And I deselect Additional DEL facilities category
    And I select TVET colleges category
    And I expand the filter dialog
    Then I check if the filter dialog is displayed
    Then I filter by a numerical value

    # test that re-selecting the current filter does not break filtering
    And I select Additional DEL facilities category
    Then I filter by "campus:TestCampus"
    Then I check if the marker color is "#993aff"
    Then I filter by "campus:TestCampus"
    Then I check if the marker color is "#993aff"

    And I collapse the filter dialog
    Then I check if the filter dialog is collapsed
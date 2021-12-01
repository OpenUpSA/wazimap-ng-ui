Feature: Point Data

  Scenario: Verify the markers and clusters are working correctly
    Given I am on the Wazimap Homepage
      Then I wait until map is ready
    And I expand Higher Education theme
      Then I click on TVET colleges category
    And I check if the marker color is rgb(58, 112, 255)
      Then I check if the filter pane is displayed
      Then I check if the point category legend is hidden
    And I click on the first filter dropdown
      Then I check if the filter options are "All values, campus, institution type, numerical"
    And I expand Labour theme
      Then I click on Additional DEL facilities category
    And I check if the cluster is created correctly
      Then I click on the first filter dropdown
    And I check if the filter options are "All values, campus, institution type, numerical, website"
      Then I filter by "campus:Nongoma"
    And I check if the marker color is rgb(58, 112, 255)
      Then I click on TVET colleges category
    And I click on the first filter dropdown
      Then I check if the filter options are "All values, website, campus"
    And I check if the marker color is rgb(153, 58, 255)
      Then I click on the close button

    # to make sure filter pane is visible when a category is unchecked and checked again
    And I click on TVET colleges category
    Then I check if the filter pane is displayed
    Then I filter by a numerical value

    # test that re-selecting the current filter does not break filtering
    And I click on Additional DEL facilities category
    Then I filter by "campus:TestCampus"
    Then I check if the marker color is rgb(153, 58, 255)
    Then I filter by "campus:TestCampus"
    Then I check if the marker color is rgb(153, 58, 255)
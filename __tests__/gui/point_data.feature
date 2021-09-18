Feature: Point Data

  Scenario: Verify the markers and clusters are working correctly
    Given I am on the Wazimap Homepage
      Then I wait until map is ready
    And I expand Higher Education theme
      Then I click on TVET colleges category
    And I check if the marker color is rgb(58, 112, 255)
      Then I remove TVET colleges from map
    And I expand Labour theme
      Then I click on Additional DEL facilities category
    And I check if the marker color is rgb(153, 58, 255)
      Then I click on TVET colleges category
    And I check if the cluster is created correctly
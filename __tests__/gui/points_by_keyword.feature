Feature: Point search by keywords

  Scenario: Verify the point search by keyword is working
    Given I am on the Wazimap Homepage
    Then I wait until map is ready
    And I expand Point Mapper
    
    And I expand Higher Education theme
    Then I select TVET colleges category
    Then I assert that 4 markers are displayed on map

    And I check if the filter dialog is displayed
    Then I check if the filter dialog is collapsed
    Then I check if the point category legend is hidden

    And I expand the filter dialog
    Then I check if the filter dialog is expanded

    And I click on the first filter dropdown
    Then I check if the filter options are "All values, Keyword, campus, institution type, numerical"

    And I filter by "Keyword:Nongoma"
    Then I assert that 1 markers are displayed on map

    And I expand Labour theme
    Then I select Additional DEL facilities category
    Then I assert that 2 markers are displayed on map
    Then I check if the cluster is created correctly
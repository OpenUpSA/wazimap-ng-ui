Feature: Facility Modal

  Scenario: Verify the data mapper is working correctly
    Given I am on the Wazimap Homepage
    Then I wait until map is ready

    And I expand Data Mapper
    Then Data Mapper should be displayed

    And I click on Demographics in Data Mapper
    And I select an indicator
    And I select another indicator
    Then I check if choropleth legend is displayed
    Then I check if everything is zero

    And I navigate to EC and check if the loading state is displayed correctly

    # test that collapsing/expanding choropleth filter dialog does not affect point filter and vice versa
    And I expand Point Mapper
    And I expand Higher Education theme
    And I click on TVET colleges category
    Then I check if the point filter dialog is collapsed
    Then I check if the choropleth filter dialog is expanded

    And I expand the point filter dialog
    Then I check if the point filter dialog is expanded
    Then I check if the choropleth filter dialog is expanded

    And I collapse the choropleth filter dialog
    Then I check if the point filter dialog is expanded
    Then I check if the choropleth filter dialog is collapsed

    And I expand the choropleth filter dialog
    Then I check if the point filter dialog is expanded
    Then I check if the choropleth filter dialog is expanded
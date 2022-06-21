Feature: Data Mapper

  Scenario: Verify the data mapper is working correctly
    Given I am on the Wazimap Homepage
    Then I wait until map is ready

    And I expand Data Mapper
    Then Data Mapper should be displayed

    And I click on "Demographics" in Data Mapper
    And I select an indicator
    And I select another indicator
    Then I check if the choropleth filter dialog is collapsed
    Then I check if choropleth legend is displayed
    Then I expand filter dialog
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

    # deselect point category
    And I expand Point Mapper
    And I click on TVET colleges category

    # confirm that navigating between geographies does not break the data mapper & choropleth
    And I navigate to WC
    And I expand Data Mapper
    Then I check if there are 2 categories

    And I navigate to ZA
    And I expand Data Mapper
    Then I check if there are 3 categories

    And I navigate to WC and back to ZA quickly
    And I expand Data Mapper
    Then I check if there are 3 categories

    # confirm that no filters available message is displayed correctly
    When I expand Data Mapper
    And I click on "Elections" in Data Mapper
    And I click on "2016 Municipal elections" in Data Mapper
    And I click on "Number of hung and majority councils" in Data Mapper
    And I click on "Hung" in Data Mapper
    Then I expand filter dialog
    Then I check if the message is displayed correctly

    # confirm that default filters do not break navigating
    When I expand Data Mapper
    And I click on "Economic Opportunities" in Data Mapper
    And I click on "NEET Status" in Data Mapper
    And I click on "Not in Employment" in Data Mapper
    And I click on "NEET" in Data Mapper
    Then I check if the non-aggregatable group filter is applied

    And I navigate to FS
    Then I check if the non-aggregatable group filter is applied

    And I filter by "25-29"
    Then I check if the legend values are correct

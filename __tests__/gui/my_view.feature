Feature: My View Panel

  Scenario: Verify my view panel is displayed correctly
    Given I am on the Wazimap Homepage
    Then I wait until map is ready

    # Expanding / Collapsing the my view window
    When I expand My View Window
    Then I check if My View Window is visible
    And I collapse My View Window
    Then I check if My View Window is hidden

    # Data mapper
    When I expand Data Mapper
    And I click on "Demographics" in Data Mapper
    And I click on "Language" in Data Mapper
    And I click on "Language most spoken at home" in Data Mapper
    And I click on "30-35" in Data Mapper
    And I expand the filter dialog
    Then I confirm that there are no filters in filter dialog

    # Sticky indicator
    # 1 - filter
    When I select "language" in indicator dropdown
    And I select "English" in subIndicator dropdown
    # 2 - switch to another indicator
    And I click on "South African Citizenship" in Data Mapper
    And I click on "Citizenship" in Data Mapper
    And I click on "Yes" in Data Mapper
    Then I confirm that there are no filters in filter dialog
    # 3 - go back to the first indicator
    And I click on "30-35" in Data Mapper
    Then I confirm that the choropleth is filtered by "language:English"

    # My view
    When I expand My View Window
    And I click on "INDICATOR OPTIONS" in My View
    Then I confirm that there is an indicator filter for "Language most spoken at home(data_explorer):language:English" at index 0
    Then I remove the indicator filter at index 0
    Then I confirm that there are no filters in filter dialog
    And I collapse My View Window

    # Rich data
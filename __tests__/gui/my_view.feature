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
    When I select "language" from indicator dropdown in filter dialog
    And I select "English" from subIndicator dropdown in filter dialog
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
    Then I confirm that there is an indicator filter for "Data mapper:Language most spoken at home:language:English" at index 0

    # Remove filter from my view
    And I remove the indicator filter at index 0
    Then I confirm that there are no filters in filter dialog
    And I collapse My View Window

    # Rich data filters are separated from data mapper filters
    When I select "language" from indicator dropdown in filter dialog
    And I select "English" from subIndicator dropdown in filter dialog
    And I expand Rich Data Panel
    Then I confirm that the chart is not filtered


    # My view contains choropleth and rich data filters at the same time
    Then I select "language" from indicator dropdown in chart filter
    And I select "Afrikaans" from subIndicator dropdown in chart filter
    And I collapse Rich Data Panel
    And I expand My View Window
    Then I confirm that there is an indicator filter for "Data mapper:Language most spoken at home:language:English" at index 0
    Then I confirm that there is an indicator filter for "Rich data view:Language most spoken at home:language:Afrikaans" at index 1

    # Remove rich data filter from my view
    When I remove the indicator filter at index 1
    And I collapse My View Window
    Then I confirm that the choropleth is filtered by "language:English"
    And I expand Rich Data Panel
    Then I confirm that the chart is not filtered

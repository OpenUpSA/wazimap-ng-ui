Feature: My View Panel

  Scenario: Verify my view panel is displayed correctly
    Given I am on the Wazimap Homepage
    Then I wait until map is ready

    # Data mapper
    When I expand Data Mapper
    And I click on "Demographics" in Data Mapper
    And I click on "Language" in Data Mapper
    And I click on "Language most spoken at home" in Data Mapper
    And I click on "30-35" in Data Mapper
    And I expand the filter dialog

    # My view window
    When I expand My View Window
    And I click on "INDICATOR OPTIONS" in My View
    Then I confirm that there are no site-wide filters

    # Select filters
    When I collapse My View Window
    Then I confirm that the lock button is hidden

    And I select "language" from indicator dropdown in filter dialog
    Then I confirm that the lock button is hidden

    And I select "English" from subIndicator dropdown in filter dialog
    Then I confirm that the lock button is visible

    And I click on the lock button
    And I expand My View Window
    Then I confirm that "language:English" is a site-wide filter

    # Rich data panel
    When I collapse My View Window
    And I expand Rich Data Panel
    Then I confirm that "language:English" is applied to "Language most spoken at home" as a site-wide filter
    Then I confirm that "language:English" is applied to "Citizenship" as an unavailable site-wide filter

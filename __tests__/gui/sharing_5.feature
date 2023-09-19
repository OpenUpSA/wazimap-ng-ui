Feature: Sharing url

  Scenario: Verify that it is indicated whenever there are filters that cannot be applied
    Given I am on the Wazimap Homepage with a missing filter selected in default
    And I wait until map is ready
    And I wait for 1s for the API data to be processed
    Then I confirm that the toggle button shows a warning indicator

    When I expand My View Window
    Then I confirm that the indicator options shows a warning indicator

    When I click on "INDICATOR OPTIONS" in My View
    Then I confirm that there is an indicator filter for "Data mapper:Language most spoken at home:race:Race A" at index 0
    Then I confirm that there is a help text indicating that there are filters which cannot be applied
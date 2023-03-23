Feature: Hidden Indicators

  Scenario: Verify hiding indicators from my view panel hides data mapper indicators
    Given I am on the Wazimap Homepage
    Then I wait until map is ready

    When I expand Data Mapper
    And I click on "Demographics" in Data Mapper
    And I click on "Language" in Data Mapper
    And I click on "Language most spoken at home" in Data Mapper

    When I expand My View Window
    And I click on "INDICATOR OPTIONS" in My View
    And I click on "MyView-Demographics" in hidden indicator tree
    And I click on "MyView-Language" in hidden indicator tree
    And I check hidden values text on "MyView-Demographics" is "hidden 0"
    And I check hidden values text on "MyView-Language" is "hidden 0"
    And I check eye icon on "MyView-Language most spoken at home" indicator is visible
    And I check eye close icon on "MyView-Language most spoken at home" indicator is not visible

    When I click on eye icon on "MyView-Language most spoken at home" indicator
    And I check hidden values text on "MyView-Language" is "hidden 1"
    And I check hidden values text on "MyView-Demographics" is "hidden 1"
    And I check eye icon on "MyView-Language most spoken at home" indicator is not visible
    And I check eye close icon on "MyView-Language most spoken at home" indicator is visible
    And I check if "Language" on Data Mapper is hidden

    When I click on "MyView-Migration" in hidden indicator tree
    And I check hidden values text on "MyView-Demographics" is "hidden 1"
    And I check hidden values text on "MyView-Migration" is "hidden 0"
    And I check eye icon on "MyView-Region of birth" indicator is visible
    And I check eye close icon on "MyView-Region of birth" indicator is not visible

    When I click on eye icon on "MyView-Region of birth" indicator
    And I check hidden values text on "MyView-Migration" is "hidden 1"
    And I check hidden values text on "MyView-Demographics" is "hidden 2"
    And I check eye icon on "MyView-Region of birth" indicator is not visible
    And I check eye close icon on "MyView-Region of birth" indicator is visible
    And I check if "Migration" on Data Mapper is hidden

    Then I click on eye close icon on "MyView-Language most spoken at home" indicator
    And I check hidden values text on "MyView-Language" is "hidden 0"
    And I check hidden values text on "MyView-Demographics" is "hidden 1"
    And I check eye icon on "MyView-Language most spoken at home" indicator is visible
    And I check eye close icon on "MyView-Language most spoken at home" indicator is not visible
    And I check if "Language" on Data Mapper is visible

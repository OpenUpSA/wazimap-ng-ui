Feature: Aborting geo request

  Scenario: Aborting api requests while traversing between diff geographies does not throw error
    Given I am on the Wazimap Homepage
    Then I wait until map is ready

    When I expand Data Mapper
    And I click on "Demographics" in Data Mapper
    And I click on "Language" in Data Mapper
    And I click on "Language most spoken at home" in Data Mapper
    And I click on "15-19" in Data Mapper
    And I zoom out so whole map is visible

    When I navigate to WC and without waiting for response visit ZA
    Then I wait until map is ready

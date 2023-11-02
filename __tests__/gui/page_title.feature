Feature: Page Title

  Scenario: Verify page title
    Given I am on the Wazimap Homepage
    Then I check if current title of the page is "Wazimap NG"
    Then I wait until map is ready
    Then I check if current title of the page is "South Africa Test - Youth Explorer"

    # Check if Geo name and profile name is displayed when geo is changed
    And I navigate to EC
    Then I wait until map is ready for Eastern Cape
    Then I check if current title of the page is "Eastern Cape - Youth Explorer"
    Then I navigate to ZA

    # Check if Geo name is displayed if profile name is empty
    And I navigate to WC
    Then I wait until map is ready for Western Cape
    Then I check if current title of the page is "Western Cape"
    Then I navigate to ZA

    # Check if Profile name is displayed when geo name is empty
    And I navigate to FS
    Then I wait until map is ready for Free State
    Then I check if current title of the page is "Youth Explorer"

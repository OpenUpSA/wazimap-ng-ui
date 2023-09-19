Feature: Sharing url

  Scenario: sharing url compatibility by converting hash to geo strings
    Given I am on the Wazimap Homepage
    And I wait until map is ready

    When I navigate to WC using hashcode
    Then I wait until map is ready for Western Cape
    Then I confirm hash code is changed to querysting

    When I go back in browser history
    Then I wait until map is ready for South Africa Test

    When I navigate to WC using hashcode and filters
    Then I wait until map is ready for Western Cape
    Then I confirm hash code is changed to querysting
    And I expand My View Window
    And I click on "INDICATOR OPTIONS" in My View
    Then I confirm that there is an indicator filter for "Data mapper:Language most spoken at home:race:White" at index 0
    Then I confirm that there is an indicator filter for "Rich data view:Language most spoken at home:race:Coloured" at index 1

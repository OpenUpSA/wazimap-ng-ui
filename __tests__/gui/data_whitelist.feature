Feature: Data Whitelist

  Scenario: Verify restricting filter values and setting profile-wide filters work correctly
    Given I am on the Wazimap Homepage
    Then I wait until map is ready

    # Choropleth default filter
    When I expand Data Mapper
    And I click on "Demographics" in Data Mapper
    And I click on "Language" in Data Mapper
    And I click on "Language most spoken at home" in Data Mapper
    And I confirm that available subindicators are "20-24,30-35" in Data Mapper
    And I click on "30-35" in Data Mapper
    And I expand the filter dialog
    Then I confirm that the choropleth is filtered by "gender:Female" at index 0

    # Restrict filter values
    When I filter by "language"
    And I click on the second filter dropdown
    Then I check if the filter options are "English, Afrikaans"

    # Rich data panel default filter
    When I expand Rich Data Panel
    Then I confirm that "gender:Female" is applied to "Language most spoken at home"

  Scenario: Restricting filter values and setting profile-wide filters on a view
    Given I am on the Wazimap Homepage Test View
    Then I wait until map is ready

    # Choropleth default filter
    When I expand Data Mapper
    And I click on "Demographics" in Data Mapper
    And I click on "Language" in Data Mapper
    And I click on "Language most spoken at home" in Data Mapper
    And I confirm that available subindicators are "15-19,20-24,30-35" in Data Mapper
    And I click on "30-35" in Data Mapper
    And I expand the filter dialog
    Then I confirm that the choropleth is filtered by "gender:Male" at index 0

    # Restrict filter values
    When I filter by "language"
    And I click on the second filter dropdown
    Then I check if the filter options are "English, Sepedi, isiXhosa"

    # Rich data panel default filter
    When I expand Rich Data Panel
    Then I confirm that "gender:Male" is applied to "Language most spoken at home"
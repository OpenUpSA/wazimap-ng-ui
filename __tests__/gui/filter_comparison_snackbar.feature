Feature: Snackbar

  Scenario: Verify the snackbar is shown correctly when filters are changed
    Given I am on the Wazimap Homepage
    Then I wait until map is ready

    When I expand Data Mapper
    Then Data Mapper should be displayed
    And I click on "Demographics" in Data Mapper
    And I click on "Language" in Data Mapper
    And I click on "Language most spoken at home" in Data Mapper
    And I click on "15-19" in Data Mapper

    Then I check if snackbar is not visible
    Then I check applied filter label text is "0" of "2" applied
    Then I check applied filters does not have notification badge

    When I expand the filter dialog
    Then I select "gender" from indicator dropdown in filter dialog on row "0"
    And I select "Male" from subIndicator dropdown in filter dialog on row "0"
    And I collapse filter dialog
    Then I check applied filter label text is "1" of "2" applied

    And I click on "25-29" in Data Mapper
    Then I check if snackbar is not visible
    Then I check applied filter label text is "1" of "2" applied
    Then I check applied filters does not have notification badge

    Then I click on "South African Citizenship" in Data Mapper
    And I click on "Citizenship" in Data Mapper
    And I click on "Yes" in Data Mapper

    Then I check if snackbar is visible
    Then I click on snackbar to hide it
    Then I check applied filter label text is "0" of "3" applied
    Then I check applied filters show notification badge

    And I click on "15-35 (ZA)" in Data Mapper
    Then I check if snackbar is visible
    Then I check applied filter label text is "1" of "2" applied
    Then I check applied filters show notification badge

  Scenario: Verify the snackbar is shown correctly when default filters are applied
    Given I am on the Wazimap Homepage
    Then I wait until map is ready

    When I expand Data Mapper
    Then Data Mapper should be displayed
    And I click on "Demographics" in Data Mapper
    And I click on "Migration" in Data Mapper
    And I click on "Region of birth" in Data Mapper
    And I click on "Male" in Data Mapper

    Then I check if snackbar is visible
    Then I click on snackbar to hide it
    Then I check applied filter label text is "1" of "2" applied

    And I click on "Male" in Data Mapper
    Then I check if snackbar is not visible
    Then I check applied filter label text is "1" of "2" applied

    Then I click on "South African Citizenship" in Data Mapper
    And I click on "Citizenship" in Data Mapper
    And I click on "Yes" in Data Mapper

    Then I check if snackbar is visible
    Then I click on snackbar to hide it
    Then I check applied filter label text is "0" of "3" applied
    Then I check applied filters show notification badge

    Then I click on "Language" in Data Mapper
    And I click on "Language most spoken at home" in Data Mapper
    And I click on "15-35 (ZA)" in Data Mapper
    Then I check if snackbar is not visible
    Then I check applied filter label text is "0" of "2" applied

  Scenario: Verify the snackbar is shown correctly when non aggregatable filters are applied
    Given I am on the Wazimap Homepage for testing non aggregatable filters
    Then I wait until map is ready

    When I expand Data Mapper
    Then Data Mapper should be displayed
    And I click on "Demographics" in Data Mapper
    And I click on "Language" in Data Mapper
    And I click on "Language most spoken at home" in Data Mapper
    And I click on "15-19" in Data Mapper

    Then I check if snackbar is visible
    Then I click on snackbar to hide it
    Then I check applied filter label text is "1" of "2" applied

    And I click on "15-35 (ZA)" in Data Mapper
    Then I check if snackbar is not visible
    Then I check applied filter label text is "1" of "2" applied

    Then I click on "South African Citizenship" in Data Mapper
    And I click on "Citizenship" in Data Mapper
    And I click on "Yes" in Data Mapper

    Then I check if snackbar is visible
    Then I click on snackbar to hide it
    Then I check applied filter label text is "0" of "3" applied

    When I expand the filter dialog
    Then I select "gender" from indicator dropdown in filter dialog on row "0"
    And I select "Male" from subIndicator dropdown in filter dialog on row "0"
    And I collapse filter dialog
    Then I check applied filter label text is "1" of "3" applied

    And I click on "15-35 (ZA)" in Data Mapper
    Then I check if snackbar is not visible
    Then I check applied filter label text is "1" of "2" applied

  Scenario: Verify the snackbar is shown correctly when profile views filters are applied
    Given I am on the Wazimap Homepage for testing profile views default filters
    Then I wait until map is ready

    When I expand Data Mapper
    Then Data Mapper should be displayed
    And I click on "Demographics" in Data Mapper
    And I click on "Language" in Data Mapper
    And I click on "Language most spoken at home" in Data Mapper
    And I click on "15-19" in Data Mapper

    Then I check if snackbar is visible
    Then I click on snackbar to hide it
    Then I check applied filter label text is "1" of "2" applied

    And I click on "15-35 (ZA)" in Data Mapper
    Then I check if snackbar is not visible
    Then I check applied filter label text is "1" of "2" applied

    Then I click on "South African Citizenship" in Data Mapper
    And I click on "Citizenship" in Data Mapper
    And I click on "Yes" in Data Mapper

    Then I check if snackbar is visible
    Then I click on snackbar to hide it
    Then I check applied filter label text is "1" of "3" applied

    When I expand the filter dialog
    Then I select "gender" from indicator dropdown in filter dialog on row "0"
    And I select "Male" from subIndicator dropdown in filter dialog on row "0"
    And I collapse filter dialog
    Then I check applied filter label text is "1" of "3" applied

    And I click on "15-35 (ZA)" in Data Mapper
    Then I check if snackbar is not visible
    Then I check applied filter label text is "1" of "2" applied

  Scenario: Verify the snackbar is shown correctly when profile default filters are applied
    Given I am on the Wazimap Homepage for testing profile default filters
    Then I wait until map is ready

    When I expand Data Mapper
    Then Data Mapper should be displayed
    And I click on "Demographics" in Data Mapper
    And I click on "Language" in Data Mapper
    And I click on "Language most spoken at home" in Data Mapper
    And I click on "15-19" in Data Mapper

    Then I check if snackbar is not visible
    Then I check applied filter label text is "0" of "2" applied

    And I click on "15-35 (ZA)" in Data Mapper
    Then I check if snackbar is not visible
    Then I check applied filter label text is "0" of "2" applied

    Then I click on "South African Citizenship" in Data Mapper
    And I click on "Citizenship" in Data Mapper
    And I click on "Yes" in Data Mapper

    Then I check if snackbar is visible
    Then I click on snackbar to hide it
    Then I check applied filter label text is "1" of "3" applied

    And I click on "No" in Data Mapper
    Then I check if snackbar is not visible
    Then I check applied filter label text is "1" of "3" applied

    And I click on "15-35 (ZA)" in Data Mapper
    Then I check if snackbar is visible
    Then I click on snackbar to hide it
    Then I check applied filter label text is "0" of "2" applied

    When I expand the filter dialog
    Then I select "gender" from indicator dropdown in filter dialog on row "0"
    And I select "Male" from subIndicator dropdown in filter dialog on row "0"
    And I collapse filter dialog
    Then I check applied filter label text is "1" of "2" applied

    And I click on "30-35" in Data Mapper
    Then I check if snackbar is not visible
    Then I check applied filter label text is "1" of "2" applied

    And I click on "Yes" in Data Mapper
    Then I check if snackbar is visible
    Then I check applied filter label text is "1" of "3" applied

Feature: Sharing url

  Scenario: Verify navigating between geographies retains filters & hidden indictaors

    Given I am on the Wazimap Homepage
    Then I wait until map is ready

    When I navigate to WC
    Then I wait until map is ready for Western Cape

    When I expand Data Mapper
    And I click on "Demographics" in Data Mapper
    And I check if "Migration" on Data Mapper is visible
    And I check if "South African Citizenship" on Data Mapper is visible
    And I click on "Migration" in Data Mapper
    And I click on "Region of birth" in Data Mapper
    And I click on "Male" in Data Mapper
    And I expand the filter dialog

    And I select "30-35" from subIndicator dropdown in filter dialog on row "0"
    And I add new filter
    When I select "language" from indicator dropdown in filter dialog on row "1"
    And I select "English" from subIndicator dropdown in filter dialog on row "1"
    And I collapse Data Mapper

    When I expand Rich Data Panel
    Then I select "language" from indicator dropdown in chart filter
    And I select "Afrikaans" from subIndicator dropdown in chart filter
    And I confirm subcategory "South African Citizenship" at position 2 is "visible"
    And I confirm indicator "Citizenship" at position 2 is "visible"
    And I collapse Rich Data Panel

    When I expand My View Window
    And I click on "INDICATOR OPTIONS" in My View
    Then I confirm that there is an indicator filter for "Data mapper:Region of birth:age:30-35" at index 0
    Then I confirm that there is an indicator filter for "Data mapper:Region of birth:language:English" at index 1
    Then I confirm that there is an indicator filter for "Rich data view:Language most spoken at home:language:Afrikaans" at index 2
    Then I check hidden values text on "MyView-Demographics" is "hidden 0"
    Then I click on "MyView-Demographics" in hidden indicator tree
    Then I click on "MyView-South African Citizenship" in hidden indicator tree
    Then I click on eye icon on "MyView-Citizenship" indicator
    And I check hidden values text on "MyView-Demographics" is "hidden 1"
    Then I collapse My View Window
    Then I expand Data Mapper
    And I check if "South African Citizenship" on Data Mapper is hidden

    Then I expand Rich Data Panel
    And I confirm subcategory "South African Citizenship" at position 0 is "hidden"
    And I confirm indicator "Citizenship" at position 0 is "hidden"
    And I collapse Rich Data Panel

    When I go back to root geography
    Then I expand Rich Data Panel
    And I confirm subcategory "South African Citizenship" at position 0 is "hidden"
    And I confirm indicator "Citizenship" at position 0 is "hidden"
    And I collapse Rich Data Panel
    Then I expand Data Mapper
    And I check if "Migration" on Data Mapper is visible
    And I check if "South African Citizenship" on Data Mapper is hidden
    Then I expand My View Window
    Then I confirm that there is an indicator filter for "Data mapper:Region of birth:age:30-35" at index 0
    Then I confirm that there is an indicator filter for "Data mapper:Region of birth:language:English" at index 1
    And I check hidden values text on "MyView-Demographics" is "hidden 1"
    And I check hidden values text on "MyView-South African Citizenship" is "hidden 1"
    Then I collapse My View Window
    And I expand the filter dialog
    Then I confirm that the choropleth is filtered by "age:30-35" at index 0
    Then I confirm that the choropleth is filtered by "language:English" at index 1
    And I collapse Data Mapper
    Then I expand Rich Data Panel
    And I confirm that the chart is filtered by "language:Afrikaans" at index 0
    And I confirm subcategory "South African Citizenship" at position 0 is "hidden"
    And I confirm indicator "Citizenship" at position 0 is "hidden"
    And I collapse Rich Data Panel
    And I close the filter dialog

    When I go back in browser history
    Then I wait until map is ready for Western Cape
    Then I expand My View Window
    Then I confirm that there is an indicator filter for "Data mapper:Region of birth:age:30-35" at index 0
    Then I confirm that there is an indicator filter for "Data mapper:Region of birth:language:English" at index 1
    And I check hidden values text on "MyView-Demographics" is "hidden 1"
    And I check hidden values text on "MyView-South African Citizenship" is "hidden 1"
    Then I collapse My View Window

    When I expand Data Mapper
    And I check if "Migration" on Data Mapper is visible
    And I check if "South African Citizenship" on Data Mapper is hidden
    And I click on "Male" in Data Mapper
    And I expand the filter dialog
    Then I confirm that the choropleth is filtered by "age:30-35" at index 0
    Then I confirm that the choropleth is filtered by "language:English" at index 1
    And I collapse Data Mapper
    Then I expand Rich Data Panel
    And I confirm that the chart is filtered by "language:Afrikaans" at index 0
    And I confirm subcategory "South African Citizenship" at position 0 is "hidden"
    And I confirm indicator "Citizenship" at position 0 is "hidden"
    Then I confirm category "Demographics" at position 0 is "visible"
    And I collapse Rich Data Panel

    When I go forward in browser history
    And I expand Data Mapper
    And I check if "Migration" on Data Mapper is visible
    And I check if "South African Citizenship" on Data Mapper is hidden
    Then I wait until map is ready
    Then I expand My View Window
    Then I confirm that there is an indicator filter for "Data mapper:Region of birth:age:30-35" at index 0
    Then I confirm that there is an indicator filter for "Data mapper:Region of birth:language:English" at index 1
    And I check hidden values text on "MyView-Demographics" is "hidden 1"
    And I check hidden values text on "MyView-South African Citizenship" is "hidden 1"
    Then I collapse My View Window
    And I expand the filter dialog
    Then I confirm that the choropleth is filtered by "age:30-35" at index 0
    Then I confirm that the choropleth is filtered by "language:English" at index 1
    And I collapse Data Mapper
    Then I expand Rich Data Panel
    And I confirm that the chart is filtered by "language:Afrikaans" at index 0
    Then I confirm category "Demographics" at position 0 is "visible"
    Then I confirm subcategory "South African Citizenship" at position 0 is "hidden"
    Then I confirm indicator "Citizenship" at position 0 is "hidden"
    And I collapse Rich Data Panel
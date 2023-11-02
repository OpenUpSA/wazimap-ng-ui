Feature: Sharing url

  Scenario: Verify adding/removing an indicator-specific filter & hidden indicators, copy a URL, and go to that URL results in same filters applied on Data mapper and Rich data view.
    Given I am on the Wazimap Homepage
    Then I wait until map is ready

    When I expand Data Mapper
    And I click on "Demographics" in Data Mapper
    And I click on "Language" in Data Mapper
    And I click on "Language most spoken at home" in Data Mapper
    And I click on "15-19" in Data Mapper
    And I check if "Migration" on Data Mapper is visible
    And I expand the filter dialog

    When I select "gender" from indicator dropdown in filter dialog on row "0"
    And I select "Male" from subIndicator dropdown in filter dialog on row "0"
    And I add new filter
    And I select "language" from indicator dropdown in filter dialog on row "1"
    And I select "English" from subIndicator dropdown in filter dialog on row "1"
    And I expand My View Window
    And I click on "INDICATOR OPTIONS" in My View
    And I click on "MyView-Demographics" in hidden indicator tree
    And I click on "MyView-Migration" in hidden indicator tree
    And I click on eye icon on "MyView-Region of birth" indicator
    And I check if "Migration" on Data Mapper is hidden
    Then I visit current url
    Then I wait until map is ready

    When I expand Data Mapper
    And I click on "Demographics" in Data Mapper
    And I check if "Migration" on Data Mapper is hidden
    And I click on "Language" in Data Mapper
    And I click on "Language most spoken at home" in Data Mapper
    And I click on "15-19" in Data Mapper
    And I expand the filter dialog
    Then I confirm that the choropleth is filtered by "gender:Male" at index 0
    Then I confirm that the choropleth is filtered by "language:English" at index 1
    Then I confirm that the add new filter button exists

    When I expand My View Window
    And I click on "INDICATOR OPTIONS" in My View
    Then I confirm that there is an indicator filter for "Data mapper:Language most spoken at home:gender:Male" at index 0
    Then I confirm that there is an indicator filter for "Data mapper:Language most spoken at home:language:English" at index 1
    And I click on "MyView-Demographics" in hidden indicator tree
    And I check hidden values text on "MyView-Migration" is "hidden 1"
    And I check hidden values text on "MyView-Demographics" is "hidden 1"
    Then I collapse My View Window
    Then I remove filter from mapchip
    And I expand Rich Data Panel
    Then I confirm category "Demographics" at position 0 is "visible"
    Then I confirm subcategory "Language" at position 0 is "visible"
    Then I confirm indicator "Language most spoken at home" at position 0 is "visible"
    Then I confirm subcategory "Migration" at position 0 is "hidden"
    Then I confirm indicator "Region of birth" at position 0 is "hidden"

    When I select "language" from indicator dropdown in chart filter
    And I select "Afrikaans" from subIndicator dropdown in chart filter
    Then I visit current url
    Then I wait until map is ready

    When I expand Data Mapper
    And I click on "Demographics" in Data Mapper
    And I click on "Language" in Data Mapper
    And I click on "Language most spoken at home" in Data Mapper
    And I click on "15-19" in Data Mapper
    And I expand the filter dialog
    Then I confirm that the choropleth is filtered by "gender:Male" at index 0
    And I expand Rich Data Panel
    Then I confirm that the chart is filtered by "language:Afrikaans" at index 0
    Then I confirm category "Demographics" at position 0 is "visible"
    Then I confirm subcategory "Language" at position 0 is "visible"
    Then I confirm indicator "Language most spoken at home" at position 0 is "visible"
    Then I confirm subcategory "Migration" at position 0 is "hidden"
    Then I confirm indicator "Region of birth" at position 0 is "hidden"
    And I collapse Rich Data Panel

    When I expand My View Window
    And I click on "INDICATOR OPTIONS" in My View
    Then I confirm that there is an indicator filter for "Data mapper:Language most spoken at home:gender:Male" at index 1
    Then I confirm that there is an indicator filter for "Rich data view:Language most spoken at home:language:Afrikaans" at index 0
    And I remove the indicator filter at index 1
    And I click on "MyView-Demographics" in hidden indicator tree
    And I check hidden values text on "MyView-Migration" is "hidden 1"
    And I check hidden values text on "MyView-Demographics" is "hidden 1"
    And I click on "MyView-Migration" in hidden indicator tree
    And I click on eye close icon on "MyView-Region of birth" indicator
    Then I visit current url
    Then I wait until map is ready

    When I expand Data Mapper
    And I click on "Demographics" in Data Mapper
    And I click on "Migration" in Data Mapper
    And I click on "Region of birth" in Data Mapper
    And I click on "Male" in Data Mapper
    And I expand the filter dialog
    Then I confirm that the choropleth is filtered by "age:15-19" at index 0
    And I expand Rich Data Panel
    Then I confirm that the chart is filtered by "language:Afrikaans" at index 0
    Then I confirm category "Demographics" at position 0 is "visible"
    Then I confirm subcategory "Language" at position 0 is "visible"
    Then I confirm indicator "Language most spoken at home" at position 0 is "visible"
    Then I confirm subcategory "Migration" at position 1 is "visible"
    Then I confirm indicator "Region of birth" at position 1 is "visible"
    And I collapse Rich Data Panel

    When I expand My View Window
    Then I confirm that there is an indicator filter for "Rich data view:Language most spoken at home:language:Afrikaans" at index 0
    And I check hidden values text on "MyView-Demographics" is "hidden 0"
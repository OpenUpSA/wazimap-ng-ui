Feature: Sharing url

  Scenario: Verify adding/removing an indicator-specific filter, copy a URL, and go to that URL results in same filters applied on Data mapper and Rich data view.
    Given I am on the Wazimap Homepage
    Then I wait until map is ready

    When I expand Data Mapper
    And I click on "Demographics" in Data Mapper
    And I click on "Language" in Data Mapper
    And I click on "Language most spoken at home" in Data Mapper
    And I click on "15-19" in Data Mapper
    And I expand the filter dialog

    When I select "gender" from indicator dropdown in filter dialog on row "0"
    And I select "Male" from subIndicator dropdown in filter dialog on row "0"
    And I add new filter
    And I select "language" from indicator dropdown in filter dialog on row "1"
    And I select "English" from subIndicator dropdown in filter dialog on row "1"
    Then I visit current url
    Then I wait until map is ready

    When I expand Data Mapper
    And I click on "Demographics" in Data Mapper
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
    Then I collapse My View Window
    Then I remove filter from mapchip
    And I expand Rich Data Panel

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
    And I collapse Rich Data Panel

    When I expand My View Window
    And I click on "INDICATOR OPTIONS" in My View
    Then I confirm that there is an indicator filter for "Data mapper:Language most spoken at home:gender:Male" at index 1
    Then I confirm that there is an indicator filter for "Rich data view:Language most spoken at home:language:Afrikaans" at index 0
    And I remove the indicator filter at index 1
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
    And I collapse Rich Data Panel

    When I expand My View Window
    And I click on "INDICATOR OPTIONS" in My View
    Then I confirm that there is an indicator filter for "Rich data view:Language most spoken at home:language:Afrikaans" at index 0

  Scenario: Verify history when user clicks on back or forward button

    Given I am on the Wazimap Homepage
    Then I wait until map is ready

    When I expand Data Mapper
    And I click on "Demographics" in Data Mapper
    And I click on "Migration" in Data Mapper
    And I click on "Region of birth" in Data Mapper
    And I click on "Male" in Data Mapper
    And I expand the filter dialog

    And I select "30-35" from subIndicator dropdown in filter dialog on row "0"
    When I select "language" from indicator dropdown in filter dialog on row "1"
    And I select "English" from subIndicator dropdown in filter dialog on row "1"
    And I collapse Data Mapper

    When I expand Rich Data Panel
    Then I select "language" from indicator dropdown in chart filter
    And I select "Afrikaans" from subIndicator dropdown in chart filter
    And I collapse Rich Data Panel

    When I expand My View Window
    And I click on "INDICATOR OPTIONS" in My View
    Then I confirm that there is an indicator filter for "Data mapper:Region of birth:age:30-35" at index 0
    Then I confirm that there is an indicator filter for "Data mapper:Region of birth:language:English" at index 1
    Then I confirm that there is an indicator filter for "Rich data view:Language most spoken at home:language:Afrikaans" at index 2
    Then I collapse My View Window

    When I go back in browser history
    Then I expand My View Window
    And I click on "INDICATOR OPTIONS" in My View
    Then I confirm that there is an indicator filter for "Data mapper:Region of birth:age:30-35" at index 0
    Then I confirm that there is an indicator filter for "Data mapper:Region of birth:language:English" at index 1
    Then I collapse My View Window
    And I expand the filter dialog
    Then I confirm that the choropleth is filtered by "age:30-35" at index 0
    Then I confirm that the choropleth is filtered by "language:English" at index 1
    And I collapse Data Mapper
    Then I expand Rich Data Panel
    And I confirm that the chart is not filtered
    And I collapse Rich Data Panel

    When I go back in browser history
    Then I expand My View Window
    And I click on "INDICATOR OPTIONS" in My View
    Then I confirm that there is an indicator filter for "Data mapper:Region of birth:age:30-35" at index 0
    Then I collapse My View Window
    And I expand the filter dialog
    Then I confirm that the choropleth is filtered by "age:30-35" at index 0
    And I collapse Data Mapper
    Then I expand Rich Data Panel
    And I confirm that the chart is not filtered
    And I collapse Rich Data Panel

    When I go back in browser history
    Then I expand My View Window
    And I click on "INDICATOR OPTIONS" in My View
    Then I confirm that there are no filters in my view panel
    Then I collapse My View Window
    And I expand the filter dialog
    Then I confirm that the choropleth is filtered by "age:15-19" at index 0
    And I collapse Data Mapper
    Then I expand Rich Data Panel
    And I confirm that the chart is not filtered
    And I collapse Rich Data Panel

    When I go forward in browser history
    Then I expand My View Window
    And I click on "INDICATOR OPTIONS" in My View
    Then I confirm that there is an indicator filter for "Data mapper:Region of birth:age:30-35" at index 0
    Then I collapse My View Window
    And I expand the filter dialog
    Then I confirm that the choropleth is filtered by "age:30-35" at index 0
    And I collapse Data Mapper
    Then I expand Rich Data Panel
    And I confirm that the chart is not filtered
    And I collapse Rich Data Panel

    When I go forward in browser history
    Then I expand My View Window
    And I click on "INDICATOR OPTIONS" in My View
    Then I confirm that there is an indicator filter for "Data mapper:Region of birth:age:30-35" at index 0
    Then I collapse My View Window
    And I expand the filter dialog
    Then I confirm that the choropleth is filtered by "age:30-35" at index 0
    And I collapse Data Mapper
    Then I expand Rich Data Panel
    And I confirm that the chart is not filtered
    And I collapse Rich Data Panel

    When I go forward in browser history
    Then I expand My View Window
    And I click on "INDICATOR OPTIONS" in My View
    Then I confirm that there is an indicator filter for "Data mapper:Region of birth:age:30-35" at index 0
    Then I confirm that there is an indicator filter for "Data mapper:Region of birth:language:English" at index 1
    Then I collapse My View Window
    And I expand the filter dialog
    Then I confirm that the choropleth is filtered by "age:30-35" at index 0
    Then I confirm that the choropleth is filtered by "language:English" at index 1
    And I collapse Data Mapper
    Then I expand Rich Data Panel
    And I confirm that the chart is filtered by "language:Afrikaans" at index 0
    And I collapse Rich Data Panel

  Scenario: Verify navigating between geographies retains filters

    Given I am on the Wazimap Homepage
    Then I wait until map is ready

    When I navigate to WC
    Then I wait until map is ready for Western Cape

    When I expand Data Mapper
    And I click on "Demographics" in Data Mapper
    And I click on "Migration" in Data Mapper
    And I click on "Region of birth" in Data Mapper
    And I click on "Male" in Data Mapper
    And I expand the filter dialog

    And I select "30-35" from subIndicator dropdown in filter dialog on row "0"
    When I select "language" from indicator dropdown in filter dialog on row "1"
    And I select "English" from subIndicator dropdown in filter dialog on row "1"
    And I collapse Data Mapper

    When I expand Rich Data Panel
    Then I select "language" from indicator dropdown in chart filter
    And I select "Afrikaans" from subIndicator dropdown in chart filter
    And I collapse Rich Data Panel

    When I expand My View Window
    And I click on "INDICATOR OPTIONS" in My View
    Then I confirm that there is an indicator filter for "Data mapper:Region of birth:age:30-35" at index 0
    Then I confirm that there is an indicator filter for "Data mapper:Region of birth:language:English" at index 1
    Then I confirm that there is an indicator filter for "Rich data view:Language most spoken at home:language:Afrikaans" at index 2
    Then I collapse My View Window

    When I go back to root geography
    Then I expand My View Window
    And I click on "INDICATOR OPTIONS" in My View
    Then I confirm that there is an indicator filter for "Data mapper:Region of birth:age:30-35" at index 0
    Then I confirm that there is an indicator filter for "Data mapper:Region of birth:language:English" at index 1
    Then I collapse My View Window
    And I expand the filter dialog
    Then I confirm that the choropleth is filtered by "age:30-35" at index 0
    Then I confirm that the choropleth is filtered by "language:English" at index 1
    And I collapse Data Mapper
    Then I expand Rich Data Panel
    And I confirm that the chart is filtered by "language:Afrikaans" at index 0
    And I collapse Rich Data Panel
    And I close the filter dialog

    When I go back in browser history
    Then I wait until map is ready for Western Cape
    Then I expand My View Window
    And I click on "INDICATOR OPTIONS" in My View
    Then I confirm that there is an indicator filter for "Data mapper:Region of birth:age:30-35" at index 0
    Then I confirm that there is an indicator filter for "Data mapper:Region of birth:language:English" at index 1
    Then I collapse My View Window

    When I expand Data Mapper
    And I click on "Demographics" in Data Mapper
    And I click on "Migration" in Data Mapper
    And I click on "Region of birth" in Data Mapper
    And I click on "Male" in Data Mapper
    And I expand the filter dialog
    Then I confirm that the choropleth is filtered by "age:30-35" at index 0
    Then I confirm that the choropleth is filtered by "language:English" at index 1
    And I collapse Data Mapper
    Then I expand Rich Data Panel
    And I confirm that the chart is filtered by "language:Afrikaans" at index 0
    And I collapse Rich Data Panel

    When I go forward in browser history
    Then I wait until map is ready
    Then I expand My View Window
    And I click on "INDICATOR OPTIONS" in My View
    Then I confirm that there is an indicator filter for "Data mapper:Region of birth:age:30-35" at index 0
    Then I confirm that there is an indicator filter for "Data mapper:Region of birth:language:English" at index 1
    Then I collapse My View Window
    And I expand the filter dialog
    Then I confirm that the choropleth is filtered by "age:30-35" at index 0
    Then I confirm that the choropleth is filtered by "language:English" at index 1
    And I collapse Data Mapper
    Then I expand Rich Data Panel
    And I confirm that the chart is filtered by "language:Afrikaans" at index 0
    And I collapse Rich Data Panel

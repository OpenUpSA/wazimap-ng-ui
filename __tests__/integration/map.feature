Feature: Map
  All the Map options such as search, zoom, localities, provinces, municipalities etc.

  Scenario Outline: Verify the search functionality by searching Cape town mainplace
    Given I am on the Wazimap Homepage
    And I click on search bar
    And I enter <district> in the search field
    And I select the city of <district> as mainplace
    And I must see country as south africa and other location types
    Examples:
      | district  |
      | cape town |

Scenario: Verify the zoom in and zoom out on map view
  Given I am on the Wazimap Homepage
  And I click on map zoom
  Then map should be zoomed in
  And I click on map zoom out
  Then map should be zoomed out

Scenario Outline: Verify the visibility of the location information of the map
  Given I am on the Wazimap Homepage
  And I click on search bar
  And I enter <district> in the search field
  And I click on search bar
  And I enter <province> in the search field
  And I click on search bar
  And I enter <municipality> in the search field
  And I click on search bar
  And I enter <main place> in the search field
  Examples:
  |district          |province  |municipality|main place  |
  |thabo mofutsanyane|free state|dihlabeng   |dihlabeng nu|

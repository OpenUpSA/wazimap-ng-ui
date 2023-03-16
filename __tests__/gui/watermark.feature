Feature: Watermark

  Scenario: Verify the watermark is displayed correctly
    Given I am on the Wazimap Homepage
    Then I wait until map is ready

    # All the panels are closed
    Then I confirm that the map watermark is visible
    Then I confirm that the watermak links to the correct url

    # Data mapper
    And I expand Data Mapper
    Then I confirm that the data mapper watermark is visible
    
    # Data mapper with scrollbar
    And I click on "Demographics" in Data Mapper
    And I click on "South African Citizenship" in Data Mapper
    And I click on "Citizenship" in Data Mapper
    And I click on "Language" in Data Mapper
    And I click on "Language most spoken at home" in Data Mapper
    Then I confirm that the data mapper watermark is visible

    # Point mapper
    And I expand Point Mapper
    Then I confirm that the point mapper watermark is visible
    
    # Point mapper with scrollbar
    And I click on "Test Theme 2" in Point Mapper
    And I click on "Test Theme" in Point Mapper
    And I click on "Higher Education" in Point Mapper
    And I click on "Labour" in Point Mapper
    Then I confirm that the point mapper watermark is visible

    # Rich data
    And I expand Rich Data
    Then I confirm that the rich data watermark is visible
    And I collapse Rich Data Nav
    Then I confirm that the rich data watermark is not visible

    # Map again
    And I collapse Rich Data Panel
    Then I confirm that the map watermark is visible
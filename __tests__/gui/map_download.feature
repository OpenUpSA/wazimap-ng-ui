Feature: Map Download

  Scenario: Verify the map download button closes the left panels
    Given I am on the Wazimap Homepage
    Then I wait until map is ready
    Then Point Mapper should be open
    Then Data Mapper should be closed
    Then Rich Data Panel should be closed
    Then Map download button should have title attribute

    And I click on map download
    Then Point Mapper should be closed
    Then Data Mapper should be closed
    Then Rich Data Panel should be closed
    Then Map download button should not have title attribute
    Then I check if an image of the map is downloaded

    And I expand Point Mapper
    Then Point Mapper should be open
    Then Data Mapper should be closed
    Then Rich Data Panel should be closed
    Then Map download button should have title attribute
    Then I click on map download
    Then Point Mapper should be closed
    Then Data Mapper should be closed
    Then Rich Data Panel should be closed
    Then Map download button should not have title attribute
    Then I check if an image of the map is downloaded

    And I expand Data Mapper
    Then Data Mapper should be open
    Then Point Mapper should be closed
    Then Rich Data Panel should be closed
    Then Map download button should have title attribute
    Then I click on map download
    Then Data Mapper should be closed
    Then Point Mapper should be closed
    Then Rich Data Panel should be closed
    Then Map download button should not have title attribute
    Then I check if an image of the map is downloaded

    And I expand Rich Data Panel
    Then Rich Data Panel should be open
    Then Point Mapper should be closed
    Then Data Mapper should be closed
    Then Map download button should have title attribute
    Then I click on map download
    Then Rich Data Panel should be closed
    Then Data Mapper should be closed
    Then Point Mapper should be closed
    Then Map download button should not have title attribute
    Then I check if an image of the map is downloaded

    # test the downloaded image
    And I expand Data Mapper
    And I click on "Elections" in Data Mapper
    And I click on "2016 Municipal elections" in Data Mapper
    And I click on "Voter turnout" in Data Mapper
    And I click on "Voted" in Data Mapper
    And I expand Point Mapper
    And I click on "Higher Education" in Point Mapper
    And I click on "TVET colleges" in Point Mapper
    And I click on map download
    Then I wait until the image of the map is downloaded
    Then I compare the downloaded image with the reference
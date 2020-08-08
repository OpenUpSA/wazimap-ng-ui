# Created by siddharththakur at 31/07/20

# Enter feature name here
Feature: Data mapper visibility
  # Enter feature description here
  Data Mapper Contents are checked for their visibility.
  # Enter scenario name here
  Scenario: Check for visibility of data mapper panel.
    # Enter steps here
    Given I am on the Wazimap Homepage
    When I click on Data Mapper icon
    Then User must see the data mapper panel header

  Scenario: Check for visibility of Demographic menu item
    Given I am on the Wazimap Homepage
    When I click on Data Mapper icon
    And I click on Demographic menu item
    Then User must see Demographic menu with its all 6 sub items

  Scenario: Check for visibility of Youth Population sub-item under Age item
    Given I am on the Wazimap Homepage
    When I click on Data Mapper icon
    And I click on Demographic menu item
    And I click on Age sub-item
    Then User must see the Youth population under the Age item

  Scenario: Check for visibility of Youths and Non youths under Youth population
    Given I am on the Wazimap Homepage
    When I click on Data Mapper icon
    And I click on Demographic menu item
    And I click on Age sub-item
    And I click on Youth Population
    Then User must see the Youths and Non Youths

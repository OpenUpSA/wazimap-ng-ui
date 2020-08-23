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

  Scenario: Verify the categories and sub categories of demographic are displayed
    Given I am on the Wazimap Homepage
    When I click on Data Mapper icon
    Then User must see the data mapper panel header
    And I click on Demographic menu item
    Then User must see Demographic menu with its all 6 sub items
    And I click on Age sub-item
    Then User must see Age Group and Population
    And I click on Gender sub-item
    Then User must see Gender under Gender sub-item
    And I click on Race sub-item
    Then User must see Race under Race sub-item
    And I click on Region of Birth sub-item
    Then User must see Region of Birth under Region of Birth sub-item
    And I click on Citizenship sub-item
    Then User must see Citizenship under Citizenship sub-item
    And I click on Language sub-item
    Then User must see Language test under Language sub-item

  Scenario: Verify the sub categories of water under the category of population are displayed
    Given I am on the Wazimap Homepage
    When I click on Data Mapper icon
    Then User must see the data mapper contents
    And Click on Population category
    Then Households sub category should be displayed
    And Click on Households sub category
    Then Water services sub-category should be displayed
    And Click on Water services sub-category
    Then Water services sub-categories should be displayed




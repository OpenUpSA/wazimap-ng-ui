Feature: Initial Page Load

  Scenario Outline: Page Title
    Given I am on the "<Profile>" Homepage
    Then I should see a Geography in the breadcrumps
    And I should see a title in the Rich Data View

    Examples:
      | Profile |
      | Youth Explorer |
      | GCRO |

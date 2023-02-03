Feature: Error Handling

  Scenario: Verify that exceptions are handled globally
    Given I intercept the requests and respond null to force error
      Then An alert message should be shown
      Then I check if the title is correct
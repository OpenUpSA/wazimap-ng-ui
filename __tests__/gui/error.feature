Feature: Error Handling

  Scenario: Verify that exceptions are handled globally
    Given I intercept the requests and respond null
      Then An alert message should be shown
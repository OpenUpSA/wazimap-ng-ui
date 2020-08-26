from behave import *
from pages.tutorial_locators import *
import time


@when("I click on tutorial")
def step_impl(context):
    tutorial_xpath = context.common.find_element_by_xpath(tutorial)
    context.common.click_item(tutorial_xpath)


@step("I click on next")
def step_impl(context):
    next_button_xpath = context.common.find_element_by_xpath(tutorial_next_button)
    context.common.click_item(next_button_xpath)


@step("I click on back arrow")
def step_impl(context):
    back_button_xpath = context.common.find_element_by_xpath(tutorial_back_button)
    context.common.click_item(back_button_xpath)


tutorial_close_button_xpath=None


@then("I click on close arrow")
def step_impl(context):
    global tutorial_close_button_xpath
    tutorial_close_button_xpath = context.common.find_element_by_xpath(tutorial_close_button)
    context.common.click_item(tutorial_close_button_xpath)


@then("Tutorial dialog box and Introduction should be displayed")
def step_impl(context):
    tutorial_header_xpath = context.common.find_element_by_xpath(tutorial_header)
    assert True==tutorial_header_xpath.is_displayed(), "Tutorial dailog box is not visible"


@then("Location Search details should be displayed")
def step_impl(context):
    tutorial_location_search_xpath = context.common.find_element_by_xpath(tutorial_location_search)
    assert True==tutorial_location_search_xpath.is_displayed(), "Location Search details are not displayed"


@then("Location Panel details should be displayed")
def step_impl(context):
    tutorial_location_panel_xpath = context.common.find_element_by_xpath(tutorial_location_panel)
    assert tutorial_location_panel_xpath.is_displayed()==True, "Location Panel details are not displayed"


@then("Rich data details should be displayed")
def step_impl(context):
    tutorial_rich_data_xpath = context.common.find_element_by_xpath(tutorial_rich_data)
    assert tutorial_rich_data_xpath.is_displayed()==True, "Rich Data details are not displayed"


@then("Point mapper details should be displayed")
def step_impl(context):
    tutorial_point_mapper_xpath = context.common.find_element_by_xpath(tutorial_point_mapper)
    assert tutorial_point_mapper_xpath.is_displayed()==True, "Point Mapper details are not displayed"


@then("Data mapper details should be displayed")
def step_impl(context):
    tutorial_point_mapper_xpath = context.common.find_element_by_xpath(tutorial_point_mapper)
    assert tutorial_point_mapper_xpath.is_displayed()==True, "Location Panel details are not displayed"


@then("Data Filtering should be displayed")
def step_impl(context):
    tutorial_data_filtering_xpath = context.common.find_element_by_xpath(tutorial_data_filtering)
    assert True==tutorial_data_filtering_xpath.is_displayed(), "Back arrow in tutorial not working"


@then("Learn More should be displayed")
def step_impl(context):
    tutorial_learn_more_xpath = context.common.find_element_by_xpath(tutorial_learn_more)
    assert tutorial_learn_more_xpath.is_displayed()==True, "Learn More details are not displayed"


@step("Tutorial dialog box and Introduction should not be displayed")
def step_impl(context):
    time.sleep(1)
    assert tutorial_close_button_xpath.is_displayed()==False, "Tutorial is still opened."

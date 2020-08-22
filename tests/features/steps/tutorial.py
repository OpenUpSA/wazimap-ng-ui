from behave import *
from pages.locators import tutorial,tutorial_header,tutorial_back_button,tutorial_close_button,\
    tutorial_data_filtering,tutorial_next_button,tutorial_list
import time
@when("I click on tutorial")
def step_impl(context):
    tutorial_xpath = context.common.find_element_by_xpath(tutorial)
    context.common.click_item(tutorial_xpath)
    tutorial_header_xpath = context.common.find_element_by_xpath(tutorial_header)
    assert True==tutorial_header_xpath.is_displayed(),"Tutorial dailog box is not visible"


page_no = 0


@step("I click on next")
def step_impl(context):
    global page_no
    next_button_xpath = context.common.find_element_by_xpath(tutorial_next_button)
    tutorial_xpath = context.common.find_element_by_xpath(tutorial_list[page_no])
    assert True==tutorial_xpath.is_displayed(),"tutorial component is not visbile"
    context.common.click_item(next_button_xpath)
    page_no += 1


@step("I click on back arrow")
def step_impl(context):

    back_button_xpath = context.common.find_element_by_xpath(tutorial_back_button)
    context.common.click_item(back_button_xpath)
    tutorial_data_filtering_xpath = context.common.find_element_by_xpath(tutorial_data_filtering)
    assert True==tutorial_data_filtering_xpath.is_displayed(), "Back arrow in tutorial not working"


@then("I click on close arrow")
def step_impl(context):
    tutorial_close_button_xpath = context.common.find_element_by_xpath(tutorial_close_button)
    context.common.click_item(tutorial_close_button_xpath)
    time.sleep(1)
    assert False == tutorial_close_button_xpath.is_displayed(), "Sandbox doesn't get closed"




from behave import *
from pages.map_locators import *
import time


@step("I click on search bar")
def step_impl(context):
    map_search_location_xpath = context.common.find_element_by_xpath(map_search_location)
    context.common.click_item(map_search_location_xpath)


@step("I enter cape town in the search field")
def step_impl(context):
    context.common.write_text(map_search_cape_town_text)


@step("I select the city of cape town as municipality")
def step_impl(context):
    context.common.click_element_via_javascript_executor(map_search_cape_town)


@then("User must see country as south africa, province as western cape and municipalities as city of cape town")
def step_impl(context):
    time.sleep(3)
    map_search_cape_town_country_xpath = context.common.find_element_by_xpath(map_search_cape_town_country)
    map_search_cape_town_province_xpath = context.common.find_element_by_xpath(map_search_cape_town_province)
    map_search_cape_town_municipality_xpath = context.common.find_element_by_xpath(map_search_cape_town_municipality)
    assert True == map_search_cape_town_country_xpath.is_displayed(), "Country name is not displayed"
    assert True==map_search_cape_town_province_xpath.is_displayed(), "Province name is not displayed"
    assert True==map_search_cape_town_municipality_xpath.is_displayed(), "Municipality name is not displayed"

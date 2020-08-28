from behave import *
from pages.map_locators import *
import time
import base64

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
    time.sleep(8)
    map_search_cape_town_country_xpath = context.common.find_element_by_xpath(map_search_cape_town_country)
    map_search_cape_town_province_xpath = context.common.find_element_by_xpath(map_search_cape_town_province)
    map_search_cape_town_municipality_xpath = context.common.find_element_by_xpath(map_search_cape_town_municipality)
    assert True == map_search_cape_town_country_xpath.is_displayed(), "Country name is not displayed"
    assert True==map_search_cape_town_province_xpath.is_displayed(), "Province name is not displayed"
    assert True==map_search_cape_town_municipality_xpath.is_displayed(), "Municipality name is not displayed"


map_original_view = None


@step("I click on '+'")
def step_impl(context):
    global map_original_view
    map_point_mapper_content_disable = "//div[@class='panel-toggle point-mapper-panel__close cc-active']//div[@class='svg-icon w-embed']"
    context.common.click_element_via_javascript_executor(map_point_mapper_content_disable)
    time.sleep(5)
    map_original_view = base64.b64decode(context.driver.get_screenshot_as_png())
    map_zoom_in_xpath = context.common.find_element_by_xpath(map_zoom_in)
    context.common.click_item(map_zoom_in_xpath)


@then("map should be zoomed in")
def step_impl(context):
    map_zoom_in_view = base64.b64decode(context.driver.get_screenshot_as_png())
    assert list(bytes(map_original_view)) != list(bytes(map_zoom_in_view)), "Map wasn't zoomed"


@step("I click on '-'")
def step_impl(context):
    context.common.click_element_via_javascript_executor(map_zoom_out)
    time.sleep(5)


@then("map should be zoomed out")
def step_impl(context):
    map_zoom_out_view  = base64.b64decode(context.driver.get_screenshot_as_png())
    time.sleep(8)
    assert list(bytes(map_original_view))==list(bytes(map_zoom_out_view)), "Map wasn't zoomed out"


@then("User must see the profile highlights")
def step_impl(context):
    map_profile_highlight_age_percentage = "//div[contains(text(),'% 20 - 24 year olds')]"
    map_profile_highlight_female_population = "//div[contains(text(),'female population')]"
    map_profile_highlight_problem_communication = "//div[@class='location-highlight__title'][contains(text(),'Problems communicating')]"
    map_profile_highlight_age_percentage_xpath = context.common.find_element_by_xpath(map_profile_highlight_age_percentage)
    map_profile_highlight_female_population_xpath = context.common.find_element_by_xpath(map_profile_highlight_female_population)
    map_profile_highlight_problem_communication_xpath = context.common.find_element_by_xpath(map_profile_highlight_problem_communication)
    assert True == map_profile_highlight_age_percentage_xpath.is_displayed(),"Age percentage is not displayed"
    assert True == map_profile_highlight_female_population_xpath.is_displayed(),"Female Population is not displayed"
    assert True == map_profile_highlight_problem_communication_xpath.is_displayed(),"Problem Communication is not displayed"


@step("I select the {text}")
def step_impl(context, text):
    map_search_location_xpath = context.common.find_element_by_xpath(map_search_location)
    context.common.click_item(map_search_location_xpath)
    context.common.write_text(text)
    map_search = "//div[@class='search__dropdown_content']//div[1]//div[1]//div[1]//div[1]"
    context.common.click_element_via_javascript_executor(map_search)
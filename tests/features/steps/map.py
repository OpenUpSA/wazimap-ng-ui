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
    time.sleep(3)
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
    time.sleep(2)
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
    time.sleep(2)


@then("map should be zoomed out")
def step_impl(context):
    map_zoom_out_view  = base64.b64decode(context.driver.get_screenshot_as_png())
    time.sleep(2)
    assert list(bytes(map_original_view))==list(bytes(map_zoom_out_view)), "Map wasn't zoomed out"
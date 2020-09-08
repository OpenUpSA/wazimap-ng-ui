from behave import *
from pages.locators import Map
import time
from pages.pages import *


@step("I click on search bar")
def step_impl(context):
    map_search_location_xpath = context.common.find_element_by_xpath(Map.map_search_location)
    context.common.click_item(map_search_location_xpath)


@step("I enter cape town in the search field")
def step_impl(context):
    context.common.write_text(Map.map_search_cape_town_text)


@step("I select the city of cape town as municipality")
def step_impl(context):
    context.common.click_element_via_javascript_executor(Map.map_search_cape_town)


@then("User must see country as south africa, province as western cape and municipalities as city of cape town")
def step_impl(context):
    time.sleep(8)
    map_search_cape_town_country_xpath = context.common.find_element_by_xpath(Map.map_search_cape_town_country)
    map_search_cape_town_province_xpath = context.common.find_element_by_xpath(Map.map_search_cape_town_province)
    map_search_cape_town_municipality_xpath = context.common.find_element_by_xpath(Map.map_search_cape_town_municipality)
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
    map_original_view = context.common.decode_base_64_png(context.common.get_screenshot_base_64())
    map_zoom_in_xpath = context.common.find_element_by_xpath(Map.map_zoom_in)
    context.common.click_item(map_zoom_in_xpath)


@then("map should be zoomed in")
def step_impl(context):
    map_zoom_in_view = context.common.decode_base_64_png(context.common.get_screenshot_base_64())
    assert list(bytes(map_original_view)) != list(bytes(map_zoom_in_view)), "Map wasn't zoomed"


@step("I click on '-'")
def step_impl(context):
    context.common.click_element_via_javascript_executor(Map.map_zoom_out)
    time.sleep(8)


@then("map should be zoomed out")
def step_impl(context):
    map_zoom_out_view  = context.common.decode_base_64_png(context.common.get_screenshot_base_64())
    #time.sleep(8)
    assert list(bytes(map_original_view))==list(bytes(map_zoom_out_view)), "Map wasn't zoomed out"


@then("User must see the profile highlights")
def step_impl(context):
    map_profile_highlight_age_percentage_xpath = context.common.find_element_by_xpath(Map.map_profile_highlight_age_percentage)
    map_profile_highlight_female_population_xpath = context.common.find_element_by_xpath(Map.map_profile_highlight_female_population)
    map_profile_highlight_problem_communication_xpath = context.common.find_element_by_xpath(Map.map_profile_highlight_problem_communication)
    assert True == map_profile_highlight_age_percentage_xpath.is_displayed(),"Age percentage is not displayed"
    assert True == map_profile_highlight_female_population_xpath.is_displayed(),"Female Population is not displayed"
    assert True == map_profile_highlight_problem_communication_xpath.is_displayed(),"Problem Communication is not displayed"


@step("I select the {text}")
def step_impl(context, text):
    if text == "Northern Cape" or text == "Free state":
        context.obj = Province(context.driver)
    elif text=="Namakwa" or text == "Thabo Mofutsanyane":
        context.obj = District(context.driver)
    elif text == "Karoo Hoogland" or text == "Dihlabeng":
        context.obj = Municipality(context.driver)
    elif text == "Sutherland" or "Dihlabeng NU":
        context.obj = Mainplace(context.driver)

    map_search_location_xpath = context.obj.find_element_by_xpath(Map.map_search_location)
    context.obj.click_item(map_search_location_xpath)
    context.obj.write_text(text)
    context.obj.click_element_via_javascript_executor(Map.map_search_result_first)


@then("User must be able to see the map of province")
def step_impl(context):
    canvas_xpath = context.obj.find_element_by_xpath(Map.canvas)
    time.sleep(5)
    canvas_base64 = context.obj.get_image_from_canvas_execute_script(canvas_xpath)
    canvas_png = context.obj.decode_base_64_png(canvas_base64)
    province_northern_cape_image_path = "{}/tests_actual_results/test_scenario_1/map_province_northern_cape.png".format(context.path)
    actual_image_string = context.obj.get_string_from_image(province_northern_cape_image_path)
    assert list(bytes(actual_image_string))==list(bytes(canvas_png)), "Province is not displayed"


@then("User must be able to see the map of district")
def step_impl(context):
    canvas_xpath = context.obj.find_element_by_xpath(Map.canvas)
    time.sleep(5)
    canvas_base64 = context.obj.get_image_from_canvas_execute_script(canvas_xpath)
    canvas_png = context.obj.decode_base_64_png(canvas_base64)
    district_nanakwa_image_path = "{}/tests_actual_results/test_scenario_1/map_district_namakwa.png".format(context.path)
    actual_image_string = context.obj.get_string_from_image(district_nanakwa_image_path)
    assert list(bytes(actual_image_string))==list(bytes(canvas_png)), "Province is not displayed"


@then("User must be able to see the map of municipality")
def step_impl(context):
    canvas_xpath = context.obj.find_element_by_xpath(Map.canvas)
    time.sleep(5)
    canvas_base64 = context.obj.get_image_from_canvas_execute_script(canvas_xpath)
    canvas_png = context.obj.decode_base_64_png(canvas_base64)
    municipality_karoo_hoogland_image_path ="{}/tests_actual_results/test_scenario_1/map_municipality_karoo_hoogland.png".format(context.path)
    actual_image_string = context.obj.get_string_from_image(municipality_karoo_hoogland_image_path)
    assert list(bytes(actual_image_string))==list(bytes(canvas_png)), "Province is not displayed"


@then("User must be able to see the map of main place")
def step_impl(context):
    canvas_xpath = context.obj.find_element_by_xpath(Map.canvas)
    time.sleep(5)
    canvas_base64 = context.obj.get_image_from_canvas_execute_script(canvas_xpath)
    canvas_png = context.obj.decode_base_64_png(canvas_base64)
    mainplace_sutherland_image_path = "{}/tests_actual_results/test_scenario_1/map_mainplace_sutherland.png".format(context.path)
    actual_image_string = context.obj.get_string_from_image(mainplace_sutherland_image_path)
    assert list(bytes(actual_image_string))==list(bytes(canvas_png)), "Province is not displayed"

from behave import *
import time

map_original_view = None
boolean = True


@step("I click on Grocery store toggle switch")
def step_impl(context):
    global map_original_view, boolean
    if boolean:
        time.sleep(5)
        map_original_view = context.common.decode_base_64_png(context.common.get_screenshot_base_64())
        boolean = False
    point_mapper_grocery_store_slider = "//div[@class='point-mapper-content__list']//span[@class='slider round']"
    context.common.click_element_via_javascript_executor(point_mapper_grocery_store_slider)


@then("User must see the Grocery stores highlights on the map")
def step_impl(context):
    time.sleep(8)
    point_map_grocery_stores_view = context.common.decode_base_64_png(context.common.get_screenshot_base_64())
    assert list(bytes(point_map_grocery_stores_view))!=list(bytes(map_original_view)), "Grocery stores are not displayed"


@then("User must not see the Grocery stores highlights on the map")
def step_impl(context):
    time.sleep(8)
    point_map_grocery_stores_toggle_off_view = context.common.decode_base_64_png(context.common.get_screenshot_base_64())
    assert list(bytes(map_original_view))==list(bytes(point_map_grocery_stores_toggle_off_view)), "Grocery stores are still geting displayed"

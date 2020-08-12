from behave import *
from pages.locators import age, youths, data_mapper_svg_icon, youth_population, citizen, race, rob, language,\
    non_youths, gender, demographic_menu, data_mapper_header,profile_logo


@given("I am on the Wazimap Homepage")
def step_impl(context):
    # url = "https://wazimap-ng.africa/"
    url = "http://localhost:80"
    context.common.get_url(url)
    profile_logo_xpath = context.common.find_element_by_xpath(profile_logo)
    assert profile_logo_xpath.is_displayed()==True, 'Homepage is not loaded properly'


@when("I click on Data Mapper icon")
def step_impl(context):
    data_mapper_icon_xpath = context.common.find_element_by_xpath(data_mapper_svg_icon)
    context.common.click_item(data_mapper_icon_xpath)


@then("User must see the data mapper panel header")
def step_impl(context):
    data_mapper_header_xpath = context.common.find_element_by_xpath(data_mapper_header)
    assert data_mapper_header_xpath.is_displayed()==True, 'Data Mapper is not displayed'


@step("I click on Demographic menu item")
def step_impl(context):
    demographic_menu_xpath = context.common.find_element_by_xpath(demographic_menu)
    context.common.click_item(demographic_menu_xpath)


@then("User must see Demographic menu with its all 6 sub items")
def step_impl(context):
    age_xpath = context.common.find_element_by_xpath(age)
    gender_xpath = context.common.find_element_by_xpath(gender)
    race_xpath = context.common.find_element_by_xpath(race)
    rob_xpath = context.common.find_element_by_xpath(rob)
    citizen_xpath = context.common.find_element_by_xpath(citizen)
    language_xpath = context.common.find_element_by_xpath(language)
    assert age_xpath.is_displayed()==True, 'Age item is not displayed'
    assert gender_xpath.is_displayed()==True, 'Age item is not displayed'
    assert race_xpath.is_displayed()==True, 'Age item is not displayed'
    assert rob_xpath.is_displayed()==True, 'Age item is not displayed'
    assert citizen_xpath.is_displayed()==True, 'Age item is not displayed'
    assert language_xpath.is_displayed()==True, 'Age item is not displayed'


@step("I click on Age sub-item")
def step_impl(context):
    age_xpath = context.common.find_element_by_xpath(age)
    context.common.click_item(age_xpath)


@then("User must see the Youth population under the Age item")
def step_impl(context):
    youth_population_xpath = context.common.find_element_by_xpath(youth_population)
    assert youth_population_xpath.is_displayed()==True, 'Youth Population is not displayed'


@step("I click on Youth Population")
def step_impl(context):
    youth_population_xpath = context.common.find_element_by_xpath(youth_population)
    context.common.click_item(youth_population_xpath)


@then("User must see the Youths and Non Youths")
def step_impl(context):
    youths_xpath = context.common.find_element_by_xpath(youths)
    non_youths_xpath = context.common.find_element_by_xpath(non_youths)
    assert youths_xpath.is_displayed()==True, 'Youths are not displayed'
    assert non_youths_xpath.is_displayed()==True, 'Non Youths are not displayed'


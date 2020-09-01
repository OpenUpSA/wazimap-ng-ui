from behave import *
from pages.locators import DataMapper
import time
import platform
from pages.pages import Common


@given("I am on the Wazimap Homepage")
def step_impl(context):
    context.common = Common(context.driver)
    if platform.system()=='Darwin':
        url = "http://localhost:1234"
    else:
        url = "http://localhost:80"
    context.common.get_url(url)
    country = "//div[contains(text(),'country')]"
    country_location_xpath = context.common.find_element_by_xpath(country)
    assert country_location_xpath.is_displayed()==True, 'Homepage is not loaded properly'


@when("I click on Data Mapper icon")
def step_impl(context):
    data_mapper_icon_xpath = context.common.find_element_by_xpath(DataMapper.data_mapper_svg_icon)
    context.common.click_item(data_mapper_icon_xpath)


@then("User must see the data mapper panel header")
def step_impl(context):
    data_mapper_header_xpath = context.common.find_element_by_xpath(DataMapper.data_mapper_header)
    assert data_mapper_header_xpath.is_displayed()==True, 'Data Mapper is not displayed'


@step("I click on Demographic menu item")
def step_impl(context):
    demographic_menu_xpath = context.common.find_element_by_xpath(DataMapper.demographic_menu)
    context.common.click_item(demographic_menu_xpath)


@then("User must see Demographic menu with its all 6 sub items")
def step_impl(context):
    time.sleep(8)
    age_xpath = context.common.find_element_by_xpath(DataMapper.age)
    gender_xpath = context.common.find_element_by_xpath(DataMapper.gender)
    race_xpath = context.common.find_element_by_xpath(DataMapper.race)
    rob_xpath = context.common.find_element_by_xpath(DataMapper.rob)
    citizen_xpath = context.common.find_element_by_xpath(DataMapper.citizen)
    language_xpath = context.common.find_element_by_xpath(DataMapper.language)
    assert age_xpath.is_displayed()==True, 'Age item is not displayed'
    assert gender_xpath.is_displayed()==True, 'Age item is not displayed'
    assert race_xpath.is_displayed()==True, 'Age item is not displayed'
    assert rob_xpath.is_displayed()==True, 'Age item is not displayed'
    assert citizen_xpath.is_displayed()==True, 'Age item is not displayed'
    assert language_xpath.is_displayed()==True, 'Age item is not displayed'


@step("I click on Age sub-item")
def step_impl(context):
    context.common.click_element_via_javascript_executor(DataMapper.age)


@then("User must see the Youth population under the Age item")
def step_impl(context):
    time.sleep(8)
    youth_population_xpath = context.common.find_element_by_xpath(DataMapper.youth_population)
    assert youth_population_xpath.is_displayed()==True, 'Youth Population is not displayed'


@step("I click on Youth Population")
def step_impl(context):
    context.common.click_element_via_javascript_executor(DataMapper.youth_population)


@then("User must see the Youths and Non Youths")
def step_impl(context):
    time.sleep(8)
    youth_population_youths_xpath = context.common.find_element_by_xpath(DataMapper.youths)
    youth_population_non_youths_xpath = context.common.find_element_by_xpath(DataMapper.non_youths)
    assert youth_population_youths_xpath.is_displayed()==True, 'Youths are not displayed'
    assert youth_population_non_youths_xpath.is_displayed()==True, 'Non Youths are not displayed'


@then("User must see Age Group and Population")
def step_impl(context):
    age_group_xpath = context.common.find_element_by_xpath(DataMapper.age_group)
    youth_population_xpath = context.common.find_element_by_xpath(DataMapper.youth_population)
    assert True==age_group_xpath.is_displayed(), "Age Group under Age item is not displayed"
    assert True==youth_population_xpath.is_displayed(), "Youth Population under Age item is not displayed"


@step("I click on Gender sub-item")
def step_impl(context):
    gender_xpath = context.common.find_element_by_xpath(DataMapper.gender)
    context.common.click_item(gender_xpath)


@then("User must see Gender under Gender sub-item")
def step_impl(context):
    gender_subitem_xpath = context.common.find_element_by_xpath(DataMapper.gender_subitem)
    assert True==gender_subitem_xpath.is_displayed(), "Gender sub-item under Gender is not displayed"


@step("I click on Race sub-item")
def step_impl(context):
    race_xpath = context.common.find_element_by_xpath(DataMapper.race)
    context.common.click_item(race_xpath)


@then("User must see Race under Race sub-item")
def step_impl(context):
    race_subitem_xpath = context.common.find_element_by_xpath(DataMapper.race_subitem)
    assert True==race_subitem_xpath.is_displayed(), "Race under Race is not displayed"


@step("I click on Region of Birth sub-item")
def step_impl(context):
    region_birth_xpath = context.common.find_element_by_xpath(DataMapper.region_birth)
    context.common.click_item(region_birth_xpath)


@then("User must see Region of Birth under Region of Birth sub-item")
def step_impl(context):
    region_birth_subitem_xpath = context.common.find_element_by_xpath(DataMapper.region_birth_subitem)
    assert True==region_birth_subitem_xpath.is_displayed(), "Region of Birth under Region of Birth is not displayed"


@step("I click on Citizenship sub-item")
def step_impl(context):
    citizen_xpath = context.common.find_element_by_xpath(DataMapper.citizen)
    context.common.click_item(citizen_xpath)


@then("User must see Citizenship under Citizenship sub-item")
def step_impl(context):
    citizen_subitem_xpath = context.common.find_element_by_xpath(DataMapper.citizen_subitem)
    assert True==citizen_subitem_xpath.is_displayed(), "Citizenship Under Citizenship is not displayed"


@step("I click on Language sub-item")
def step_impl(context):
    language_xpath = context.common.find_element_by_xpath(DataMapper.language)
    context.common.click_item(language_xpath)


@then("User must see Language test under Language sub-item")
def step_impl(context):
    language_test_subitem_xpath = context.common.find_element_by_xpath(DataMapper.language_test_subitem)
    assert True==language_test_subitem_xpath.is_displayed(), "Language Test under Language is not displayed"


@step("Click on Population category")
def step_impl(context):
    population_xpath = context.common.find_element_by_xpath(DataMapper.population)
    context.common.click_item(population_xpath)


@then("User must see the data mapper contents")
def step_impl(context):
    demographic_menu_xpath = context.common.find_element_by_xpath(DataMapper.demographic_menu)
    population_xpath = context.common.find_element_by_xpath(DataMapper.population)
    education_xpath = context.common.find_element_by_xpath(DataMapper.education)
    family_living_env_xpath = context.common.find_element_by_xpath(DataMapper.family_living_env)
    poverty_xpath = context.common.find_element_by_xpath(DataMapper.poverty)
    assert True==demographic_menu_xpath.is_displayed(), "Demographics item is not displayed"
    assert True==population_xpath.is_displayed(), "Population item is not displayed"
    assert True==education_xpath.is_displayed(), "Education item is not displayed"
    assert True==family_living_env_xpath.is_displayed(), "Family and Living Enviornment is not displayed"
    assert True==poverty_xpath.is_displayed(), "Poverty item is not displayed"


@then("Households sub category should be displayed")
def step_impl(context):
    households_xpath = context.common.find_element_by_xpath(DataMapper.households)
    assert True==households_xpath.is_displayed(), "Households item is not displayed"


@step("Click on Households sub category")
def step_impl(context):
    households_xpath = context.common.find_element_by_xpath(DataMapper.households)
    context.common.click_item(households_xpath)


@then("Water services sub-category should be displayed")
def step_impl(context):
    water_services_xpath = context.common.find_element_by_xpath(DataMapper.water_services)
    assert True==water_services_xpath.is_displayed(), "Water Services is not displayed"


@step("Click on Water services sub-category")
def step_impl(context):
    water_services_xpath = context.common.find_element_by_xpath(DataMapper.water_services)
    context.common.click_item(water_services_xpath)


@then("Water services sub-categories should be displayed")
def step_impl(context):
    water_services_unspecified_xpath = context.common.find_element_by_xpath(DataMapper.water_services_unspecified)
    water_services_poor_xpath = context.common.find_element_by_xpath(DataMapper.water_services_poor)
    water_services_not_use_xpath = context.common.find_element_by_xpath(DataMapper.water_services_not_use)
    water_services_no_access_xpath = context.common.find_element_by_xpath(DataMapper.water_services_no_access)
    water_services_good_xpath = context.common.find_element_by_xpath(DataMapper.water_services_good)
    water_services_average_xpath = context.common.find_element_by_xpath(DataMapper.water_services_average)
    assert True==water_services_average_xpath.is_displayed(), 'Water Type - Average is not displayed'
    assert True==water_services_unspecified_xpath.is_displayed(), 'Water Type - unspecified is not displayed'
    assert True==water_services_poor_xpath.is_displayed(), 'Water Type - poor is not displayed'
    assert True==water_services_not_use_xpath.is_displayed(), 'Water Type - not use is not displayed'
    assert True==water_services_no_access_xpath.is_displayed(), 'Water Type - no access is not displayed'
    assert True==water_services_good_xpath.is_displayed(), 'Water Type - good is not displayed'


@step("I click on Race under Race sub-item")
def step_impl(context):
    race_subitem_xpath = context.common.find_element_by_xpath(DataMapper.race_subitem)
    context.common.click_item(race_subitem_xpath)


@then("User must see various races")
def step_impl(context):
    race_other_xpath = context.common.find_element_by_xpath(DataMapper.race_other)
    race_white_xpath = context.common.find_element_by_xpath(DataMapper.race_white)
    race_coloured_xpath = context.common.find_element_by_xpath(DataMapper.race_coloured)
    race_black_african_xpath = context.common.find_element_by_xpath(DataMapper.race_black_african)
    race_indian_asian_xpath = context.common.find_element_by_xpath(DataMapper.race_indian_asian)
    assert True==race_other_xpath.is_displayed(), "Race- Other is not displayed"
    assert True==race_white_xpath.is_displayed(), "Race- White is not displayed"
    assert True==race_coloured_xpath.is_displayed(), "Race- Coloured is not displayed"
    assert True==race_black_african_xpath.is_displayed(), "Race- Black African is not displayed"
    assert True==race_indian_asian_xpath.is_displayed(), "Race- Indian or asian is not displayed"


@step("I click on Black african")
def step_impl(context):
    race_black_african_xpath = context.common.find_element_by_xpath(DataMapper.race_black_african)
    context.common.click_item(race_black_african_xpath)


@step("I click on Data Mapper icon")
def step_impl(context):
    temp = "//div[@class='panel-toggle data-mapper-panel__close cc-active']//div[@class='svg-icon w-embed']"
    data_mapper_svg_icon_xpath = context.common.find_element_by_xpath(temp)
    context.common.click_item(data_mapper_svg_icon_xpath)


@then("User must see Black African data should be displayed in map option")
def step_impl(context):
    race_black_african_header_xpath = context.common.find_element_by_xpath(DataMapper.race_black_african_header)
    assert True==race_black_african_header_xpath.is_displayed(), 'Race Option is not displayed'


@step("I select gender from a drop down of Select a Value")
def step_impl(context):
    select_all_value = "//div[@class='dropdown-menu__trigger narrow']//div[@class='truncate'][contains(text(),'All values')]"
    select_all_value_xpath = context.common.find_element_by_xpath(select_all_value)
    context.common.click_item(select_all_value_xpath)
    select_gender = "//div[@class='dropdown-menu__content position-top scroll-element']" \
             "//div[@class='truncate'][contains(text(),'gender')]"
    context.driver.execute_script(select_gender)


race_close_button_xpath = None


@step("I close the dialog box")
def step_impl(context):
    global race_close_button_xpath
    race_close_button = "//div[@class='filters__header_close']//div[@class='svg-icon w-embed']//*[local-name()='svg']"
    race_close_button_xpath = context.common.find_element_by_xpath(race_close_button)
    context.common.click_item(race_close_button_xpath)


@then("User must not see the dialog box")
def step_impl(context):
    assert False==race_close_button_xpath.is_displayed(), 'Race- Black African dialog box is still open'

from behave import *
from pages.locators import RichData


@step("I click on Rich data item")
def step_impl(context):
    rich_data_icon_xpath = context.common.find_element_by_xpath(RichData.rich_data_icon)
    context.common.click_item(rich_data_icon_xpath)


@then("User must see summary")
def step_impl(context):
    rich_data_navigation_summary_xpath = context.common.find_element_by_xpath(RichData.rich_data_navigation_summary)
    assert True == rich_data_navigation_summary_xpath.is_displayed(), "Summary is not displayed"


@step("I click on Demographic item on navigation list")
def step_impl(context):
    context.common.click_element_via_javascript_executor(RichData.rich_data_navigation_demographic)


@then("User must see Demographics details")
def step_impl(context):
    rich_data_demographics_header_xpath = context.common.find_element_by_xpath(RichData.rich_data_demographics_header)
    rich_data_age_header_xpath = context.common.find_element_by_xpath(RichData.rich_data_age_header)
    rich_data_gender_header_xpath = context.common.find_element_by_xpath(RichData.rich_data_gender_header)
    rich_data_header_xpath = context.common.find_element_by_xpath(RichData.rich_data_race_header)
    rich_data_rob_header_xpath = context.common.find_element_by_xpath(RichData.rich_data_rob_header)
    rich_data_citizenship_header_xpath = context.common.find_element_by_xpath(RichData.rich_data_citizenship_header)
    rich_data_language_header_xpath = context.common.find_element_by_xpath(RichData.rich_data_language_header)
    assert True == rich_data_demographics_header_xpath.is_displayed(),"Demographics is not displayed"
    assert True==rich_data_age_header_xpath.is_displayed(), "age is not displayed"
    assert True==rich_data_gender_header_xpath.is_displayed(), "gender is not displayed"
    assert True==rich_data_header_xpath.is_displayed(), "race is not displayed"
    assert True==rich_data_rob_header_xpath.is_displayed(), "region of birth is not displayed"
    assert True==rich_data_citizenship_header_xpath.is_displayed(), "citizenship is not displayed"
    assert True==rich_data_language_header_xpath.is_displayed(), "language is not displayed"


@step("I click on Population item on navigation list")
def step_impl(context):
    context.common.click_element_via_javascript_executor(RichData.rich_data_navigation_population)


@then("User must see the Population details")
def step_impl(context):
    rich_data_population_xpath = context.common.find_element_by_xpath(RichData.rich_data_population)
    rich_data_household_xpath = context.common.find_element_by_xpath(RichData.rich_data_household)
    assert True == rich_data_population_xpath.is_displayed(),"Population is not displayed"
    assert True == rich_data_household_xpath.is_displayed(), "Households is not displayed"


@step("I click on Education item on navigation list")
def step_impl(context):
    context.common.click_element_via_javascript_executor(RichData.rich_data_education)


@then("User must see the Education details")
def step_impl(context):
    rich_data_education_xpath = context.common.find_element_by_xpath(RichData.rich_data_education)
    rich_data_attendance_xpath = context.common.find_element_by_xpath(RichData.rich_data_attendance)
    assert True == rich_data_education_xpath.is_displayed(),"Education is not displayed"
    assert True==rich_data_attendance_xpath.is_displayed(), "Attendance is not displayed"


@step("I click on Family & Living Environment item on navigation list")
def step_impl(context):
    context.common.click_element_via_javascript_executor(RichData.rich_data_navigation_family)


@then("User must see Family & Living Environment")
def step_impl(context):
    rich_data_family_xpath = context.common.find_element_by_xpath(RichData.rich_data_family)
    rich_data_housing_xpath = context.common.find_element_by_xpath(RichData.rich_data_housing)
    rich_data_health_xpath = context.common.find_element_by_xpath(RichData.rich_data_health)
    assert True == rich_data_family_xpath.is_displayed(), "Family and Environment are displayed"
    assert True == rich_data_health_xpath.is_displayed(), "Health detail is displayed"
    assert True == rich_data_housing_xpath.is_displayed(),'Housing detail is displayed'


@step("I click on Poverty on navigation list")
def step_impl(context):
    context.common.click_element_via_javascript_executor(RichData.rich_data_navigation_poverty)


@then("User must see Poverty details")
def step_impl(context):
    rich_data_poverty_header_xpath = context.common.find_element_by_xpath(RichData.rich_data_poverty_header)
    rich_data_mpi_header_xpath = context.common.find_element_by_xpath(RichData.rich_data_mpi_header)
    assert True == rich_data_mpi_header_xpath.is_displayed(),"MPI header is not displayed"
    assert True == rich_data_poverty_header_xpath.is_displayed(),"Poverty Header is not displayed"

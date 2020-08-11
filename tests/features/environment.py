from behave import fixture
import platform
from selenium import webdriver
import os
from pages.common import Common


# Run Before the Feature testing execution
def before_all(context):
    context.option = webdriver.ChromeOptions()
    context.option.add_argument(" — incognito")
    context.option.add_argument("--headless")
    os_type = platform.system()
    if os_type == 'Darwin':
        context.chrome_dir = '' + os.getcwd() + '/pages/chromedrivermac'
    elif os_type == 'Linux':
        context.chrome_dir = '' + os.getcwd() + '/pages/chromedriverlinux'


# Run before every scenario of the feature
def before_scenario(context, scenario):
    context.driver = webdriver.Chrome(executable_path = context.chrome_dir, options = context.option)
    context.common = Common(context.driver)


# Run after each scenarios are tested
def after_scenario(context, scenario):
    # close browsers
    context.common = Common(context.driver)
    context.common.browser_close()






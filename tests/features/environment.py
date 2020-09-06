import platform
from selenium import webdriver
import os
from pages.pages import Common


# Run Before the Feature testing execution
def before_all(context):
    context.path = os.getcwd()
    context.option = webdriver.ChromeOptions()
    context.option.add_argument(" — incognito")
    context.option.add_argument("--headless")
    os_type = platform.system()
    if os_type == 'Darwin':
        context.chrome_dir = '' + context.path + '/webdriver/chromedriver'
    elif os_type == 'Linux':
        context.chrome_dir = '' + context.path + '/webdriver/chromedriverlinux'


# Run before every scenario of the feature
def before_scenario(context, scenario):
    context.driver = webdriver.Chrome(executable_path = context.chrome_dir, options = context.option)
    context.driver.maximize_window()


# Run after each scenarios are tested
def after_scenario(context, scenario):
    # close browsers
    Common(context.driver).browser_close()






from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions
import sys

# Class for Wazimap with Common Framework
class Common:
    # Constructor for the homepage
    def __init__(self, driver):
        self.driver = driver

    # Get the web address
    def get_url(self, url):
        self.driver.get(url)

    # Click the web element
    def click_item(self, element):
        ActionChains(self.driver).move_to_element(element).click(element).perform()

    # Find the web element using xpath
    def find_element_by_xpath(self, xpath):
        try:
            return WebDriverWait(self.driver, 15).until(expected_conditions.visibility_of_element_located((By.XPATH, xpath)))
        except NoSuchElementException:
            sys.exit()

    # Close the web driver
    def browser_close(self):
        self.driver.close()
        self.driver.quit()

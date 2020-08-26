from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions
import sys
import time

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

    # Enter the text in the input field
    def write_text(self, text):
        ActionChains(self.driver).send_keys(text).perform()

    # Find the web element using xpath
    def find_element_by_xpath(self, xpath):
        try:
            return WebDriverWait(self.driver, 15).until(expected_conditions.visibility_of_element_located((By.XPATH, xpath)))
        except NoSuchElementException:
            sys.exit()

    # Click web element through javascript executer
    def click_element_via_javascript_executor(self, xpath):
        script = "document.evaluate(\"{}\",document,null,"\
                 "XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue.click()".format(xpath)
        time.sleep(3)
        self.driver.execute_script(script)



    # Close the web driver
    def browser_close(self):
        self.driver.close()
        self.driver.quit()

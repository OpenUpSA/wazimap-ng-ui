from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions
import sys
import time
import base64

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
            return WebDriverWait(self.driver, 30).until(
                expected_conditions.visibility_of_element_located((By.XPATH, xpath)))
        except NoSuchElementException:
            sys.exit()

    # Click web element through javascript executer
    def click_element_via_javascript_executor(self, xpath):
        script = "document.evaluate(\"{}\",document,null,"\
                 "XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue.click()".format(xpath)
        time.sleep(5)
        self.driver.execute_script(script)

    def get_screenshot_base_64(self):
        return self.driver.get_screenshot_as_png()

    @staticmethod
    def decode_base_64_png(encoded_img):
        return base64.b64decode(encoded_img)

    # Close the web driver
    def browser_close(self):
        self.driver.close()
        self.driver.quit()


class Province(Common):
    def __init__(self, driver):
        super().__init__(driver)
        self.driver.get(driver.current_url)

    def encode_base_64(self,img):
        return base64.b64encode(img)

    def get_string_from_image(self,path):
        with open(path, "rb") as img_file:
            img_string = self.decode_base_64_png(self.encode_base_64(img_file.read()))
        img_file.close()
        return img_string

    def get_image_from_canvas_execute_script(self, canvas):
        # get the canvas as a PNG base64 string
        script = "return arguments[0].toDataURL('image/png').substring(21);"
        return self.driver.execute_script(script, canvas)


class District(Province):
    def __init__(self, driver):
        super().__init__(driver)
        self.driver.get(driver.current_url)


class Municipality(District):
    def __init__(self, driver):
        super().__init__(driver)
        self.driver.get(driver.current_url)


class Mainplace(Municipality):
    def __init__(self, driver):
        super().__init__(driver)
        self.driver.get(driver.current_url)


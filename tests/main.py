from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import Select
import unittest
import time

url = "https://wazimap-ng.africa/"
with open("config.txt", "r") as file:
    text = file.read().split("\n")
    elements, visible = text[0].split(",") , text[1].split(",")
print()
print("Start Test")
print("----------------------------------------------------------------------")
print()
print("Elements To Click\t" + str(elements))
print("Elements To Check Visibility\t" + str(visible))
print("----------------------------------------------------------------------")
print()

class Test(unittest.TestCase):
    def setUp(self):
        userAgent = "adsbot-google"
        options = Options()
        options.add_argument("--no-sandbox")
        options.add_argument('log-level=3')
        options.add_argument('--disable-dev-shm-usage')
        options.add_argument('--headless')
        options.add_argument("--user-agent=" + userAgent)
        options.add_experimental_option("excludeSwitches", ["enable-logging"])
        driver = webdriver.Chrome(ChromeDriverManager().install())
        #driver = webdriver.Chrome('chromedriver', options=options)
        #    driver = webdriver.Chrome(options=options,service_log_path='NUL')
        #    driver = webdriver.Chrome(options=options,service_log_path='/dev/null')
        self.driver = driver
        self.driver.get(url)

    def tearDown(self):
        self.driver.close()
        self.driver.quit()

    def test_elements(self):
        WebDriverWait(self.driver, 20).until(
            EC.element_to_be_clickable((By.XPATH, "/html/body/div[3]/div[4]/div[2]/div[3]"))).click()
        time.sleep(3)
        for i in elements:
            try:
                WebDriverWait(self.driver, 5).until(
                    EC.element_to_be_clickable((By.XPATH, "(//div[text()='" + i + "'])[last()]"))).click()
            except:
                print("ERROR Cound not locate click element \t'" + i + "'")
        print()
        print("----------------------------------------------------------------------")
        print()

        for i in visible:
            try:
                elem = self.driver.find_element_by_xpath("//div[text()='" + i + "']").is_displayed()
                if elem:
                    print("Element\t-\t'" + i + "'\t-\tIs Visible")
                else:
                    print("Element\t-\t'" + i + "'\t-\tIs Not Visible")
            except:
                print("ERROR Cound not locate Visibility element \t'" + i + "'")

if __name__ == '__main__':
    unittest.main()
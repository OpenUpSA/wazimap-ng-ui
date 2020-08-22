# Data Mapper Web Elements
profile_logo = "//img[@class='profile-logo']"
data_mapper_svg_icon = "//div[@class='panel-toggles']//div[@class='panel-toggle data-mapper-panel__open']//div[@class='svg-icon w-embed']//*[local-name()='svg']//*[name()='path' and contains(@fill,'currentCol')]"
data_mapper_header = "//div[@class='point-data__header_title']//div[contains(text(),'Data Mapper')]"
demographic_menu = "//div[@class='data-category__h1_title']//div[@class='truncate'][contains(text(),'Demographics')]"
age = "//div[@class='data-category__h2_trigger']//div[@class='truncate'][contains(text(),'Age')]"
gender = "//div[@class='data-category__h2_trigger']//div[@class='truncate'][contains(text(),'Gender')]"
race = "//div[@class='data-category__h2_trigger']//div[@class='truncate'][contains(text(),'Race')]"
rob = "//div[@class='data-category__h2_trigger']//div[@class='truncate'][contains(text(),'Region of Birth')]"
citizen = "//div[@class='data-category__h2_trigger']//div[@class='truncate'][contains(text(),'Citizenship')]"
language = "//div[@class='data-category__h2_trigger']//div[@class='truncate'][contains(text(),'Language')]"
youth_population = "//div[@class='truncate'][contains(text(),'Youth population')]"
youths = "//div[contains(text(),'Youths')]"
non_youths = "//div[contains(text(),'Non youth')]"
# Tutorial Web Elements
tutorial = "//div[contains(text(),'Tutorial')]"
tutorial_header = "//span[@class='profile-name']"
tutorial_list = ["//span[contains(text(),'Introduction:')]",
                 "//span[contains(text(),'Location Search:')]",
                 "//span[contains(text(),'Location Panel:')]",
                 "//span[contains(text(),'Rich Data:')]",
                 "//span[contains(text(),'Point Mapper:')]",
                 "//span[contains(text(),'Data Mapper:')]",
                 "//span[contains(text(),'Data Filtering:')]",
                 "//span[contains(text(),'Learn more:')]"]

tutorial_next_button = "//div[@class='text-block']"
tutorial_back_button = "//div[@class='tutorial__slide_button previous']//div[@class='svg-icon w-embed']"
tutorial_data_filtering = "//span[contains(text(),'Data Filtering:')]"
tutorial_close_button = "//div[@class='tutorial__close']//div[@class='svg-icon w-embed']"

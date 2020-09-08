### Website Under Test is [Wazimap](https://wazimap-ng.africa/)
> Implemented BDD framework.<br>
> Implemented POM pattern.<br>
> Implemented test hooks. <br>
#### Below Features that are tested:

>1. Map
>2. Rich Data
>3. Data Mapper
>4. Point Mapper
>5. Tutorial

#### Requirement
>1. Python
>2. Behave
>3. Google Chrome

#### How to run
>1. Open terminal / command line
>2. Go to the directory : .../wazimap-ng-ui
>3. Type "Yarn start" on terminal
>4. After step 3 is successful, Open another terminal
>5. Type "./run_test.sh" on terminal
#### In case of Web Hook Error or compatability error with chrome driver
>1. Download Correct version of [chromedriver](https://chromedriver.chromium.org/downloads)
>2. copy and replace it in the path /wazimap-ng-ui/webdriver/

#### How to generate Allure reports
> Type in the command: <br>
> behave -f allure_behave.formatter:AllureFormatter -o reports/ features
> After successful run, type:
> allure serve reports/

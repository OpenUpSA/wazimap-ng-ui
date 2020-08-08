### Website Under Test is [Wazimap](https://wazimap-ng.africa/)
> Implemented BDD framework.<br>
> Implemented POM patter.<br>
> Implemented test hooks. <br>
#### Below test steps have followed:

>1. When the page loads, the data mapper panel should be opened by clicking on the bottom tab 
on the left side of the screen
>2. It should make sure that the Demographics menu item is there
>3. It should then click on the Demographics menu item and check if the Age item is there
>4. It should click on Age and check that Youth population is displayed
>5. Finally, it should click on Youth population and check that both Youths and Non youth are visible.

#### How to run
>1. Open terminal / command line
>2. Go to the directory : .../project-qa-wazimap-bdd/tests
>3. type behave

#### Requirement
>1. Python
>2. Behave

#### How to generate Allure reports
> Type in the command: <br>
> behave -f allure_behave.formatter:AllureFormatter -o reports/ features
> After successful run, type:
> allure serve reports/

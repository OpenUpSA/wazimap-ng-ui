import 'regenerator-runtime/runtime';
import 'expect-puppeteer';
import allDetails from "./tutorial.all_details.json";
import profile from "./tutorial.profile.json";

test('Customised tutorial', async () => {



  await page.setRequestInterception(true);


  page.on('request', interceptedRequest => {

    const endpoint = interceptedRequest.url();
    const method = interceptedRequest.method();
    if (method === "GET" && endpoint.startsWith("https://staging.wazimap-ng.openup.org.za")) {
      if (endpoint.endsWith("/api/v1/profile_by_url?format=json")) {
        console.log(JSON.stringify(profile));
        interceptedRequest.respond(JSON.stringify(profile));
      } else if (endpoint.endsWith("/api/v1/all_details/profile/8/geography/ZA/?format=json")) {
        console.log(JSON.stringify(allDetails));
        interceptedRequest.respond(JSON.stringify(allDetails));
      } else {
        console.info(`#####      #####     ##### ${method} ${endpoint}`);
        interceptedRequest.continue();
      }
    } else {

      //console.info(`@@@@@     @@@@@     @@@@@ ${endpoint}`);

      //console.info(`#####      #####     ##### ${err}`);

      interceptedRequest.continue();
    }
  });
  try {
    //await page.setDefaultTimeout(30000);
    await page.goto('http://localhost:1234');

    await page.waitForFunction(
      () => document.querySelector(".location-tag__name div").textContent == "South Africa",
      {},
    );

    //await jestPuppeteer.debug();
    await expect(page).toMatchElement(".location-tag__name div", {text: "South Africa"});

    //await expect(page).toMatchElement(".tutorial__title h1", {text: 'How to use', visible: false});
    await expect(page).toClick('div', { text: 'Tutorial', visible});
    await expect(page).toMatchElement(".tutorial__title h1", {text: 'How to use', visible: true});
  } catch (err) {
    console.error(err);
  }
});

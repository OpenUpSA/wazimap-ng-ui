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
                interceptedRequest.respond({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify(profile),
                });
                //interceptedRequest.continue();
            } else {
                interceptedRequest.continue();
            }
        } else {
            interceptedRequest.continue();
        }
    });

    page.on('response', response => {
        const endpoint = response.url();
        const method = response.request().method();
        if (method === "GET" && endpoint.startsWith("https://staging.wazimap-ng.openup.org.za")) {
            if (endpoint.endsWith("/api/v1/profile_by_url?format=json")) {
                console.log({response})
            }
        }
    });

    await page.goto('http://localhost:1234');

    await page.waitForFunction(
        () => document.querySelector(".location-tag__name div").textContent == "South Africa",
        {},
    );
    await expect(page).toMatchElement(".location-tag__name div", {text: "South Africa"});

    //await expect(page).toMatchElement(".tutorial__title h1", {text: 'How to use', visible: false});
    await expect(page).toClick('.tutorial__open');
    await expect(page).toMatchElement(".tutorial__title h1", {text: 'How to use', visible: true});


    let SLIDE_COUNT = 8;
    for (let i = 0; i < SLIDE_COUNT; i++) {
        await expect(page).toMatchElement('.tutorial__slide-content', {visible: true});
        await expect(page).toMatchElement('.tutorial__slide-content .tutorial__slide-info', {visible: true});
        await expect(page).toMatchElement('.tutorial__slide-content .tutorial__slide-info .slide-info__title', {visible: true});
        await expect(page).toMatchElement('.tutorial__slide-content .tutorial__slide-info .slide-info__introduction', {visible: true});
        await expect(page).toMatchElement('.tutorial__slide-content .tutorial__slide-image', {visible: true});

        if (i !== SLIDE_COUNT - 1) {
            await expect(page).toClick('.tutorial__slide_button.next');
        }
    }
});

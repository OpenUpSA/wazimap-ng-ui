import configureApplication from "./load";

let profileId = 1;
let baseUrl;

if (window.location.href.search("wazi.webflow.io") >= 0)
    baseUrl = "https://wazimap-ng.openup.org.za";
else if (window.location.href.search("openup.org.za/wazimap-ng-ui") >= 0)
    baseUrl = "https://wazimap-ng.openup.org.za";
else if (window.location.href.search("localhost") >= 0)
    baseUrl = "https://api.gcro.openup.org.za"
//baseUrl = "https://staging.wazimap-ng.openup.org.za"
else
    baseUrl = "https://staging.wazimap-ng.openup.org.za"

configureApplication(baseUrl, profileId);

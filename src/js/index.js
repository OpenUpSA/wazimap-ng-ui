import configureApplication from "./load";

let profileId = 1;
let baseUrl;

if (window.location.href.search("staging") >= 0)
    baseUrl = "https://staging.wazimap-ng.openup.org.za"
else if (window.location.href.search("localhost") >= 0)
    baseUrl = "https://staging.wazimap-ng.openup.org.za"
else
    baseUrl = "https://wazimap-ng.openup.org.za";

configureApplication(baseUrl, profileId);

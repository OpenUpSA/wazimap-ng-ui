import configureApplication from "./load";

var profileId = 1;
var baseUrl = "https://wazimap-ng.openup.org.za";
if (window.location.href.search("localhost") >= 0)
    baseUrl = "http://localhost:8000";
else if (window.location.href.search("staging") >= 0)
    baseUrl = "https://staging.wazimap-ng.openup.org.za"

configureApplication(baseUrl, profileId);

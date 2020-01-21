import load from "./load";

var profileId = 1;
var baseUrl = "https://wazimap-ng.openup.org.za";
// if (window.location.href.search("localhost") > 0)
    // baseUrl = "http://localhost:8001";

load(baseUrl, profileId);

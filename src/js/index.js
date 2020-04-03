import configureApplication from './load';
import {geography_config} from './configurations/geography_sa';
import {geography_config as gcro_config} from './configurations/geography_gcro';

const mainUrl = 'https://staging.wazimap-ng.openup.org.za';
const productionUrl = 'https://production.wazimap-ng.openup.org.za';

const hostname = window.location.hostname;
const profiles = {
    'wazi.webflow.io': {
        profile: 1,
        baseUrl: mainUrl,
        config: geography_config
    },
    'localhost': {
        profile: 2,
        baseUrl: mainUrl,
        config: geography_config
    },
    'localhost-dev': {
        profile: 1,
        baseUrl: 'http://localhost:8000',
        config: geography_config
    },
    'geo.vulekamali.gov.za': {
        profile: 2,
        baseUrl: productionUrl,
        config: geography_config
    },
    'gcro.openup.org.za': {
        profile: 1,
        baseUrl: 'https://api.gcro.openup.org.za',
        config: gcro_config
    },
    'beta.youthexplorer.org.za': {
        profile: 1,
        baseUrl: productionUrl,
        config: geography_config
    },
    'capetownagainstcovid19.openup.org.za': {
        profile: 3,
        baseUrl: mainUrl,
        config: geography_config
    },
    'covid-wazi.openup.org.za': {
        profile: 4,
        baseUrl: mainUrl,
        config: geography_config
    },
    'covid-ibp.openup.org.za': {
        profile: 5,
        baseUrl: mainUrl,
        config: geography_config
    },
}

const pc = profiles[hostname]
if (pc != undefined) {
    configureApplication(pc.baseUrl, pc.profile, pc.config);
} else if (window.location.href.search('openup.org.za/wazimap-ng-ui') >= 0) {
    configureApplication('https://wazimap-ng.openup.org.za', 1, geography_config);
} else {
    configureApplication(mainUrl, 1, geography_config);
}

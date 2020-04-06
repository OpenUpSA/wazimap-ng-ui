import configureApplication from './load';
import {Config as SAConfig} from './configurations/geography_sa';
import {Config as GCROConfig} from './configurations/geography_gcro';
import {Config as WorldConfig} from './configurations/geography_world';

const mainUrl = 'https://staging.wazimap-ng.openup.org.za';
const productionUrl = 'https://production.wazimap-ng.openup.org.za';
const config = new SAConfig();

const hostname = window.location.hostname;
const profiles = {
    'wazi.webflow.io': {
        profile: 1,
        baseUrl: mainUrl,
        config: config
    },
    'localhost': {
        profile: 2,
        baseUrl: mainUrl,
        config: config
    },
    'localhost-dev': {
        profile: 1,
        baseUrl: 'http://localhost:8000',
        config: config
    },
    'geo.vulekamali.gov.za': {
        profile: 2,
        baseUrl: productionUrl,
        config: config
    },
    'gcro.openup.org.za': {
        profile: 1,
        baseUrl: 'https://api.gcro.openup.org.za',
        config: new GCROConfig()
    },
    'beta.youthexplorer.org.za': {
        profile: 1,
        baseUrl: productionUrl,
        config: config
    },
    'capetownagainstcovid19.openup.org.za': {
        profile: 3,
        baseUrl: mainUrl,
        config: config
    },
    'covid-wazi.openup.org.za': {
        profile: 4,
        baseUrl: mainUrl,
        config: config
    },
    'wazimap-ng.africa': {
        profile: 1,
        baseUrl: mainUrl,
        config: config
    },
    'covid-ibp.openup.org.za': {
        profile: 5,
        baseUrl: productionUrl,
        config: config
    },
    'covid-ccij.openup.org.za': {
        profile: 5,
        baseUrl: mainUrl,
        config: new WorldConfig()
    },
}

const pc = profiles[hostname]
if (pc != undefined) {
    configureApplication(pc.baseUrl, pc.profile, pc.config);
} else if (window.location.href.search('openup.org.za/wazimap-ng-ui') >= 0) {
    configureApplication('https://wazimap-ng.openup.org.za', 1, config);
} else {
    configureApplication(mainUrl, 1, config);
}

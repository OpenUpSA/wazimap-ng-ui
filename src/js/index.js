import 'babel-polyfill';
import configureApplication from './load';
import {Config as SAConfig} from './configurations/geography_sa';
import {Config as GCROConfig} from './configurations/geography_gcro';
import {Config as WorldConfig} from './configurations/geography_world';

const mainUrl = 'https://staging.wazimap-ng.openup.org.za';
const productionUrl = 'https://production.wazimap-ng.openup.org.za';
const config = new SAConfig();

const hostname = window.location.hostname;
const defaultProfile = 1;
const defaultUrl = productionUrl;
const defaultConfig = new SAConfig();

const profiles = {
    'wazi.webflow.io': {
        profile: 1,
        baseUrl: mainUrl,
        config: config
    },
    'localhost': {
        profile: 8,
        //baseUrl: mainUrl,
        baseUrl: productionUrl,
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
        profile: 8,
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
    'mapyourcity.org.za': {
        profile: 7,
        baseUrl: productionUrl,
        config: config
    },
    'covid-ccij.openup.org.za': {
        profile: 5,
        baseUrl: mainUrl,
        config: new WorldConfig()
    },
    'cfafrica.openup.org.za': {
        profile: 6,
        baseUrl: mainUrl,
        config: config
    },
}

const pc = profiles[hostname]
if (pc != undefined) {
    configureApplication(pc.baseUrl, pc.profile, pc.config);
} else {
    configureApplication(defaultUrl, defaultProfile, defaultConfig);
}

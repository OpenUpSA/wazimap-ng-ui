import 'babel-polyfill';

import configureApplication from './load';
import {Config as SAConfig} from './configurations/geography_sa';
import {Config as GCROConfig} from './configurations/geography_gcro';
import {Config as WorldConfig} from './configurations/geography_world';
import Analytics from './analytics';
import {API} from './api';
import * as Sentry from '@sentry/browser';


const mainUrl = 'https://staging.wazimap-ng.openup.org.za';
const productionUrl = 'https://production.wazimap-ng.openup.org.za';
const config = new SAConfig();

// const hostname = window.location.hostname;
const hostname = "beta.youthexplorer.org.za"
const defaultProfile = 8;
const defaultUrl = productionUrl;
const defaultConfig = new SAConfig();

const isLocalhost = (hostname.indexOf("localhost") >= 0)
if (!isLocalhost)
    Sentry.init({ dsn: 'https://aae3ed779891437d984db424db5c9dd0@o242378.ingest.sentry.io/5257787' });

const profiles = {
    'wazi.webflow.io': {
        baseUrl: mainUrl,
        config: config
    },
    'localhost': {
        baseUrl: mainUrl,
        //baseUrl: productionUrl,
        config: config
    },
    'localhost-dev': {
        baseUrl: 'http://localhost:8000',
        config: config
    },
    'geo.vulekamali.gov.za': {
        baseUrl: productionUrl,
        config: config
    },
    'gcro.openup.org.za': {
        baseUrl: 'https://api.gcro.openup.org.za',
        config: new GCROConfig()
    },
    'beta.youthexplorer.org.za': {
        baseUrl: productionUrl,
        config: config
    },
    'capetownagainstcovid19.openup.org.za': {
        baseUrl: mainUrl,
        config: config
    },
    'covid-wazi.openup.org.za': {
        baseUrl: productionUrl,
        config: config
    },
    'wazimap-ng.africa': {
        baseUrl: mainUrl,
        config: config
    },
    'covid-ibp.openup.org.za': {
        baseUrl: productionUrl,
        config: config
    },
    'sifar-wazi.openup.org.za': {
        baseUrl: productionUrl,
        config: config
    },
    'mapyourcity.org.za': {
        baseUrl: productionUrl,
        config: config
    },
    'giz-projects.openup.org.za': {
        baseUrl: productionUrl,
        config: config
    },
    'covid-ccij.openup.org.za': {
        baseUrl: mainUrl,
        config: new WorldConfig()
    },
    'cfafrica.wazimap-ng.africa': {
        baseUrl: 'https://api.cfafrica.wazimap-ng.africa',
        config: config
    },
    'ccij-water.openup.org.za': {
        baseUrl: productionUrl,
        config: new WorldConfig()
    }
}

async function init() {
    let pc = profiles[hostname]
    if (pc == undefined) {
        pc = {
            profile: defaultProfile,
            baseUrl: defaultUrl,
            config: defaultConfig
        }
    }
    const api = new API(pc.baseUrl);
    const data = await api.getProfileConfiguration(hostname);

    pc.config.setConfig(data.configuration || {})
    pc.config.api = api;
    pc.profile = data.id;
    pc.config.baseUrl = pc.baseUrl;
    // TODO add this to config - check the <script> tag in the HTML which hardcodes this value
    pc.config.analytics = new Analytics('UA-93649482-25', pc.profile);
    pc.config.profile = data.id;

    configureApplication(data.id, pc.config);
}

init();



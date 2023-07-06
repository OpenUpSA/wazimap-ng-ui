import 'babel-polyfill';

import configureApplication from './load';
import {Config as SAConfig} from './configurations/geography_sa';
import Analytics from './analytics';
import {API} from './api';
import * as Sentry from '@sentry/browser';
import {getHostname, getAPIUrl, loadDevTools} from './utils';
import {ErrorNotifier} from "./error-notifier";

const mainUrl = getAPIUrl('https://staging.wazimap-ng.openup.org.za');
const productionUrl = getAPIUrl('https://production.wazimap-ng.openup.org.za');
let config = new SAConfig();

let hostname = getHostname();
const defaultProfile = 8;
const defaultUrl = productionUrl;
const defaultConfig = new SAConfig();

const ENVIRONMENT = `${process.env.ENVIRONMENT}`;
const GOOGLE_ANALYTICS_ID = `${process.env.GOOGLE_ANALYTICS_ID}`;
const SENTRY_DSN = `${process.env.SENTRY_DSN}`;

if (SENTRY_DSN !== "undefined" && SENTRY_DSN !== "") {
    Sentry.init({
        dsn: SENTRY_DSN,
        environment: ENVIRONMENT
    });
} else {
    console.warn("Not initialising Sentry because SENTRY_DSN is not set");
}

const profiles = {
    'wazi.webflow.io': {
        baseUrl: mainUrl,
        config: config
    },
    'localhost': {
        baseUrl: mainUrl,
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
        config: config
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
        config: config
    },
    'cfafrica.wazimap-ng.africa': {
        baseUrl: 'https://api.cfafrica.wazimap-ng.africa',
        config: config
    },
    'ccij-water.openup.org.za': {
        baseUrl: productionUrl,
        config: config
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

    const errorNotifier = new ErrorNotifier();
    errorNotifier.registerErrorHandler();

    const api = new API(pc.baseUrl, hostname);
    const data = await api.getProfileConfiguration(hostname);

    pc.config.setConfig(data.configuration || {})
    pc.config.setVersions(data.geography_hierarchy || {})
    pc.config.api = api;
    pc.profile = data.id;
    pc.config.baseUrl = pc.baseUrl;
    if (GOOGLE_ANALYTICS_ID !== "undefined" && GOOGLE_ANALYTICS_ID !== "") {
        pc.config.analytics = initGA(GOOGLE_ANALYTICS_ID, pc.profile);
    } else {
        // dev or staging
        pc.config.analytics = initGA('UA-93649482-33', pc.profile);
    }
    pc.config.profile = data.id;

    configureApplication(data.id, pc.config);
}

function initGA(id, profile) {
    const head = document.getElementsByTagName('head')[0];

    const analyticsScript = document.createElement('script');
    analyticsScript.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    head.appendChild(analyticsScript);

    const configScript = document.createElement('script');
    configScript.text = `
        window.dataLayer = window.dataLayer || [];
        function gtag() {
            dataLayer.push(arguments);
        }
        const analyticsId = '${id}';
        gtag('js', new Date());
        gtag('config', analyticsId, { 'send_page_view': false });
        gtag('config', analyticsId, {
            'custom_map': {'dimension1': 'profile'}
        });
        window.gtag = gtag;
        `;
    head.appendChild(configScript);

    return new Analytics(`${id}`, profile);
}

window.init = init;
loadDevTools(() => {
    const serverEnabled = sessionStorage.getItem("wazi.localServer");
    if (serverEnabled) {
        import('./server').then(server => server.makeServer())
    }
    init();
})

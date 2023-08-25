import React, {useState} from "react";
import {Config as SAConfig} from '../configurations/geography_sa';
import {getHostname, getAPIUrl, loadDevTools} from "../utils";
import {API} from "../api";

//components
import Header from "./header";
import Body from "./body";

//css
import './tabular-comparison.module.css';

const TabularComparison = (props) => {
    const [api, setApi] = useState(null);
    const [profileId, setProfileId] = useState();
    const [profileConfig, setProfileConfig] = useState({});
    const [render, setRender] = useState(true);

    const mainUrl = getAPIUrl('https://staging.wazimap-ng.openup.org.za');
    const productionUrl = getAPIUrl('https://production.wazimap-ng.openup.org.za');
    const defaultProfile = 8;
    const defaultUrl = productionUrl;
    const defaultConfig = new SAConfig();
    let config = new SAConfig();
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

    loadDevTools(() => {
        if (!render) {
            return;
        }

        let hostname = getHostname();
        let pc = profiles[hostname];
        if (pc === undefined) {
            pc = {
                profile: defaultProfile,
                baseUrl: defaultUrl,
                config: defaultConfig
            }
        }

        const api = new API(pc.baseUrl, hostname);
        api.getProfileConfiguration(hostname).then((data) => {
            setApi(api);
            setProfileId(data.id);
            setProfileConfig(data.configuration)
        });
        setRender(false);
    })

    return (
        <div>
            <Header/>
            <Body
                api={api}
                profileId={profileId}
                profileConfig={profileConfig}
            />
        </div>
    );
}

export default TabularComparison;

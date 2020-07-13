window.dataLayer = window.dataLayer || [];

const MISSING_TIME = -1;

function getProfileName(payload) {
    return payload.state.profile.overview.name;
}

function getGeographyLabel(geography) {
    return `${geography.name}: ${geography.code}`;
}

const themeKey = theme => `theme: ${theme}`;
const categoryKey = category => `category: ${category}`;
const geographyKey = geography => `geography: ${getGeographyLabel(geography)}`;


class Timer {
    constructor() {
        this.timers = {}
    }

    startTimer(key) {
        this.timers[key] = new Date();
    }

    clearTimer(key) {
        this.timers[key] = undefined;
    }

    stopTimer(key) {
        const endTime = new Date();
        if (this.timers[key] != undefined)
            return endTime - this.timers[key];
        return MISSING_TIME;
    }

    stopAndClear(key) {
        const time = this.stopTimer(key);
        this.clearTimer(key);
        return time;
    }
}

export default class Analytics {
    constructor(analyticsId, profileId) {
        // TODO check inputs and raise errors if missing?

        // this.gtag = () => {
        //     dataLayer.push(arguments);
        // }

        this.timer = new Timer();

        this.gtag = window.gtag;

        this.gtag('js', new Date());
        this.gtag('config', analyticsId, { 'send_page_view': false });
        this.gtag('config', analyticsId, {
            'custom_map': {'dimension1': 'profile'}
        });
        // this.gtag('set', {profile: profileId})

        this.profileId = profileId;
    }

    logEvent(profile, category, action, label = '', value = 0) {
        console.log(`
profile: ${profile}
category: ${category}
action: ${action}
label: ${label}
value: ${value}
        `)

        this.gtag('event', action, {
            'event_category': category,
            'event_action': action,
            'event_label': label,
            'profile': profile,
            'value': value,
        })
    }

   

    registerPointEvents(controller) {
        controller.on('point_tray.theme.selected', payload => {
            const profileName = getProfileName(payload);
            const themeLabel = payload.payload.data.name;
            this.logEvent(profileName, 'points', 'theme_selected', themeLabel);
        })

        controller.on('point_tray.theme.unselected', payload => {
            const profileName = getProfileName(payload);
            const themeLabel = payload.payload.data.name;
            this.logEvent(profileName, 'points', 'theme_unselected', themeLabel);
        })

        controller.on('point_tray.category.selected', payload => {
            const profileName = getProfileName(payload);
            const categoryLabel = payload.payload.data.name;
            const key = categoryKey(categoryLabel);

            this.logEvent(profileName, 'points', 'category_selected', categoryLabel);
        })

        controller.on('point_tray.category..unselected', payload => {
            const profileName = getProfileName(payload);
            const categoryLabel = payload.payload.data.name;
            this.logEvent(profileName, 'points', 'category_unselected', categoryLabel);
        })

        controller.on('categoryPointLoading', payload => {
            const categoryLabel = payload.payload.data.name;
            const key = categoryKey(categoryLabel);

            this.timer.startTimer(key);
        })

        controller.on('categoryPointLoaded', payload => {
            const profileName = getProfileName(payload);
            const categoryLabel = payload.payload.category.data.name;
            const key = categoryKey(categoryLabel);

            const loadTime = this.timer.stopAndClear(key);
            this.logEvent(profileName, 'points', 'category_load_time', categoryLabel, loadTime);
        })
    }

    registerGeographyEvents(controller) {
        controller.on("layerLoading", payload => {
            const geography = payload.payload;
            const key = geographyKey(geography)

            this.timer.startTimer(key);
        })

        controller.on('layerLoaded', payload => {
            const profileName = getProfileName(payload);
            const geography = payload.payload.geography;
            const geographyLabel = getGeographyLabel(geography);
            const key = geographyKey(geography)

            const loadTime = this.timer.stopAndClear(key);
            this.logEvent(profileName, 'map', 'layer_loaded', geographyLabel);
            this.logEvent(profileName, 'map', 'layer_load_time', geographyLabel, loadTime);
        })
    }

    registerProfileEvents(controller) {
        controller.on("loadingNewProfile", payload => {
            const geography = payload.payload;
            const key = `Area Code: ${geography}`

            this.timer.startTimer(key);
        })

        controller.on('loadedNewProfile', payload => {
            console.log(payload)
            console.log("loadednewprofile")
            const profileName = getProfileName(payload);
            const geography = payload.payload.profile.geography;
            const geographyLabel = getGeographyLabel(geography);
            const key = `Area Code: ${geography.code}`

            const loadTime = this.timer.stopAndClear(key);
            this.logEvent(profileName, 'profile', 'profile_loaded', geographyLabel);
            this.logEvent(profileName, 'profile', 'profile_load_time', geographyLabel, loadTime);
        })
    }

    registerSearchEvents(controller) {
        controller.on("searchBefore", payload => {
            const profileName = getProfileName(payload);
            const query = payload.payload.term
            this.logEvent(profileName, 'search', 'search_query', query);
            this.timer.startTimer('Search');

        })

        controller.on("searchResults", payload => {
            const profileName = getProfileName(payload);
            const numResults = payload.payload.items.length;
            const loadTime = this.timer.stopAndClear('Search');

            this.logEvent(profileName, 'search', 'search_results', '', numResults);
            this.logEvent(profileName, 'search', 'search_results_load_time', '', loadTime);
        })

        controller.on("searchResultClick", payload => {
            const profileName = getProfileName(payload);
            const geography = payload.payload;
            const label = getGeographyLabel(geography);
            this.logEvent(profileName, 'search', 'search_click', label);
        })

        controller.on("searchClear", payload => {
            const profileName = getProfileName(payload);
            console.log(payload)
        })
    }

    registerBreadcrumbEvents(controller) {
        controller.on('breadcrumbSelected', payload => {
            const profileName = getProfileName(payload);
            const geography = payload.payload;
            const label = getGeographyLabel(geography);
            this.logEvent(profileName, 'breadcrumbs', 'breadcrumb_selected', label);
        });
    }

    registerChoroplethEvents(controller) {
        controller.on('resetChoropleth', payload => {
            const profileName = getProfileName(payload);
            this.logEvent(profileName, 'choropleth', 'reset');
        })
    }

    registerEvents(controller) {
        controller.on('subindicatorClick', payload => {
            const profileName = getProfileName(payload);
            this.logEvent(profileName, 'map_explorer', 'subindicator_click', `${payload.payload.indicatorTitle} > ${payload.state.selectedSubindicator}`);
        })

        // controller.on('choropleth', payload => {
        //     alert('choropleth')
        // })
    // // //controller.on('printProfile', payload => pdfprinter.printDiv(payload))
    //     controller.on('loadedNewProfile', payload => {
    //         const profileName = getProfileName(payload);
    //         const geography = payload.payload.profile.geography;
    //         const label = getGeographyLabel(geography);
    //         this.logEvent(profileName, 'profile', 'profile_loaded', label);


        this.registerSearchEvents(controller);
        this.registerBreadcrumbEvents(controller);
        this.registerPointEvents(controller);
        this.registerGeographyEvents(controller);
        this.registerProfileEvents(controller);
        this.registerChoroplethEvents(controller);


    // controller.on("mapZoomed", payload => pointData.onMapZoomed(payload.payload));

    // controller.on('mapChipRemoved', payload => mapcontrol.choropleth.reset(true));
    // controller.on('choroplethFiltered', payload => {
    // })

    // controller.on('newProfileWithChoropleth', payload => {

    // controller.on('zoomToggled', payload => {

    // controller.on('layerClick', payload => {
    }
}
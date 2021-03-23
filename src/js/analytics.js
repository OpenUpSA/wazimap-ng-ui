import {EVENTS as TUTORIAL_EVENTS} from './elements/tutorial';

window.dataLayer = window.dataLayer || [];

const MISSING_TIME = -1;

function getProfileName(payload) {
    if (payload != undefined && payload.state != undefined && payload.state.profile != undefined)
        return payload.state.profile.overview.name;
    else
        return "Unknown"
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
        this.gtag('event', action, {
            'event_category': category,
            'event_action': action,
            'event_label': label,
            'profile': profile,
            'value': value,
        })
    }


    basicLogEvent(payload, category, action, label = '', value = 0) {
        const profileName = getProfileName(payload);
        this.logEvent(profileName, category, action, label, value);
    }


    registerPointEvents(controller) {
        controller.on('point_tray.theme.selected', payload => {
            const themeLabel = payload.payload.data.name;
            this.basicLogEvent(payload, 'points', 'theme_selected', themeLabel);
        })

        controller.on('point_tray.theme.unselected', payload => {
            const themeLabel = payload.payload.data.name;
            this.basicLogEvent(payload, 'points', 'theme_unselected', themeLabel);
        })

        controller.on('point_tray.category.selected', payload => {
            const categoryLabel = payload.payload.data.name;
            const key = categoryKey(categoryLabel);

            this.basicLogEvent(payload, 'points', 'category_selected', categoryLabel);
        })

        controller.on('point_tray.category.unselected', payload => {
            const categoryLabel = payload.payload.data.name;
            this.basicLogEvent(payload, 'points', 'category_unselected', categoryLabel);
        })

        controller.on('point_data.load_popup.hovered', payload => {
            const label = payload.payload;
            this.basicLogEvent(payload, 'points_popup', 'hovered', label);
        })

        controller.on('point_data.load_popup.clicked', payload => {
            const label = payload.payload;
            this.basicLogEvent(payload, 'points_popup', 'clicked', label);
        })


        controller.on('categoryPointLoading', payload => {
            const categoryLabel = payload.payload.data.name;
            const key = categoryKey(categoryLabel);

            this.timer.startTimer(key);
        })

        controller.on('categoryPointLoaded', payload => {
            const categoryLabel = payload.payload.category.data.name;
            const key = categoryKey(categoryLabel);

            const loadTime = this.timer.stopAndClear(key);
            this.basicLogEvent(payload, 'points', 'category_load_time', categoryLabel, loadTime);
        })

        controller.on('point_tray.tray.loading_themes', payload => {
            const key = "Loading themes";

            this.timer.startTimer(key);
        })

        controller.on('point_tray.tray.themes_loaded', payload => {
            const key = "Loading themes";

            const loadTime = this.timer.stopAndClear(key);
            this.basicLogEvent(payload, 'points', 'loading_themes_time', '', loadTime);
        })
    }

    registerGeographyEvents(controller) {
        controller.on("map.layer.loading", payload => {
            const geography = payload.payload;
            const key = geographyKey(geography)

            this.timer.startTimer(key);
        })

        controller.on('map.layer.loaded', payload => {
            const geography = payload.payload.geography;
            const geographyLabel = getGeographyLabel(geography);
            const key = geographyKey(geography)

            const loadTime = this.timer.stopAndClear(key);
            this.basicLogEvent(payload, 'map', 'layer_loaded', geographyLabel);
            this.basicLogEvent(payload, 'map', 'layer_load_time', geographyLabel, loadTime);
        })
    }

    registerProfileEvents(controller) {
        controller.on("profile.loading", payload => {
            const geography = payload.payload;
            const key = `Area Code: ${geography}`

            this.timer.startTimer(key);
        })

        controller.on('profile.loaded', payload => {
            const geography = payload.payload.profile.geography;
            const geographyLabel = getGeographyLabel(geography);
            const key = `Area Code: ${geography.code}`

            const loadTime = this.timer.stopAndClear(key);
            this.basicLogEvent(payload, 'profile', 'profile_loaded', geographyLabel);
            this.basicLogEvent(payload, 'profile', 'profile_load_time', geographyLabel, loadTime);
        })

        controller.on('profile.chart.saveAsPng', payload => {
            const pp = payload.payload;
            this.basicLogEvent(payload, 'chart', 'saveAsPng', `${pp.title} (${pp.graphValueType})`);
        })

        controller.on('profile.chart.valueTypeChanged', payload => {
            const pp = payload.payload;
            this.basicLogEvent(payload, 'chart', 'valueTypeChanged', `${pp.title} (${pp.graphValueType})`);
        })

        controller.on('point_tray.subindicator_filter.filter', payload => {
            const pp = payload.payload;
            this.basicLogEvent(payload, 'chart', 'subindicator_filter', `${pp.indicator} | ${pp.group} | ${pp.subindicator}`);
        })

        const fileTypes = ['csv', 'excel', 'json', 'kml']

        fileTypes.forEach(el => {
            controller.on(`profile.chart.download_${el}`, payload => {
                const pp = payload.payload;
                this.basicLogEvent(payload, 'chart', `download_${el}`, `${pp.title}`);
            })
        })
    }

    registerSearchEvents(controller) {
        controller.on("search.before", payload => {
            const query = payload.payload.term
            this.basicLogEvent(payload, 'search', 'search_query', query);

            this.timer.startTimer('Search');
        })

        controller.on("search.results", payload => {
            const numResults = payload.payload.items.length;
            const loadTime = this.timer.stopAndClear('Search');

            this.basicLogEvent(payload, 'search', 'search_results', '', numResults);
            this.basicLogEvent(payload, 'search', 'search_results_load_time', '', loadTime);
        })

        controller.on("search.resultClick", payload => {
            const geography = payload.payload;
            const label = getGeographyLabel(geography);
            this.basicLogEvent(payload, 'search', 'search_click', label);
        })

        controller.on("search.clear", payload => {
            this.basicLogEvent(payload, 'search', 'clear');
        })
    }

    registerBreadcrumbEvents(controller) {
        controller.on('controller.breadcrumbs.selected', payload => {
            const geography = payload.payload;
            const label = getGeographyLabel(geography);
            this.basicLogEvent(payload, 'breadcrumbs', 'breadcrumb_selected', label);
        });

        controller.on('profile.nav.clicked', payload => {
            this.basicLogEvent(payload, 'nav', 'clicked', payload.payload)
        })
    }

    registerChoroplethEvents(controller) {
        controller.on('map.choropleth.reset', payload => {
            this.basicLogEvent(payload, 'choropleth', 'reset');
        })

        controller.on('mapchip.choropleth.filtered', payload => {
            const pp = payload.payload;
            const label = `${pp.selectedGroup} (${pp.selectedFilter})`
            this.basicLogEvent(payload, 'choropleth', 'filtered', label);
        })
    }

    registerMapchipEvents(controller) {
        controller.on('mapchip.removed', payload => {
            this.basicLogEvent(payload, 'mapchip', 'removed');
        })

        controller.on('mapchip.toggle', payload => {
            this.basicLogEvent(payload, 'mapchip', 'toggle');
        })

    }

    registerPanelEvents(controller) {
        controller.on('panel.rich_data.closed', payload => {
            this.basicLogEvent(payload, 'rich_data_panel', 'closed');
        })

        controller.on('panel.rich_data.opened', payload => {
            this.basicLogEvent(payload, 'rich_data_panel', 'opened');
        })

        controller.on('panel.point_mapper.closed', payload => {
            this.basicLogEvent(payload, 'point_mapper_panel', 'closed');
        })

        controller.on('panel.point_mapper.opened', payload => {
            this.basicLogEvent(payload, 'point_mapper_panel', 'opened');
        })

        controller.on('panel.data_mapper.closed', payload => {
            this.basicLogEvent(payload, 'data_mapper_panel', 'closed');
        })

        controller.on('panel.data_mapper.opened', payload => {
            this.basicLogEvent(payload, 'data_mapper_panel', 'opened');
        })

        controller.on('map_explorer.subindicator.click', payload => {
            const label = `${payload.payload.indicatorTitle} > ${payload.state.selectedSubindicator}`;
            this.basicLogEvent(payload, 'data_mapper', 'subindicator_click', label);
        })

    }
    
    registerTutorialEvents(controller) {
        controller.on(TUTORIAL_EVENTS.next, payload => {
            this.basicLogEvent(payload, 'tutorial', 'next');
        })

        controller.on(TUTORIAL_EVENTS.prev, payload => {
            this.basicLogEvent(payload, 'tutorial', 'previous');
        })
    }


    registerEvents(controller) {

        this.registerPanelEvents(controller);
        this.registerSearchEvents(controller);
        this.registerBreadcrumbEvents(controller);
        this.registerPointEvents(controller);
        this.registerGeographyEvents(controller);
        this.registerProfileEvents(controller);
        this.registerChoroplethEvents(controller);
        this.registerMapchipEvents(controller);
        this.registerTutorialEvents(controller);


    // controller.on("map.zoomed", payload => pointData.onMapZoomed(payload.payload));

    // controller.on('mapChipRemoved', payload => mapcontrol.choropleth.reset(true));
    // controller.on('choroplethFiltered', payload => {
    // })

    // controller.on('newProfileWithChoropleth', payload => {

    // controller.on('zoomToggled', payload => {

    // controller.on('layerClick', payload => {
    }
}
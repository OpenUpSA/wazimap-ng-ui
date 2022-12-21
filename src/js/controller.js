import {Component} from './utils';
import {VersionController} from "./versions/version_controller";
import {ConfirmationModal} from "./ui_components/confirmation_modal";

export default class Controller extends Component {
    constructor(parent, api, config, profileId = 1) {
        super(parent);
        this.config = config
        this.profileId = profileId;
        this.api = api;
        this._shouldMapZoom = false;
        this._filteredIndicators = [];

        this.state = {
            profileId: profileId,
            // Set if a choropleth is currently active
            // TODO this state should possibly be stored in the mapcontrol
            subindicator: null,
            selectedSubindicator: ''
        }

        const self = this;
        this.versionController = null;
        this.confirmationModal = new ConfirmationModal(this, ConfirmationModal.COOKIE_NAMES.DATA_MAPPER_VERSION_SELECTION);

        $(window).on('hashchange', () => {
            // On every hash change the render function is called with the new hash.
            // This is how the navigation of our app happens.
            this.api.cancelAndInitAbortController();
            const hash = decodeURI(window.location.hash);
            let parts = hash.split(':')
            let payload = null;

            if (parts[0] == '#geo') {
                payload = self.changeGeography(parts[1])
                self._shouldMapZoom = true;

            } else if (parts[0] == '#logout') {
                self.onLogout();
            } else {
                //if a category nav is clicked, the hash becomes something like #divId, in that case it should behave same as if hash == ''
                const areaCode = this.config.rootGeography;
                self._shouldMapZoom = false;
                payload = self.changeGeography(areaCode)
            }

            self.onHashChange(payload);
        });
    };

    get shouldMapZoom() {
        return this._shouldMapZoom;
    }

    get filteredIndicators() {
        return this._filteredIndicators;
    }

    changeGeography(areaCode) {
        const payload = {
            // TODO need to change this to profileId
            profile: self.profile,
            areaCode: areaCode,
        }

        this.onGeographyChange(payload);
        return payload;
    };

    onLogout() {
        this.triggerEvent("loggingOut");
        this.api.logout().then(e => {
            window.location.hash = '';
            this.triggerEvent("loggedOut");
        })
    }

    triggerEvent(event, payload) {
        payload = {
            payload: payload,
            state: this.state
        }
        super.triggerEvent(event, payload);
    };

    triggerHashChange() {
        $(window).trigger('hashchange');
    };

    /**
     * Event handler that is fired when a subindicator in the menu is clicked
     * @param  {[type]} payload [description]
     * payload {
            el: el,     # clicked element
            data: data, # profile data
            subindicators: subindicators, # child geography data for each related subindicator
            obj: obj. # subindicator data
       }
     * @return {[type]}         [description]
     */

    /**
     * Triggered when the rich data drawer is pulled across the screen
     * @param  {[type]} payload [description]
     * @return {[type]}         [description]
     */
    onSubIndicatorClick(payload) {
        let self = this;
        let triggered = false;
        if (!payload.versionData.model.isActive) {
            self.confirmationModal.askForConfirmation()
                .then((result) => {
                    if (result.confirmed) {
                        self.on('map.layer.loaded', (e) => {
                            if (!triggered) {
                                triggered = true;
                                self.setChoroplethData(payload);
                            }
                        })
                        self.versionController.activeVersion = payload.versionData;
                    }
                })
        } else {
            self.setChoroplethData(payload);
        }
    }

    setChoroplethData(payload) {
        const subindicator = {
            indicatorTitle: payload.indicatorTitle,
            selectedSubindicator: payload.selectedSubindicator,
            choropleth_method: payload.choropleth_method,
            parents: payload.parents,
            data: payload.indicatorData,
            config: payload.config,
            metadata: payload.metadata,
            indicatorId: payload.indicatorId,
            filter: this.getIndicatorFilters(payload.indicatorId) || {},
        }

        this.state.subindicator = subindicator;
        this.state.selectedSubindicator = payload.selectedSubindicator;

        this.triggerEvent("map_explorer.subindicator.click", payload);
    }

    getIndicatorFilters(indicatorId) {
        let obj = {}
        this.filteredIndicators.filter(x => x.indicatorId === indicatorId)[0]?.filter.forEach(x => {
            obj[x.group] = x.value
        })

        return obj;
    }

    onChoroplethFiltered(payload) {
        //update this.state.subindicator with the filtered values
        let subindicator = this.state.subindicator;
        subindicator.subindicatorArr = payload.subindicatorArr;
        subindicator.children = payload.data;
        subindicator.filter = payload.selectedFilter;

        this.state.subindicator = subindicator;

        this.updateFilteredIndicators(payload.selectedFilterDetails);

        this.triggerEvent("mapchip.choropleth.filtered", payload);
    }

    updateFilteredIndicators(selectedFilterDetails) {
        let subindicator = this.state.subindicator;
        let filteredIndicator = this._filteredIndicators.filter(x => x.indicatorId === subindicator.indicatorId)[0];
        let newObj = filteredIndicator == null;

        filteredIndicator = {
            indicatorId: subindicator.indicatorId,
            filter: selectedFilterDetails,
            indicatorTitle: subindicator.indicatorTitle,
            selectedSubindicator: subindicator.selectedSubindicator
        };

        if (newObj) {
            this._filteredIndicators.push(filteredIndicator)
        } else {
            this._filteredIndicators = this._filteredIndicators.map(x => x.indicatorId === subindicator.indicatorId ? {...filteredIndicator} : x);
        }

        this.triggerEvent('my_view.filteredIndicators.updated', this.filteredIndicators);
    }

    onSelectingSubindicator(payload) {
        this.state.selectedSubindicator = payload.selectedSubindicator;
        this.triggerEvent("mapchip.choropleth.selectSubindicator", payload);
    }

    /**
     * Payload includes profile and geography, e.g.
     * {
     *     profile: 1,
     *     geography: WC
     * }
     * @param  {[type]} payload [description]
     * @return {[type]}         [description]
     */
    onHashChange(payload) {
        this.triggerEvent("hashChange", payload);
    };

    onGeographyChange(payload) {
        this.loadProfile(payload, true)
    }


    loadProfile(payload, callRegisterFunction) {
        this.triggerEvent("profile.loading", payload.areaCode);

        if (this.versionController === null) {
            this.versionController = new VersionController(this, payload.areaCode, callRegisterFunction);
        } else {
            this.versionController.reInit(payload.areaCode);
        }
        this.versionController.loadAllVersions(this.config.versions);
    }

    changeHash(areaCode) {
        window.location.hash = `#geo:${areaCode}`;
    }


    onLayerClick(payload) {
        const self = this;
        if (payload.maplocker.locked) {
            return;
        }

        payload.maplocker.lock();
        payload.mapControl.zoomToLayer(payload.layer)

        const areaCode = payload.areaCode;
        this.changeHash(areaCode)

        this.triggerEvent("layerClick", payload);
    };

    onLayerLoaded(payload) {
        payload.mapControl.maplocker.unlock();
        this.triggerEvent("map.layer.loaded", payload);
    };

    onProfileLoaded(payload) {
        this.state.profile = payload;
        this.triggerEvent("profileLoaded", payload);
    };

    onPrintProfile(payload) {
        let filename = "geography";
        if (this.state.profile != null) {
            filename = this.state.profile.profile.geography.name
        }
        this.triggerEvent("printProfile", filename)
    }

    //Payload is the MapChip Element
    onMapChipRemoved(payload) {
        this.state.subindicator = null;
        this.triggerEvent('mapchip.removed', payload);
    }

    /** When a breadcrumb is clicked. Payload is a location:
     {
         code: 'WC',
         level: 'province',
         name: 'Western Cape'
    }
     */
    /**
     * [onMapChipRemoved description]
     * @param  {[type]} payload [description]
     * @return {[type]}         [description]
     */
    onBreadcrumbSelected(payload) {
        this.triggerEvent('controller.breadcrumbs.selected', payload);
        this.changeHash(payload.code)
    }

    onTutorial(event, payload) {
        this.triggerEvent(event)
    }

    onTabClicked(event) {
        this.triggerEvent(event)
    }

    /**
     * When a search result is clicked
     * {code: WC011, level: municipality, name: Matzikama}
     */
    onSearchResultClick(payload) {
        this.triggerEvent("search.resultClick", payload)
        this.changeHash(payload.code)
    }

    /**
     * Payload includes profile and geography, e.g.
     * {
     *     profile: 1,
     *     geography: [Project object]
     * }
     */
    onLoadedGeography(payload) {
        // Important to trigger loadedGeography before reinitialising Webflow
        // otherwise new elements placed on the page are not recognised by webflow
        //this.triggerEvent("loadedGeography", payload);
        // TODO remove this once the best home is found for it
        Webflow.require('ix2').init()
        // this.registerWebflowEvents();
    }

    onLoadedThemes(payload) {
        this.triggerEvent("point_tray.tray.themes_loaded", payload);
        Webflow.ready();
    }

    onBoundaryTypeChange = (payload) => {
        let currentLevel = payload['current_level'];
        let selectedType = payload['selected_type'];
        let redraw = false;

        if (selectedType !== null) {
            redraw = this.state.preferredChild !== selectedType;
            this.state.preferredChild = selectedType;
        }
        this.triggerEvent("preferredChildChange", selectedType);
        // TODO remove SA specfic stuff

        let arr = this.config.config['preferred_children'][currentLevel];
        if (selectedType !== null) {
            let index = arr.indexOf(selectedType);
            [arr[0], arr[index]] = [arr[index], arr[0]];
        }

        this.config.config['preferred_children'][currentLevel] = arr;

        if (redraw) {
            this.reDrawChildren();
        }
    }

    onPreferredChildChange(childLevel) {
        this.state.preferredChild = childLevel;
        this.triggerEvent("preferredChildChange", childLevel);
        // TODO remove SA specfic stuff
        this.config.preferredChildren['municipality'] = [childLevel];

        this.reDrawChildren();
    }

    reDrawChildren() {
        let activeVersionName = this.versionController.activeVersion.model.name;
        const payload = {
            profile: this.state.profile.profile,
            geometries: this.versionController.versionGeometries[activeVersionName]
        }

        this.triggerEvent('redraw', payload);
    }
}

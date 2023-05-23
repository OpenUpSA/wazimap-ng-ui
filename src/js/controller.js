import {Component} from './utils';
import {VersionController} from "./versions/version_controller";
import {ConfirmationModal} from "./ui_components/confirmation_modal";
import {SidePanels} from "./elements/side_panels";
import {isEmpty, isEqual} from "lodash";

export default class Controller extends Component {
    constructor(parent, api, config, profileId = 1) {
        super(parent);
        this.config = config
        this.profileId = profileId;
        this.api = api;
        this._shouldMapZoom = false;
        this._filteredIndicators = [];
        this._hiddenIndicators = [];
        this._siteWideFilters = [];

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
            const hash = decodeURI(window.location.hash);
            let parts = hash.split(':')

            if (parts[0] == '#geo') {
                this.changeHash(parts[1], true);
            }

            if (parts[0] == '#logout') {
                self.onLogout();
            }
        });

        window.addEventListener('popstate', (event) => {
            let hiddenIndicators = [], filteredIndicators = [];
            let areaCode = '';

            if (event.state) {
                filteredIndicators = event.state.filters;
                hiddenIndicators = event.state.hiddenIndicators;
                areaCode = event.state.geo
            } else {
                const urlParams = new URLSearchParams(window.location.search);
                const profileView = JSON.parse(urlParams.get("profileView"));
                areaCode = urlParams.get("geo") || this.config.rootGeography;
                if (profileView === null) {
                    if (this._filteredIndicators.length > 0) {
                        filteredIndicators = [];
                    }
                    if (this._hiddenIndicators.length > 0) {
                        hiddenIndicators = [];
                    }
                } else {
                    filteredIndicators = this.filteredIndicators;
                    hiddenIndicators = this.hiddenIndicators;
                }
            }

            if (areaCode !== this.versionController.areaCode){
              let payload = this.changeGeography(areaCode)
              this._shouldMapZoom = true;
              this.onHashChange(payload);
            } else {
              if (!isEqual(hiddenIndicators, this._hiddenIndicators)) {
                  this._hiddenIndicators = hiddenIndicators;
                  this.reloadDataMapper();
                  this.triggerEvent('my_view.hiddenIndicatorsPanel.reload', this.hiddenIndicators);
              }

              if (!isEqual(filteredIndicators, this._filteredIndicators)) {
                  this._filteredIndicators = filteredIndicators;
                  this.triggerEvent('my_view.filteredIndicators.updated', this.filteredIndicators);
                  this.triggerEvent(VersionController.EVENTS.ready, this.versionController.allVersionsBundle);
                  this.reDrawChildren();
              }
            }
        });
    };

    get shouldMapZoom() {
        return this._shouldMapZoom;
    }

    get filteredIndicators() {
        return this._filteredIndicators;
    }

    get hiddenIndicators() {
        return this._hiddenIndicators;
    }

    get siteWideFilters() {
        return this._siteWideFilters;
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
        const hash = decodeURI(window.location.hash);
        const urlParams = new URLSearchParams(window.location.search);

        let parts = hash.split(':')
        if (parts[0] == '#geo') {
            this.changeHash(parts[1], true);
        }

        const areaCode = urlParams.get("geo") || this.config.rootGeography;
        if (areaCode !== null){
          this.changeHash(areaCode, false, true)
        }
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
            indicatorId: payload.indicatorId
        }

        this.state.subindicator = subindicator;
        this.state.selectedSubindicator = payload.selectedSubindicator;

        this.triggerEvent("map_explorer.subindicator.click", payload);
    }

    onChoroplethFiltered(payload) {
        let subindicator = this.state.subindicator;
        subindicator.subindicatorArr = payload.subindicatorArr;
        subindicator.children = payload.data;

        this.state.subindicator = subindicator;

        this.updateFilteredIndicators(subindicator.indicatorId, subindicator.indicatorTitle, payload.selectedFilterDetails, payload.updadateSharedUrl, SidePanels.PANELS.dataMapper);

        this.triggerEvent("mapchip.choropleth.filtered", payload);
    }

    onChartFiltered(payload) {
        this.updateFilteredIndicators(payload.indicatorId, payload.title, payload.selectedFilter, payload.updadateSharedUrl, SidePanels.PANELS.richData);
    }

    isAlreadyInFilteredIndicators(filter, indicatorId, filterPanel) {
        let arrClone = structuredClone(this._filteredIndicators);
        const alreadyAdded = arrClone.filter(x => x.indicatorId === indicatorId)[0]?.filters
            .filter(y => y.group === filter.group && y.value === filter.value && y.appliesTo.indexOf(filterPanel) >= 0)[0] != null;

        return alreadyAdded;
    }

    updateFilteredIndicators(indicatorId, indicatorTitle, selectedFilterDetails, updateSharedUrl, filterPanel) {
        let selectedFilterDetailsClone = structuredClone(selectedFilterDetails);
        selectedFilterDetailsClone = selectedFilterDetailsClone.filter(x => !x.isDefault);
        selectedFilterDetailsClone = selectedFilterDetailsClone.filter(x => !x.isSiteWideFilter || this.isAlreadyInFilteredIndicators(x, indicatorId, filterPanel));
        let isNewObj = this._filteredIndicators.filter(x => x.indicatorId === indicatorId)[0] == null;

        let filteredIndicator = {
            indicatorId: indicatorId,
            filters: selectedFilterDetailsClone,
            indicatorTitle: indicatorTitle,
            indicatorIsAvailable: true
        };

        if (isNewObj) {
            this._filteredIndicators.push(filteredIndicator);
        } else {
            this._filteredIndicators = this._filteredIndicators.map(existingObj => {
                if (existingObj.indicatorId === indicatorId) {
                    selectedFilterDetailsClone.forEach((newFilter) => {
                        newFilter.appliesTo.forEach(panel => {
                            // check for panel
                            let filterObj = existingObj.filters.filter(x => x.appliesTo.indexOf(panel) >= 0 && x.group === newFilter.group)[0];
                            if (filterObj === null || filterObj === undefined) {
                                // either the filter is new or the existing filter doesn't apply to the current panel
                                existingObj.filters.push(newFilter);
                            } else {
                                // filter is already added, update the value and isDefault
                                filterObj.value = newFilter.value;
                                filterObj.isDefault = newFilter.isDefault;
                            }
                        })
                    })

                    let filtersToRemove = existingObj.filters.filter(f => {
                        const stillExists = selectedFilterDetailsClone.filter(x => x.group === f.group && x.value === f.value).length > 0;
                        const isSiteWideFilter = f.isSiteWideFilter || this.siteWideFilters.some(x => x.indicatorValue === f.group && x.subIndicatorValue === f.value);
                        return f.appliesTo.indexOf(filterPanel) >= 0 && !stillExists && !isSiteWideFilter;
                    })

                    filtersToRemove.forEach(x => {
                        let objToRemove = existingObj.filters.filter(y => y.group === x.group && y.value === x.value && y.appliesTo.indexOf(filterPanel) >= 0)[0];
                        if (objToRemove.appliesTo.length > 1) {
                            objToRemove.appliesTo.splice(objToRemove.appliesTo.indexOf(filterPanel), 1);
                        } else {
                            existingObj.filters.splice(existingObj.filters.indexOf(objToRemove), 1);
                        }
                    })
                    return existingObj;
                } else {
                    return existingObj;
                }
            });
        }
        if (updateSharedUrl) {
            this.updateShareUrl();
        }
        this.triggerEvent('my_view.filteredIndicators.updated', this.filteredIndicators);
    }

    removeFilteredIndicator(filteredIndicator, selectedFilter) {
        if (selectedFilter.isDefault) {
            throw 'Cannot remove a default filter';
        }

        let objToUpdate = this._filteredIndicators.filter(x => x.indicatorId === filteredIndicator.indicatorId)[0];
        let filterArr = objToUpdate.filters.filter(x => !(x.group === selectedFilter.group
            && x.value === selectedFilter.value
            && x.appliesTo.indexOf(selectedFilter.appliesTo[0]) >= 0));
        objToUpdate.filters = filterArr;

        this.triggerEvent('my_view.filteredIndicators.updated', this.filteredIndicators);   // my view window will be updated
        if (selectedFilter.appliesTo.indexOf(SidePanels.PANELS.richData) >= 0) {
            this.triggerEvent('profile.chart.filtersUpdated', filteredIndicator);   // rich data will be updated
        }

        if (selectedFilter.appliesTo.indexOf(SidePanels.PANELS.dataMapper) >= 0
            && this.state.subindicator !== null
            && this.state.subindicator.indicatorId === filteredIndicator.indicatorId) {
            this.triggerEvent('mapchip.choropleth.filtersUpdated', filteredIndicator);  // mapchip will be updated
        }
        this.updateShareUrl();
    }

    updateHiddenIndicators(indicatorId, action = "add") {
        let hiddenIndicators = structuredClone(this._hiddenIndicators);
        if (action === "add") {
            hiddenIndicators = [...hiddenIndicators, indicatorId]
        } else {
            hiddenIndicators = hiddenIndicators.filter(item => item !== indicatorId);
        }
        this._hiddenIndicators = hiddenIndicators;
        this.reloadDataMapper();
        this.updateShareUrl();
    }

    reloadDataMapper() {
        const currentGeo = this.state.profile.profile.geography.code;
        let indicators = this.versionController.getIndicatorDataByGeo(currentGeo);
        this.triggerEvent("datamapper.reload", indicators.indicatorData);
    }

    pushState(currentState) {
        let profileView = "/";

        const urlParams = new URLSearchParams(window.location.search);
        let hasOtherKeys = false;
        [...urlParams.keys()].forEach((key, index) => {
            if (key !== 'profileView') {
                profileView += `${index === 0 ? '?' : '&'}${key}=${urlParams.get(key)}`;
                hasOtherKeys = true;
            }
        })

        if (
            currentState?.filters !== undefined && currentState.filters.length > 0
            || currentState?.hiddenIndicators !== undefined && currentState.hiddenIndicators.length > 0
        ) {
            profileView += `${hasOtherKeys ? '&' : '?'}profileView=${encodeURIComponent(JSON.stringify(currentState))}`;
        }

        history.pushState(
            {
                "filters": this._filteredIndicators,
                "hiddenIndicators": this.hiddenIndicators,
                "profileView": currentState,
                "geo": this.versionController.areaCode,
            },
            '',
            `${profileView}${window.location.hash}`
        );
    }

    updateShareUrl() {
        let selectedFilters = [];
        this._filteredIndicators.map(
            (indicatorFilter) => {
                const nonDefaultFilters = indicatorFilter.filters.filter(f => f.isDefault !== true);
                if (nonDefaultFilters.length > 0) {
                    selectedFilters.push({
                        "indicatorId": indicatorFilter.indicatorId,
                        "filters": nonDefaultFilters
                    })
                }
            }
        )
        let currentState = {
            "filters": selectedFilters,
            "hiddenIndicators": this.hiddenIndicators,
        }

        const urlParams = new URLSearchParams(window.location.search);

        const profileView = JSON.parse(urlParams.get("profileView"));
        if (selectedFilters.length > 0 || this.hiddenIndicators.length > 0) {
            if (profileView === null) {
                this.pushState(currentState);
            } else {
                if (!isEqual(profileView, currentState)) {
                    this.pushState(currentState);
                }
            }
        } else if ((selectedFilters.length === 0 || this.hiddenIndicators.length === 0) && profileView !== null) {
            this.pushState(currentState);
        }
    }

    loadInitialFilters(dataBundle) {
        if (this._filteredIndicators.length > 0 || this._hiddenIndicators.length > 0) {
            return;
        }

        const profileData = dataBundle?.profile?.profileData;
        const urlParams = new URLSearchParams(window.location.search);
        const profileView = JSON.parse(urlParams.get("profileView"));
        if (profileView !== null && (profileData !== null || profileData !== undefined || !isEmpty(profileData))) {

            const urlFilters = profileView["filters"];
            this._filteredIndicators = urlFilters.map(indicator => {
                let indicatorTitle = '';
                let indicatorIsAvailable = false;
                Object.values(profileData).map(category => {
                    Object.values(category.subcategories).map(subcategory => {
                        Object.values(subcategory.indicators).map(i => {
                            if (i.id === indicator.indicatorId) {
                                indicatorTitle = i.label;
                                indicatorIsAvailable = true;
                            }
                        })
                    })
                })
                return {
                    indicatorId: indicator.indicatorId,
                    indicatorTitle: indicatorTitle,
                    filters: indicator.filters,
                    indicatorIsAvailable: indicatorIsAvailable
                }
            });

            this._hiddenIndicators = profileView["hiddenIndicators"] || [];

            history.replaceState(
                {
                    "filters": this._filteredIndicators,
                    "hiddenIndicators": this._hiddenIndicators
                },
                '',
                `${window.location.search}${window.location.hash}`
            );

            this.triggerEvent('my_view.filteredIndicators.updated', this.filteredIndicators);
            this.triggerEvent('my_view.hiddenIndicatorsPanel.reload', this.hiddenIndicators);
        }
    }

    addSiteWideFilter(indicatorValue, subIndicatorValue) {
        const alreadyAdded = this._siteWideFilters.some(x => x.indicatorValue === indicatorValue && x.subIndicatorValue === subIndicatorValue);
        if (alreadyAdded) {
            return;
        }
        this._siteWideFilters.push({
            indicatorValue,
            subIndicatorValue
        });

        const payload = {
            siteWideFilters: this.siteWideFilters,
            removedSiteWideFilter: null
        }

        this.triggerEvent('my_view.siteWideFilters.updated', payload);
    }

    removeSiteWideFilter(indicatorValue, subIndicatorValue) {
        this._siteWideFilters = this._siteWideFilters.filter(x => !(x.indicatorValue === indicatorValue && x.subIndicatorValue === subIndicatorValue));

        const payload = {
            siteWideFilters: this.siteWideFilters,
            removedSiteWideFilter: {
                indicatorValue,
                subIndicatorValue
            },
            filteredIndicators: this.filteredIndicators
        }

        this.triggerEvent('my_view.siteWideFilters.updated', payload);
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

    changeHash(areaCode, replaceState=false, isRootGeo=false) {
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set("geo", areaCode);

        if (replaceState){
          let hash = window.location.hash.replace(`#geo:${areaCode}`, '');

          history.replaceState(
              {
                  "filters": this._filteredIndicators,
                  "hiddenIndicators": this.hiddenIndicators,
                  "geo": areaCode,
              },
              '',
              `?${urlParams.toString()}${hash}`
          );
        } else if(!isRootGeo) {
          history.pushState(
              {
                  "filters": this._filteredIndicators,
                  "hiddenIndicators": this.hiddenIndicators,
                  "geo": areaCode,
              },
              '',
              `?${urlParams.toString()}${window.location.hash}`
          );
        }
        const payload = this.changeGeography(areaCode)
        this._shouldMapZoom = !isRootGeo;
        this.onHashChange(payload);
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

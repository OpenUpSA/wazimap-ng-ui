import {Component} from './utils';
import {VersionController} from "./versions/version_controller";
import {ConfirmationModal} from "./ui_components/confirmation_modal";
import {SidePanels} from "./elements/side_panels";
import {ProfileViewModel} from "./models/profile_view_model";

export default class Controller extends Component {
    constructor(parent, api, config, profileId = 1) {
        super(parent);
        this.config = config
        this.profileId = profileId;
        this.api = api;
        this._shouldMapZoom = false;
        this._filteredIndicators = [];
        this._profileViews = [];

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
        this.fetchProfileViews(profileId)
    };

    get shouldMapZoom() {
        return this._shouldMapZoom;
    }

    get filteredIndicators() {
        return this._filteredIndicators;
    }

    get profileViews() {
        return this._profileViews;
    }

    set profileViews(value) {
       this._profileViews = value;
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

        this.updateFilteredIndicators(subindicator.indicatorId, subindicator.indicatorTitle, payload.selectedFilterDetails, SidePanels.PANELS.dataMapper);

        this.triggerEvent("mapchip.choropleth.filtered", payload);
    }

    onChartFiltered(payload) {
        this.updateFilteredIndicators(payload.indicatorId, payload.title, payload.selectedFilter, SidePanels.PANELS.richData);
    }

    updateFilteredIndicators(indicatorId, indicatorTitle, selectedFilterDetails, filterPanel) {
        let filteredIndicator = this._filteredIndicators.filter(x => x.indicatorId === indicatorId)[0];
        let newObj = filteredIndicator == null;

        filteredIndicator = {
            indicatorId: indicatorId,
            filters: selectedFilterDetails,
            indicatorTitle: indicatorTitle
        };

        if (newObj) {
            this._filteredIndicators.push(filteredIndicator)
        } else {
            this._filteredIndicators = this._filteredIndicators.map(existingObj => {
                if (existingObj.indicatorId === indicatorId) {
                    selectedFilterDetails.forEach((newFilter) => {
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

                    // remove
                    let filtersToRemove = existingObj.filters.filter(f => {
                        const stillExists = selectedFilterDetails.filter(x => x.group === f.group && x.value === f.value).length > 0;
                        return f.appliesTo.indexOf(filterPanel) >= 0 && !stillExists;
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
        this.triggerEvent('my_view.filteredIndicators.updated', this.filteredIndicators);
    }

    fetchProfileViews(profileId) {
      let $this = this;
      setTimeout(function(){
          let profileViews = []
          const profileViewsContext = [
            {
              "name": "Profile View",
              "Description": "Profile View Description",
              "is_default": false,
            }, {
              "name": "Default View",
              "Description": "Default View Description",
              "is_default": true,
            }
          ]

          if (profileViewsContext.length === 0){
            profileViews.push(
              new ProfileViewModel($this, {}, true, true, true)
            )
          } else {
             profileViewsContext.map(view => profileViews.push(new ProfileViewModel($this, view, view.is_default, view.is_default)));
          }

          $this.profileViews = profileViews;
          $this.triggerEvent('my_view.profileViews.updated', $this.profileViews);
      }, 1000);
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

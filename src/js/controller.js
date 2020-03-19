import {Observable, getJSON} from './utils';
import {Geography, Profile, DataBundle} from './dataobjects';

let currentAreaCode = '';

export default class Controller extends Observable {
    constructor(baseUrl, config, profileId = 1) {
        super();
        this.baseUrl = baseUrl;
        this.config = config
        this.profileId = profileId;

        this.state = {
            profileId: profileId,
            // Set if a choropleth is currently active
            // TODO this state should possibly be stored in the mapcontrol
            subindicator: null,
            selectedSubindicator: ''
        }

        const self = this;

        $(window).on('hashchange', () => {
            // On every hash change the render function is called with the new hash.
            // This is how the navigation of our app happens.
            const hash = decodeURI(window.location.hash);
            let parts = hash.split(":")
            let areaCode = null;
            let zoomNecessary = false;

            if (parts.length == 2 && parts[2] == 'clicked')
                zoomNecessary = true;

            if (parts[0] == "#geo") {
                parts = parts[1].split(",")
                if (parts.length == 1)
                    areaCode = parts[0];
                else
                    areaCode = parts[1];
            } else {
                areaCode = config.rootGeography;
            }

            currentAreaCode = areaCode;

            const payload = {
                // TODO need to change this to profileId
                profile: self.profile,
                // TODO need to change this to areaCode
                areaCode: areaCode,
                zoomNecessary: zoomNecessary
            }

            self.triggerEvent("hashChange", payload);
            self.onHashChange(payload);
        });
    };

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
    onRichDataDrawer(payload) {
        if (payload.open == true)
            this.triggerEvent("richDataDrawerOpen", {})
        else
            this.triggerEvent("richDataDrawerClose", {})
    }

    onSubIndicatorClick(payload) {
        this.state.subindicator = payload;
        this.state.selectedSubindicator = payload.obj._keys;

        this.triggerEvent("subindicatorClick", payload);
    };

    /**
     * Payload includes profile and geography, e.g.
     * {
     *     profile: 1,
     *     geography: WC
     * }
     * @param  {[type]} payload [description]
     * @return {[type]}         [description]
     */
    onHashChange(payload, callRegisterFunction = true) {
        this.triggerEvent("hashChange", payload);
        this.loadProfile(payload, callRegisterFunction)
    };

    loadProfile(payload, callRegisterFunction) {
        const self = this;
        this.triggerEvent("loadingNewProfile", payload.geography);
        const url = `${this.baseUrl}/all_details/profile/${this.profileId}/geography/${payload.areaCode}/`;
        getJSON(url).then(js => {
            const dataBundle = new DataBundle(js);
            self.state.profile = dataBundle;

            self.triggerEvent("loadedNewProfile", dataBundle);
            // TODO this should be run after all dynamic stuff is run
            // Shouldn't be here
            setTimeout(() => {
                if (callRegisterFunction) {
                    console.log("initialising webflow")
                    Webflow.require('ix2').init()
                    self.registerWebflowEvents();
                }
            }, 600)
        })
    }

    changeHash(areaCode) {
        window.location.hash = `#geo:${areaCode}`;
    }


    onLayerClick(payload) {
        const areaCode = payload.areaCode;
        this.changeHash(areaCode)

        this.triggerEvent("layerClick", areaCode);
        window.location.hashh = "#geo:" + areaCode + ":clicked";
    };

    onLayerMouseOver(payload) {
        this.triggerEvent("layerMouseOver", payload);
    };

    onLayerMouseOut(payload) {
        this.triggerEvent("layerMouseOut", payload);
    };

    onLayerMouseMove(payload) {
        this.triggerEvent("layerMouseMove", payload);
    }

    onLayerLoading(payload) {
        this.triggerEvent("layerLoading", payload);
    };

    onLayerLoadingDone(payload) {
        this.triggerEvent("layerLoadingDone", payload);
    };

    onProfileLoaded(payload) {
        this.state.profile = payload;
        this.state.subindicators = null; // unset when a new profile is loaded
        this.triggerEvent("profileLoaded", payload);
    };

    onPrintProfile(payload) {
        let filename = "geography";
        if (this.state.profile != null) {
            filename = this.state.profile.data.geography.name
        }
        this.triggerEvent("printProfile", filename)
    }

    //Payload is the MapChip Element
    onMapChipRemoved(payload) {
        this.state.subindicator = null;
        this.triggerEvent('mapChipRemoved', payload);
    }

    onThemeSelected(payload) {
        this.triggerEvent('themeSelected', payload);
    }

    onThemeUnselected(payload) {
        this.triggerEvent('themeUnselected', payload);
    }

    onThemePointLoaded(payload) {
        this.triggerEvent('themeLoaded', payload);
    }

    onCategorySelected(payload) {
        this.triggerEvent('categorySelected', payload);
    }

    onCategoryUnselected(payload) {
        this.triggerEvent('categoryUnselected', payload);
    }

    onCategoryPointLoaded(payload) {
        this.triggerEvent('categoryPointLoaded', payload);
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
        this.triggerEvent('breadcrumbSelected', payload);
        this.changeHash(payload.code)
    }

    /* Search events */
    onSearchBefore(payload) {
        this.triggerEvent("searchBefore", payload)
    }

    onSearchResults(payload) {
        console.log(payload)
        this.triggerEvent("searchResults", payload)
    }

    /**
     * When a search result is clicked
     * {code: WC011, level: municipality, name: Matzikama}
     */
    onSearchResultClick(payload) {
        this.triggerEvent("searchResultClick", payload)
        this.changeHash(payload.code)
    }

    onSearchClear(payload) {
        this.triggerEvent("searchClear", payload)
    }


    /**
     * Payload includes profile and geography, e.g.
     * {
     *     profile: 1,
     *     geography: WC
     * }
     */
    onLoadingGeography(payload) {
        this.triggerEvent("loadingGeography", payload)
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
        this.registerWebflowEvents();
    }

    onLoadingThemes(payload) {
        this.triggerEvent("loadingThemes", payload);
    }

    onLoadedThemes(payload) {
        this.triggerEvent("loadedThemes", payload);
        Webflow.ready();
    }

    onZoomToggled(payload) {
        this.triggerEvent("zoomToggled", payload);
    }

    onPreferredChildChange(childLevel) {
        this.state.preferredChild = childLevel;
        this.triggerEvent("preferredChildChange", childLevel);
        // TODO remove SA specfic stuff
        this.config.preferredChildren['municipality'] = [childLevel];

        this.reDrawChildren();
    }

    reDrawChildren = () => {
        let currentLevel = this.state.profile.profile.geography.level;

        if (currentLevel !== 'municipality') {
            return;
        }

        const payload = {
            profile: this.state.profile.profile,
            areaCode: currentAreaCode,
            zoomNecessary: false
        }

        this.onHashChange(payload, false);
    }

    registerWebflowEvents() {
        const events = ["click", "mouseover", "mouseout"];
        const self = this;
        events.forEach(function (ev) {
            let eventElements = $(`*[data-event=${ev}]`);
            Object.values(eventElements).forEach(el => {
                if (el.attributes == undefined) return;
                const functionAttribute = el.attributes["data-function"];

                if (functionAttribute == undefined) return;
                const functions = functionAttribute.value;

                if (functions == undefined) return;

                functions.split(",").forEach(foo => {
                    const func = self[`on${foo}`];
                    if (func != undefined) {
                        $(el).on(ev, el => func(el))
                    }
                })
            })
        })
    }
}

import {Observable} from './utils';

export default class Controller extends Observable {
    constructor(profile = 1) {
        super();
        this.state = {
            profile: profile,
            // Set if a choropleth is currently active
            subindicator: null
        }

        var self = this;

        $(window).on('hashchange', () => {
            // On every hash change the render function is called with the new hash.
            // This is how the navigation of our app happens.
            const hash = decodeURI(window.location.hash);
            let parts = hash.split(":")

            let zoomNecessary = false;
            if (parts.length === 3 && parts[2] === 'clicked')
            {
                zoomNecessary = true;
            }

            if (parts[0] == "#geo") {
                parts = parts[1].split(",")
                if (parts.length == 1)
                    var geographyId = parts[0];
                else
                    var geographyId = parts[1];

                self.triggerEvent("hashChange", {
                    profile: self.profile,
                    geography: geographyId,
                    zoomNecessary:zoomNecessary
                })
            }
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
    onHashChange(payload) {
        this.triggerEvent("hashChange", payload);
    };

    onLayerClick(payload) {
        var mapItId = payload.mapItId;

        this.triggerEvent("layerClick", mapItId);
        window.location.hash = "#geo:" + mapItId + ":clicked";
    };

    onLayerMouseOver(payload) {
        this.triggerEvent("layerMouseOver", payload);
    };

    onLayerMouseOut(payload) {
        this.triggerEvent("layerMouseOut", payload);
    };

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
        this.triggerEvent('mapChipRemoved', payload);
    }

    onThemeSelected(payload) {
        this.triggerEvent('themeSelected', payload);
    }

    onThemeUnselected(payload) {
        this.triggerEvent('themeUnselected', payload);
    }

    onThemePointLoaded(payload) {
        this.triggerEvent('themePointLoaded', payload);
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
        // TODO should trigger a separate profile load event
        window.location.hash = "#geo:" + payload.code;
    }

    onSearchClear(payload) {
        this.triggerEvent("searchClear", payload)
    }

    setGeography(mapItId) {
        window.location.hash = "#geo:" + mapItId;
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
        this.triggerEvent("loadedGeography", payload);
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

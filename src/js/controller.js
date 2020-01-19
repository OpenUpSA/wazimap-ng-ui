import {Observable} from './utils';

export default class Controller extends Observable {
    constructor() {
        super();
        this.state = {
           profile: null,
           // Set if a choropleth is currently active
           subindicator: null 
        }

        var self = this;

        $(window).on('hashchange', () => {
                // On every hash change the render function is called with the new hash.
                // This is how the navigation of our app happens.
                var hash = decodeURI(window.location.hash);
                var parts = hash.split(":")
                var profileId = 1;

                if (parts[0] == "#geo") {
                    parts = parts[1].split(",")
                    if (parts.length == 1)
                        var geographyId = parts[0];
                    else
                        var geographyId = parts[1];

                    self.triggerEvent("hashChange", {
                        profileId: profileId,
                        geographyId: geographyId
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

    triggerHashChange()  {
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

    onSubIndicatorClick(payload) {
        this.state.subindicator = payload;
        this.triggerEvent("subindicatorClick", payload);
    };

    onHashChange(payload) {
        this.triggerEvent("hashChange", payload);
    };

    onLayerClick(payload) {
        var mapItId = payload.mapItId;

        this.triggerEvent("layerClick", mapItId); 
        window.location.hash = "#geo:" + mapItId;
    };

    onLayerMouseOver(payload) {
        this.triggerEvent("layerMouseOver", payload); 
    };

    onLayerMouseOut(payload) {
        this.triggerEvent("layerMouseOut", payload); 
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

    setGeography(mapItId) {
        window.location.hash = "#geo:" + mapItId;
    }

    registerWebflowEvents() {
        const events = ["click", "mouseover", "mouseout"];
        const self = this;
        events.forEach(function(ev){
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

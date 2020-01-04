import {Observer} from './utils';

export default function Controller() {
    this.observer = new Observer();
    this.state = {
       profile: null,
       // Set if a choropleth is currently active
       subindicator: null 
    }

    var self = this;

    // bind this to event handlers
    this.onSubIndicatorClick = this.onSubIndicatorClick.bind(this);
    this.onHashChange = this.onHashChange.bind(this);
    this.onLayerClick = this.onLayerClick.bind(this);
    this.onLayerMouseOver = this.onLayerMouseOver.bind(this);
    this.onLayerMouseOut = this.onLayerMouseOut.bind(this);
    this.onProfileLoaded = this.onProfileLoaded.bind(this);

    $(window).on('hashchange', function(){
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

Controller.prototype = {
    on: function(event, func) {
        this.observer.on(event, func);
    },

    triggerEvent(event, payload) {
        payload = {
            payload: payload,
            state: this.state
        }
        this.observer.triggerEvent(event, payload)
    },

    triggerHashChange: function() {
        $(window).trigger('hashchange');
    },

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
    },

    onHashChange(payload) {
        this.triggerEvent("hashChange", payload);
    },

    onLayerClick(payload) {
        var areaCode = payload.areaCode;

        this.triggerEvent("layerClick", areaCode); 
        window.location.hash = "#geo:" + areaCode;
    },

    onLayerMouseOver(payload) {
        this.triggerEvent("layerMouseOver", payload); 
    },

    onLayerMouseOut(payload) {
        this.triggerEvent("layerMouseOut", payload); 
    },

    onProfileLoaded(payload) {
        this.state.profile = payload;
        this.state.subindicators = null; // unset when a new profile is loaded
        this.triggerEvent("profileLoaded", payload); 
    },

    setGeography: function(areaCode) {
        window.location.hash = "#geo:" + areaCode;
    }
}

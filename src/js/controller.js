import {Observer} from './utils';

export default function Controller() {
    this.observer = new Observer();
    var self = this;

    // bind this to event handlers
    this.onSubIndicatorClick = this.onSubIndicatorClick.bind(this);
    this.onHashChange = this.onHashChange.bind(this);
    this.onGeoSelect = this.onGeoSelect.bind(this);

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
        this.observer.triggerEvent(event, payload)
    },

    triggerHashChange: function() {
        $(window).trigger('hashchange');
    },

    onSubIndicatorClick(payload) {
        this.observer.triggerEvent("subindicatorClick", payload);
    },

    onHashChange(payload) {
        this.observer.triggerEvent("hashChange", payload);
    },

    onGeoSelect(payload) {
        var areaCode = payload;

        this.observer.triggerEvent("geoSelect", areaCode); 
        window.location.hash = "#geo:" + areaCode;
    },

    setGeography: function(areaCode) {
        window.location.hash = "#geo:" + areaCode;
    }
}

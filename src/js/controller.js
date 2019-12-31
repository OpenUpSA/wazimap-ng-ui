export default function Controller(geoloader) {
    this.geoloader = geoloader;
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
                geoloader(profileId, geographyId);
            }
            
    });
};

Controller.prototype = {
    trigger: function() {
        $(window).trigger('hashchange');
    },

    setGeography: function(areaCode) {
        window.location.hash = "#geo:" + areaCode;
    }
}

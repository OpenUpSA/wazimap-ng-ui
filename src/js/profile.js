export function Profile(data) {
    this.data = data;
}

Profile.prototype = {
    getParent: function() {
        var parents = this.data.geography.parents;
        if (parents == undefined || parents.length == 0)
            return null;

        return parents.reverse()[0]; 
    },

    getName: function() {
        return this.data.geography.name;
    },

    getFullName: function() {
        var label = this.getName();
        var parent = this.getParent();
        if (parent != null)
            label = `${label} (${parent.name})`;

        return label;
    }
}
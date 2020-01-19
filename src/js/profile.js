export class Profile {
    constructor(data) {
        this.data = data;
    };

    getParent() {
        var parents = this.data.geography.parents;
        if (parents == undefined || parents.length == 0)
            return null;

        return parents.reverse()[0]; 
    };

    getName() {
        return this.data.geography.name;
    };

    getFullName() {
        var label = this.getName();
        var parent = this.getParent();
        if (parent != null)
            label = `${label} (${parent.name})`;

        return label;
    };
}
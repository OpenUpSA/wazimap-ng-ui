import {Component, ThemeStyle} from "../../utils";
import {FacilityItem} from "./facility_item";

export class Facility extends Component {
    constructor(parent, facilityTemplate, facilityRowClone, theme, categoryArr) {
        super(parent);

        this.facilityRowClone = facilityRowClone;
        this.facilityTemplate = facilityTemplate;
        this.categoryArr = categoryArr;
        this.theme = theme;
        this.api = this.parent.model.api;
        this.profileId = this.parent.model.profileId;
        this.geoCode = this.parent.model.geography.code;
        this.facility = null;

        this.createFacility();
    }

    createFacility() {
        let self = this;
        self.facility = self.facilityTemplate.cloneNode(true);
        $('.location-facility__name div', self.facility).text(self.theme.name);
        ThemeStyle.replaceChildDivWithIcon($(self.facility).find('.location-facility__icon'), self.theme.icon);
        $('.location-facility__value div', self.facility).text('');

        $('.location-facility__list', self.facility).html('');
        let themeCategories = self.categoryArr.filter((c) => {
            return c.theme_id === self.theme.theme_id
        });

        for (let i = 0; i < themeCategories.length; i++) {
            const isLast = i === themeCategories.length - 1;
            let row = new FacilityItem(self, self.facilityRowClone, themeCategories[i], isLast, self.parent.model.isDownloadsDisabled);
            self.parent.facilityItems.push(row);

            $('.location-facility__list', self.facility).append(row.facilityItem);
        }
    }
}
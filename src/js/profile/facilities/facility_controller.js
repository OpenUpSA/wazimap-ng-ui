import {Facility} from "./facility";
import XLSX from "xlsx";
import {Component, extractSheetsData, Observable} from "../../utils";

class FacilityControllerModel extends Observable {
    constructor(controllerParent) {
        super();

        this._controllerParent = controllerParent;
    }

    get profileId() {
        return this._controllerParent.profileId;
    }

    get geography() {
        return this._controllerParent.geography;
    }

    get geometries() {
        return this._controllerParent.geometries;
    }

    get api() {
        return this._controllerParent.api;
    }

    get isDownloadsDisabled() {
        return this._controllerParent.isDownloadsDisabled;
    }
}

export class FacilityController extends Component {
    constructor(parent) {
        super(parent);

        this._model = new FacilityControllerModel(parent);
        this.prepareDomElements();
    }

    get model() {
        return this._model;
    }

    prepareDomElements() {
        this.facilityWrapper = $('.location__facilities .location__facilities_content-wrapper');
        this.facilityTemplate = typeof $('.location-facility')[0] === 'undefined' ? null : $('.location-facility')[0].cloneNode(true);
        this.facilityRowClone = this.facilityTemplate === null ? null : $(this.facilityTemplate).find('.location-facility__list_item')[0].cloneNode(true);
    }

    addFacilities() {
        $('.location-facility', this.facilityWrapper).remove();
        let self = this;

        let categoryArr = [];
        let themes = [];

        this.model.geometries.themes.forEach((theme) => {
            let totalCount = 0;
            theme.subthemes.forEach((st) => {
                totalCount += st.count;

                categoryArr.push({
                    theme_id: theme.id,
                    count: st.count,
                    label: st.label,
                    category_id: st.id
                });
            });

            themes.push({
                theme_id: theme.id,
                name: theme.name,
                icon: theme.icon,
                count: totalCount
            });
        });

        if (themes.length > 0) {
            themes.forEach((theme) => {
                const facility = new Facility(this, this.facilityTemplate, this.facilityRowClone, theme, categoryArr);
                const facilityItem = facility.createFacility();
                $('.location-facility__description', facilityItem).addClass('hidden')

                this.facilityWrapper.prepend(facilityItem);
            })

            $('.location__facilities_header').removeClass('hidden');
            $('.location__facilities_trigger').removeClass('hidden');
            $('.location__facilities_categories-value strong').text(categoryArr.length);
            $('.location__facilities_facilities-value strong').text('');
        } else {
            $('.location__facilities').addClass('hidden');
        }

        $('.location__facilities_loading').addClass('hidden');
    }

    downloadAllFacilities() {
        this.model.api.loadAllPoints(this.model.profileId, this.model.geography.code)
            .then((data) => {
                const wb = XLSX.utils.book_new();
                const fileName = 'Facilities-' + this.model.geography.code + '.xlsx';
                let sheets = extractSheetsData(data);
                sheets.forEach((s) => {
                    const sheetData = XLSX.utils.json_to_sheet(s.sheetData);
                    const sheetName = s.sheetName;

                    XLSX.utils.book_append_sheet(wb, sheetData, sheetName);
                })

                XLSX.writeFile(wb, fileName);
            });
    }
}
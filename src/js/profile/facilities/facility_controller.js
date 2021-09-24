import {Facility} from "./facility";
import XLSX from "xlsx";
import {Component, extractSheetsData, Observable} from "../../utils";
import {TestData} from "../../test_data";

export class FacilityControllerModel extends Component {
    static EVENTS = {
        facilitiesCreated: 'FacilityControllerModel.facilitiesCreated'
    }

    constructor(parent, controllerParent) {
        super(parent);

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

        this._model = new FacilityControllerModel(this, parent);
        this._isLoading = false;
        this.facilityItems = [];
        this.prepareDomElements();
        this.prepareEvents();
    }

    get model() {
        return this._model;
    }

    get isLoading() {
        return this._isLoading;
    }

    set isLoading(value) {
        if (value) {
            this.showLoadingState();
        } else {
            this.hideLoadingState();
        }

        this._isLoading = value;
    }

    prepareDomElements() {
        this.facilityWrapper = $('.rich-data-content .location__facilities .location__facilities_content-wrapper');
        this.facilityTemplate = typeof $('.location-facility')[0] === 'undefined' ? null : $('.location-facility')[0].cloneNode(true);
        this.facilityRowClone = this.facilityTemplate === null ? null : $(this.facilityTemplate).find('.location-facility__list_item')[0].cloneNode(true);
    }

    prepareEvents() {
        const self = this;

        self.model.on(FacilityControllerModel.EVENTS.facilitiesCreated, () => {
            self.getAndUpdateFacilityItemCounts();
        })
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
                const f = new Facility(this, this.facilityTemplate, this.facilityRowClone, theme, categoryArr);
                $('.location-facility__description', f.facility).addClass('hidden')

                this.facilityWrapper.prepend(f.facility);
            })

            $('.location__facilities_header').removeClass('hidden');
            $('.location__facilities_trigger').removeClass('hidden');
            $('.location__facilities_categories-value strong').text(categoryArr.length);
            $('.location__facilities_facilities-value strong').text('');

            self.model.triggerEvent(FacilityControllerModel.EVENTS.facilitiesCreated);
            self.isLoading = false;
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

    getAndUpdateFacilityItemCounts() {
        const self = this;
        const data = this.getFacilityItemCounts();

        data.forEach((theme) => {
            theme.subthemes.forEach((st) => {
                let fi = self.facilityItems.filter((fi) => {
                    return fi.category.category_id === st.id;
                })[0];

                if (fi !== undefined) {
                    fi.setFacilityCount(st.count);
                }
            })
        })
    }

    getFacilityItemCounts() {
        //call the API here - data should be the API data
        const td = new TestData();
        let data;
        if (this.model.geography.code === 'ZA') {
            data = td.themeDataZA;
        } else if (this.model.geography.code === 'EC') {
            data = td.themeDataEC;
        }

        return data;
    }

    hideLoadingState() {
        $('.location__facilities_title--loading').addClass('hidden');
        $('.location__facilities_title').removeClass('hidden');

        $('.location-facilities__trigger--loading').addClass('hidden');
        $('.location__facilities_expand').removeClass('hidden');
        $('.location__facilities_contract').removeClass('hidden');

        $('.location__facilities_download-all').removeClass('disabled');
    }

    showLoadingState() {
        $('.location__facilities_title--loading').removeClass('hidden');
        $('.location__facilities_title').addClass('hidden');

        $('.location-facilities__trigger--loading').removeClass('hidden');
        $('.location__facilities_expand').addClass('hidden');
        $('.location__facilities_contract').addClass('hidden');
        $('.location__facilities_contract').trigger('click');

        $('.location__facilities_download-all').addClass('disabled');
    }
}
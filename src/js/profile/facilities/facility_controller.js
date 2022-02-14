import {Facility} from "./facility";
import XLSX from "xlsx";
import {Component, extractSheetsData} from "../../utils";
import * as Sentry from "@sentry/browser";

export class FacilityControllerModel extends Component {
    static EVENTS = {
        facilitiesCreated: 'FacilityControllerModel.facilitiesCreated'
    }

    constructor(parent, controllerParent) {
        super(parent);

        this._controllerParent = controllerParent;
        this._themes = null;
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

    get themes() {
        return this._themes;
    }

    set themes(value) {
        this._themes = value;
    }
}

export class FacilityController extends Component {
    constructor(parent) {
        super(parent);

        this._model = new FacilityControllerModel(this, parent);
        this._isLoading = false;
        this._isFailed = false;
        this._isExpanded = false;
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

    get isFailed() {
        return this._isFailed;
    }

    set isFailed(value) {
        if (value) {
            $('.rich-data-content .location__facilities .location__facilities_header').addClass('hidden');
            $('.rich-data-content .location__facilities .location__facilities_trigger').addClass('hidden');
            $('.rich-data-content .location__facilities .location__facilities_error').removeClass('hidden');
        } else {
            $('.rich-data-content .location__facilities .location__facilities_error').addClass('hidden');
        }

        this._isFailed = value;
    }

    get isExpanded() {
        return this._isExpanded;
    }

    set isExpanded(value) {
        if (value) {
            this.expandButton.addClass('hidden');
            this.collapseButton.removeClass('hidden');
            this.facilityContent.removeClass('is--hidden').addClass('is--shown');
        } else {
            this.expandButton.removeClass('hidden');
            this.collapseButton.addClass('hidden');
            this.facilityContent.addClass('is--hidden').removeClass('is--shown');
        }

        this._isExpanded = value;
    }

    prepareDomElements() {
        this.facilityContent = $('.rich-data-content .location__facilities .location__facilities_content');
        this.facilityWrapper = $('.rich-data-content .location__facilities .location__facilities_content-wrapper');
        this.facilityTemplate = typeof $('.location-facility')[0] === 'undefined' ? null : $('.location-facility')[0].cloneNode(true);
        this.facilityRowClone = this.facilityTemplate === null ? null : $(this.facilityTemplate).find('.location-facility__list_item')[0].cloneNode(true);

        this.expandButton = $('.location__facilities_expand');
        this.collapseButton = $('.location__facilities_contract');

        this.prepareFailMessage();

        this.isExpanded = false;
    }

    prepareEvents() {
        this.expandButton.on('click', () => {
            this.isExpanded = true;
        })
        this.collapseButton.on('click', () => {
            this.isExpanded = false;
        })
    }

    prepareFailMessage() {
        if ($('.rich-data-content .location__facilities .location__facilities_error').length > 0) {
            return;
        }

        let failMsg = document.createElement('div');
        $(failMsg).addClass('location__facilities_error').addClass('hidden');
        $(failMsg).html('Failed to load this data');

        $(failMsg).css('display', 'block');
        $(failMsg).css('color', '#666');
        $(failMsg).css('width', '100%');
        $(failMsg).css('background-color', '#f0f0f0');
        $(failMsg).css('padding', '4px 6px');
        $(failMsg).css('font-size', '0.9em');
        $(failMsg).css('border-radius', '2px');
        $(failMsg).css('margin-right', '6px');
        $(failMsg).css('margin-left', '6px');

        $('.rich-data-content .location__facilities').append(failMsg);
    }

    getAndAddFacilities(activeVersion) {
        if (this.model.api !== null) {
            this.model.api.getThemesCount(this.model.profileId, this.model.geography.code, activeVersion.model.name)
                .then((data) => {
                    this.model.themes = data;
                    this.addFacilities();
                })
                .catch((err) => {
                    console.error({err})
                    this.isLoading = false;
                    this.isFailed = true;
                    Sentry.captureException(err);
                })
        }
    }

    addFacilities() {
        $('.location-facility', this.facilityWrapper).remove();
        let self = this;

        let categoryArr = [];
        let themes = [];
        let totalCount = 0;

        this.model.themes.forEach((theme) => {
            let themeCount = 0;
            theme.subthemes.forEach((st) => {
                totalCount += st.count;
                themeCount += st.count;

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
                count: themeCount
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
            $('.location__facilities_facilities-value strong').text(totalCount + ' ');

            self.model.triggerEvent(FacilityControllerModel.EVENTS.facilitiesCreated);
            self.isLoading = false;
            self.isFailed = false;
            $('.location__facilities').removeClass('hidden');
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

    hideLoadingState() {
        $('.location__facilities_loading').addClass('hidden');
        $('.location__facilities_title--loading').addClass('hidden');
        $('.location__facilities_title').removeClass('hidden');

        $('.location-facilities__trigger--loading').addClass('hidden');
        this.expandButton.removeClass('hidden');

        $('.location__facilities_download-all').removeClass('disabled');
    }

    showLoadingState() {
        $('.location__facilities_title--loading').removeClass('hidden');
        $('.location__facilities_title').addClass('hidden');

        $('.location-facilities__trigger--loading').removeClass('hidden');
        this.isExpanded = false;
        this.expandButton.addClass('hidden');

        $('.location__facilities_download-all').addClass('disabled');
    }
}
import {Component, extractSheetData, Observable} from "../../utils";
import XLSX from "xlsx";
import {FacilityControllerModel} from "./facility_controller";

export class FacilityItemModel extends Component {
    constructor(parent, label) {
        super(parent);

        this._label = label;
        this._count = -1;
    }

    set count(value) {
        this._count = value;
    }
}

export class FacilityItem extends Component {
    constructor(parent, facilityRowClone, category, isLast, isDownloadsDisabled) {
        super(parent);

        this.facilityRowClone = facilityRowClone;
        this.facilityItem = null;
        this.category = category;

        this._model = new FacilityItemModel(this);

        this.createFacilityItem(isLast, isDownloadsDisabled);
    }

    get model() {
        return this._model;
    }

    createFacilityItem(isLast, isDownloadsDisabled) {
        const self = this;
        self.facilityItem = self.facilityRowClone.cloneNode(true);
        if (isLast) {
            $(self.facilityItem).addClass('last');
        }

        $('.location-facility__item_name .truncate', self.facilityItem).text(self.category.label);
        self.hideFacilityCount();

        if (!isDownloadsDisabled) {
            $(self.facilityItem).on('click', () => {
                self.downloadPointData(self.category);
            })
        } else {
            $('.location-facility__item_download', self.facilityItem).addClass('hidden');
        }
    }

    downloadPointData(category) {
        const fileName = 'Export-' + category.label + '.xlsx';
        this.getAddressPoints(category)
            .then((sheet) => {
                // export json (only array possible) to Worksheet of Excel
                const data = XLSX.utils.json_to_sheet(sheet.sheetData);
                // A workbook is the name given to an Excel file
                const wb = XLSX.utils.book_new(); // make Workbook of Excel
                // add Worksheet to Workbook
                XLSX.utils.book_append_sheet(wb, data, sheet.sheetName);
                // export Excel file
                XLSX.writeFile(wb, fileName);
            });
    }

    getAddressPoints(category) {
        return this.parent.api.loadPoints(this.parent.profileId, category.category_id, this.parent.geoCode).then(data => {
            let sheet = extractSheetData(data, category.label);

            return sheet;
        })
    }

    hideFacilityCount() {
        $('.location-facility__item_value', this.facilityItem).addClass('hidden');
        $('.location-facility__item--loading', this.facilityItem).removeClass('hidden');
    }

    setFacilityCount(value) {
        this.model.count = value;

        $('.location-facility__item_value', this.facilityItem).removeClass('hidden');
        $('.location-facility__item_value div', this.facilityItem).text(value);
        $('.location-facility__item--loading', this.facilityItem).addClass('hidden');
    }
}
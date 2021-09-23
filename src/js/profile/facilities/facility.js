import {Component, extractSheetData, ThemeStyle} from "../../utils";
import XLSX from "xlsx";

export class Facility extends Component {
    constructor(parent, facilityTemplate, facilityRowClone, theme, categoryArr) {
        super(parent);

        this.facilityTemplate = facilityTemplate;
        this.facilityRowClone = facilityRowClone;
        this.theme = theme;
        this.categoryArr = categoryArr;
    }

    createFacility() {
        let self = this;
        let facilityItem = self.facilityTemplate.cloneNode(true);
        $('.location-facility__name div', facilityItem).text(self.theme.name);
        ThemeStyle.replaceChildDivWithIcon($(facilityItem).find('.location-facility__icon'), self.theme.icon);
        $('.location-facility__value div', facilityItem).text('');

        //.location-facility__item .tooltip__points_label .truncate
        $('.location-facility__list', facilityItem).html('');
        let themeCategories = self.categoryArr.filter((c) => {
            return c.theme_id === self.theme.theme_id
        });

        for (let i = 0; i < themeCategories.length; i++) {
            let rowItem = self.facilityRowClone.cloneNode(true);
            if (i === themeCategories.length - 1) {
                $(rowItem).addClass('last');
            }

            $('.location-facility__item_name .truncate', rowItem).text(themeCategories[i].label);
            $('.location-facility__item_value div', rowItem).text('14');

            $('.location-facility__list', facilityItem).append(rowItem);

            if (!self.parent.model.isDownloadsDisabled) {
                $(rowItem).on('click', () => {
                    self.downloadPointData(themeCategories[i]);
                })
            } else {
                $('.location-facility__item_download', rowItem).addClass('hidden');
            }
        }

        return facilityItem;
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
        return this.parent.model.api.loadPoints(this.parent.model.profileId, category.category_id, this.parent.model.geography.code).then(data => {
            let sheet = extractSheetData(data, category.label);

            return sheet;
        })
    }
}
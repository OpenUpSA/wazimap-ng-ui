import {checkIterate, extractSheetData, extractSheetsData, Observable, ThemeStyle} from "../utils";
import XLSX from "xlsx";
import regeneratorRuntime from 'regenerator-runtime/runtime';

let breadcrumbsContainer = null;
let breadcrumbTemplate = null;

let facilityWrapper = null;
let facilityTemplate = null;
let facilityRowClone = null;

let parents = null;
let geometries = null;
let geography = null;

const breadcrumbClass = '.breadcrumb';
const locationDescriptionClass = '.location__description';

const downloadAllFacilities = '.location__facilities_download-all';

export class Profile_header extends Observable {
    constructor(_parents, _geometries, _api, _profileId, _geography) {
        super();

        this.api = _api;
        this.profileId = _profileId;

        parents = _parents;
        geometries = _geometries;
        geography = _geography;

        breadcrumbsContainer = $('.location__breadcrumbs');
        breadcrumbTemplate = $('.styles').find(breadcrumbClass)[0];

        facilityWrapper = $('.location__facilities .location__facilities_content-wrapper');
        facilityTemplate = typeof $('.location-facility')[0] === 'undefined' ? null : $('.location-facility')[0].cloneNode(true);
        facilityRowClone = facilityTemplate === null ? null : $(facilityTemplate).find('.location-facility__list_item')[0].cloneNode(true);

        $(downloadAllFacilities).on('click', () => this.downloadAllFacilities());

        this.setPointSource();
        this.addBreadCrumbs();
        this.addFacilities();
        this.setLocationDescription();
    }

    addBreadCrumbs = () => {
        let self = this;
        $(breadcrumbClass, breadcrumbsContainer).remove();

        if (parents !== null && parents.length > 0) {
            parents.forEach(parent => {
                let breadcrumb = breadcrumbTemplate.cloneNode(true);
                $(".truncate", breadcrumb).text(parent.name);
                $(breadcrumb).on('click', () => {
                    self.triggerEvent('profile.breadcrumbs.selected', parent);
                    $(breadcrumb).off("click")
                })

                breadcrumbsContainer.append(breadcrumb);
            })
            $(breadcrumbsContainer).removeClass('hidden');
        } else {
            $(breadcrumbsContainer).addClass('hidden');
        }
    }

    addFacilities = () => {
        $('.location-facility', facilityWrapper).remove();
        let self = this;

        let categoryArr = [];
        let themes = [];

        geometries.themes.forEach((theme) => {
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
            let totalCount = 0;
            themes.forEach((theme) => {
                let facilityItem = facilityTemplate.cloneNode(true);
                $('.location-facility__name div', facilityItem).text(theme.name);
                ThemeStyle.replaceChildDivWithIcon($(facilityItem).find('.location-facility__icon'), theme.icon);
                $('.location-facility__value div', facilityItem).text(theme.count);
                totalCount += theme.count;

                //.location-facility__item .tooltip__points_label .truncate
                $('.location-facility__list', facilityItem).html('');
                let themeCategories = categoryArr.filter((c) => {
                    return c.theme_id === theme.theme_id
                });

                for (let i = 0; i < themeCategories.length; i++) {
                    let rowItem = facilityRowClone.cloneNode(true);
                    if (i === themeCategories.length - 1) {
                        $(rowItem).addClass('last');
                    }

                    $('.location-facility__item_name .truncate', rowItem).text(themeCategories[i].label);
                    $('.location-facility__item_value div', rowItem).text(themeCategories[i].count);

                    $('.location-facility__list', facilityItem).append(rowItem);

                    $(rowItem).on('click', () => {
                        self.downloadPointData(themeCategories[i]);
                    })
                }
                $('.location-facility__description', facilityItem).addClass('hidden')

                facilityWrapper.prepend(facilityItem);
            })

            $('.location__facilities_header').removeClass('hidden');
            $('.location__facilities_trigger').removeClass('hidden');
            $('.location__facilities_categories-value strong').text(categoryArr.length);
            $('.location__facilities_facilities-value strong').text(totalCount);
        } else {
            $('.location__facilities').addClass('hidden');
        }

        $('.location__facilities_loading').addClass('hidden');
    }

    downloadAllFacilities = () => {
        this.api.loadAllPoints(this.profileId, geography.code)
            .then((data) => {
                const wb = XLSX.utils.book_new();
                const fileName = 'Facilities-' + geography.code + '.xlsx';
                let sheets = extractSheetsData(data);
                sheets.forEach((s) => {
                    const sheetData = XLSX.utils.json_to_sheet(s.sheetData);
                    const sheetName = s.sheetName;

                    XLSX.utils.book_append_sheet(wb, sheetData, sheetName);
                })

                XLSX.writeFile(wb, fileName);
            });
    }

    downloadPointData = (category) => {
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

    getAddressPoints = (category) => {
        return this.api.loadPoints(this.profileId, category.category_id, geography.code).then(data => {
            let sheet = extractSheetData(data, category.label);

            return sheet;
        })
    }

    setPointSource = () => {
        //todo:change this when the API is ready
        $('.location__sources_loading').addClass('hidden');
        $('.location__sources').addClass('hidden');
        $('.location__sources_no-data').removeClass('hidden');
    }

    setLocationDescription = () => {
        if (parents !== null && parents.length > 0) {
            $(locationDescriptionClass).find('.location-type').text(geography.level);
            $(locationDescriptionClass).find('.parent-geography').text(parents[parents.length - 1].name);
            $(locationDescriptionClass).removeClass('hidden');
        } else {
            $(locationDescriptionClass).addClass('hidden');
        }
    }
}

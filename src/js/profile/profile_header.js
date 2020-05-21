import {Observable, ThemeStyle} from "../utils";

let breadcrumbsContainer = null;
let breadcrumbTemplate = null;

let facilityWrapper = null;
let facilityTemplate = null;
let facilityRowClone = null;

let parents = null;
let geometries = null;

const breadcrumbClass = '.breadcrumb';

export class Profile_header extends Observable {
    constructor(_parents, _geometries) {
        super();

        parents = _parents;
        geometries = _geometries;

        breadcrumbsContainer = $('.location__breadcrumbs');
        breadcrumbTemplate = $('.styles').find(breadcrumbClass)[0];

        facilityWrapper = $('.location__facilities');
        facilityTemplate = $('.location-facility')[0].cloneNode(true);
        facilityRowClone = $(facilityTemplate).find('.location-facility__list_item')[0].cloneNode(true);

        this.addBreadCrumbs();
        this.addFacilities();
    }

    addBreadCrumbs = () => {
        let self = this;
        $(breadcrumbClass, breadcrumbsContainer).remove();

        parents.forEach(parent => {
            let breadcrumb = breadcrumbTemplate.cloneNode(true);
            $(".truncate", breadcrumb).text(parent.name);
            $(breadcrumb).on('click', () => {
                self.triggerEvent('breadcrumbSelected', parent);
                $(breadcrumb).off("click")
            })

            breadcrumbsContainer.append(breadcrumb);
        })
    }

    addFacilities = () => {
        $('.location-facility', facilityWrapper).remove();

        let categoryArr = [];
        let themes = [];

        geometries.themes.forEach((theme) => {
            let totalCount = 0;
            theme.subthemes.forEach((st) => {
                totalCount += st.count;

                categoryArr.push({
                    theme_id: theme.id,
                    count: st.count,
                    label: st.label
                });
            });

            themes.push({
                theme_id: theme.id,
                name: theme.name,
                icon: theme.icon,
                count: totalCount
            });
        });

        themes.forEach((theme) => {
            let facilityItem = facilityTemplate.cloneNode(true);
            $('.location-facility__name div', facilityItem).text(theme.name);
            ThemeStyle.replaceChildDivWithThemeIcon(theme.theme_id, $(facilityItem).find('.location-facility__icon'), $(facilityItem).find('.location-facility__icon'));
            $('.location-facility__value div', facilityItem).text(theme.count);

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
            }
            $('.location-facility__description', facilityItem).addClass('hidden')

            $(facilityItem).on('click', () => {
                this.downloadPointData();
            })

            facilityWrapper.append(facilityItem);
        })

        $(facilityWrapper).find('.location__facilities_loading').addClass('hidden');
    }

    downloadPointData = () => {
        //alert('bb')
    }
}
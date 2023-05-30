import {Component, trimValue} from "../../utils";
import {FilterController} from "./filter_controller";
import {DataFilterModel} from "../../models/data_filter_model";
import {createRoot} from "react-dom/client";
import React from "react";
import KeywordSearch from "./keyword-search";

export class PointFilter extends Component {
    constructor(parent) {
        super(parent);

        this._isVisible = false;
        this._activePoints = [];
        this._filterCallback = null;
        this._filterController = null;

        this._mapBottomItems = '.map-bottom-items--v2';
        this._upArrow = `${this._mapBottomItems} .point-filters .toggle-icon-v--last`;
        this._downArrow = `${this._mapBottomItems} .point-filters .toggle-icon-v--first`;
        this._filterContent = `${this._mapBottomItems} .point-filters_content`;

        this.prepareEvents();
        this.prepareDomElements();
    }

    get filterCallback() {
        return this._filterCallback;
    }

    set filterCallback(value) {
        this._filterCallback = value;
    }

    get activePoints() {
        return this._activePoints;
    }

    set activePoints(value) {
        this._activePoints = value;
        if (this._filterController !== null) {
            let dataFilterModel = new DataFilterModel(this.groups, {}, null, '', this.activePoints, [], DataFilterModel.FILTER_TYPE.points);
            this._filterController.updateDataFilterModel(dataFilterModel);
        }
    }

    get isVisible() {
        return this._isVisible;
    }

    get groups() {
        const self = this;
        const defaultOption = {
            name: 'Keyword',
            values: []
        };
        let groups = [defaultOption];
        let categories = [...new Set(this.activePoints.map(x => x.category))];
        let isFilterable = categories.some(x => self.getFilterableFields(x).length > 0);

        if (isFilterable) {
            this.activePoints.forEach((ap) => {
                const filterableFields = self.getFilterableFields(ap.category);
                if (filterableFields.length > 0) {
                    ap.point.data.forEach((d) => {
                        const dVal = trimValue(d.value);
                        if (groups.filter(g => g.name === d.key).length <= 0) {
                            if (dVal !== '' && filterableFields.indexOf(d.key) >= 0) {
                                groups.push({
                                    name: d.key,
                                    values: [dVal]
                                });
                            }
                        } else {
                            let group = groups.filter(g => g.name === d.key)[0];
                            if (dVal !== '' && group.values.filter(v => trimValue(v) === dVal).length <= 0) {
                                group.values.push(dVal);
                            }

                            group.values.sort();
                        }
                    })
                }
            })
        }

        return groups
    }

    set isVisible(value) {
        if (!this.isVisible && value) {
            this._filterController = new FilterController(this);
            let dataFilterModel = new DataFilterModel(this.groups, {}, null, '', this.activePoints, [], DataFilterModel.FILTER_TYPE.points);
            if (this._filterController.filterCallback === null) {
                this._filterController.filterCallback = this.filterCallback;
            }
            this._filterController.setDataFilterModel(dataFilterModel);

            $(`${this._mapBottomItems} .point-filters`).removeClass('hidden');


            this.filterController.on('filterRow.keyword.selected', (filterRow) => {
                let root = createRoot(filterRow.subIndicatorDropdown.container);
                root.render(
                    <KeywordSearch/>
                );
            })

            this.hideFilterContent();
        } else if (!value) {
            $(`${this._mapBottomItems} .point-filters`).addClass('hidden');
        }
        this._isVisible = value;
    }

    get filterController() {
        return this._filterController;
    }

    getFilterableFields(category) {
        let fields = [];

        if (category.configuration !== undefined && category.configuration.filterable_fields !== undefined) {
            fields = category.configuration.filterable_fields;
        }

        return fields;
    }

    prepareEvents() {
        $('.point-filters__header-close').on('click', () => this.isVisible = false);
    }

    prepareDomElements() {
        this.setTitleElement();
        this.setCloseButton();
        this.setContentVisibility();
    }

    setTitleElement() {
        let titleEle = document.createElement('div');
        $(titleEle).attr('data-i18n', 'Point Filters');
        $(titleEle).text('Point Filters');
        $(titleEle).addClass('i18n');

        $('.filters__header_name .truncate').html(titleEle);
    }

    setCloseButton() {
        $('.point-filters__header-close').on('click', () => {
            this.parent.unSelectAllCategories();
        })
    }

    setContentVisibility() {
        $(this._upArrow).on('click', () => {
            this.showFilterContent()
        });

        $(this._downArrow).on('click', () => {
            this.hideFilterContent()
        });

        this.showFilterContent();
    }

    showFilterContent() {
        $(this._upArrow).addClass('hidden');
        $(this._downArrow).removeClass('hidden');
        $(this._filterContent).removeClass('hidden');
    }

    hideFilterContent() {
        $(this._upArrow).removeClass('hidden');
        $(this._downArrow).addClass('hidden');
        $(this._filterContent).addClass('hidden');
    }
}

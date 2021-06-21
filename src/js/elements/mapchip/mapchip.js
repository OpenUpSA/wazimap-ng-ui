import {FilterController} from "../subindicator_filter/filter_controller";
import {Legend} from "./legend";
import {DataFilterModel} from "../../models/data_filter_model";
import {Component} from "../../utils";

const filterContentClass = '.map-options__filters_content';
const mapChipBlockClass = '.map-options';
const filterRowClass = '.map-options__filter-row';
const legendContainerClass = '.map-options__legend_wrap';

/**
 * Represent the map chip at the bottom of the map
 */
export class MapChip extends Component {
    constructor(legendColors) {
        super();

        this.prepareDomElements();

        this._filterController = new FilterController(this._filtersContainer);
        this._legend = new Legend(this._legendContainer, legendColors);

        this.prepareEvents();
    }

    get container() {
        return this._container;
    }

    prepareDomElements() {
        this._container = $(mapChipBlockClass)[0];
        this._closeButton = $(this.container).find('.filters__header_close')
        this._descriptionArea = $('.map-options__context .map-option__context_text div');
        this._filtersContainer = $(this.container).find(filterContentClass);
        this._legendContainer = $(this.container).find(legendContainerClass);
    }

    prepareEvents() {
        this._closeButton.on('click', () => this.removeMapChip());
    }

    setDescription(text) {
        this._descriptionArea.text(text);
    }

    setTitle(indicatorTitle, selectedSubindicator) {

        let label = `${indicatorTitle} (${selectedSubindicator})`;
        if (indicatorTitle === selectedSubindicator) {
            label = indicatorTitle;
        }

        $(this.container).find('.filters__header_name div').text(label);
    }

    hide() {
        $(this.container).addClass('hidden');
    }

    show() {
        $(this.container).removeClass('hidden');
        $(this.container).show();  //webflow.js adds display:none when clicked on x
    }

    removeMapChip() {
        this.hide();
        this.triggerEvent('mapchip.removed', this.container);
    }

    applyFilter = (filterResult, selectedFilter) => {
        console.log({selectedFilter})
        if (filterResult !== null) {
            const payload = {
                data: filterResult,
                selectedFilter: selectedFilter
            }

            this.triggerEvent("mapchip.choropleth.filtered", payload)
        }
    }

    onChoropleth(payload) {
        this._legend.show(payload.colors, payload.intervals);
    }


    onSubIndicatorChange(params) {
        if (typeof params.childData === 'undefined') {
            return;
        }

        const previouslySelectedFilters = params.filter;

        let dataFilterModel = new DataFilterModel(params.groups, params.chartConfiguration.filter, previouslySelectedFilters, params.primaryGroup, params.childData);
        this.setTitle(params.indicatorTitle, params.selectedSubindicator);
        this.setDescription(params.description);
        this.show();
        if (this._filterController.filterCallback === null) {
            this._filterController.filterCallback = this.applyFilter;
        }
        this._filterController.setDataFilterModel(dataFilterModel);
    }
}

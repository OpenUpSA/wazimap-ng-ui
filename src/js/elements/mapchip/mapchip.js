import {FilterController} from "../subindicator_filter/filter_controller";
import {Legend} from "./legend";
import {DataFilterModel} from "../../models/data_filter_model";
import {Component} from "../../utils";

const filterContentClass = '.map-options__filters_content';
const mapChipBlockClass = '.map-options';
const legendContainerClass = '.map-options__legend_wrap';

/**
 * Represent the map chip at the bottom of the map
 */
export class MapChip extends Component {
    constructor(parent, legendColors) {
        super(parent);

        this.prepareDomElements();

        this._filterController = new FilterController(this, this._filtersContainer);
        this._legend = new Legend(this, this._legendContainer, legendColors);

        this.prepareUIEvents();
    }

    get container() {
        return this._container;
    }

    get description() {
        return $(this._descriptionArea).text();
    }

    get title() {
        return $(this._titleArea).text();
    }

    set title(text) {
        $(this._titleArea).text(text);
    }

    set description(text) {
        $(this._descriptionArea).text(text)
    }

    prepareDomElements() {
        this._container = $(mapChipBlockClass)[0];
        this._closeButton = $(this.container).find('.filters__header_close')
        this._descriptionArea = $('.map-options__context .map-option__context_text div');
        this._titleArea = $(this.container).find('.filters__header_name div');
        this._filtersContainer = $(this.container).find(filterContentClass);
        this._legendContainer = $(this.container).find(legendContainerClass);
    }

    prepareUIEvents() {
        this._closeButton.on('click', () => this.removeMapChip());
    }

    setTitle(indicatorTitle, selectedSubindicator) {

        let label = `${indicatorTitle} (${selectedSubindicator})`;
        if (indicatorTitle === selectedSubindicator) {
            label = indicatorTitle;
        }

        this.title = label;
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
        if (params.childData === undefined) {
            return;
        }

        const previouslySelectedFilters = params.filter;

        let dataFilterModel = new DataFilterModel(params.groups, params.chartConfiguration.filter, previouslySelectedFilters, params.primaryGroup, params.childData);
        this.setTitle(params.indicatorTitle, params.selectedSubindicator);
        this.description = params.description;
        
        this.show();
        if (this._filterController.filterCallback === null) {
            this._filterController.filterCallback = this.applyFilter;
        }
        this._filterController.setDataFilterModel(dataFilterModel);
    }
}

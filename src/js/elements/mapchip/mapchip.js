import {FilterController} from "../subindicator_filter/filter_controller";
import {Legend} from "./legend";
import {DataFilterModel} from "../../models/data_filter_model";
import {Component} from "../../utils";
import {Tooltip} from "../../ui_components/tooltip";
import {FilterLabel} from "./components/filter_label";
import {DescriptionInfoIcon} from "./components/description_info_icon";

const filterContentClass = '.map-options__filters_content';
const mapChipBlockClass = '.map-bottom-items--v2 .map-options';
const legendContainerClass = '.map-options__legend_wrap';
const filterHeaderClass = '.filter__header_sub-indicator';
const filterHeaderToggleClass = ".filters__header_toggle";

/**
 * Represent the map chip at the bottom of the map
 */
export class MapChip extends Component {
    constructor(parent, legendColors) {
        super(parent);
        this._tooltip = new Tooltip();
        this.prepareDomElements();
        this.updateDomElements();

        this._legend = new Legend(this, this._legendContainer, legendColors);
        this._isLoading = false;
        this._filterController = null;
        this._isContentVisible = false;
        this._appliedFilters = {};
        this.prepareUIEvents();

        // Load components
        this._filterLabel = new FilterLabel(this);
        this._descriptionIcon = new DescriptionInfoIcon(this);
    }

    get isContentVisible() {
      return this._isContentVisible;
    }

    get filterLabel(){
      return this._filterLabel;
    }

    get descriptionIcon(){
      return this._descriptionIcon;
    }

    set isContentVisible(value) {
      this._isContentVisible = value;
      this.filterLabel.setFilterLabelContainerVisibility(!value);
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

    get appliedFilters() {
        return this._appliedFilters;
    }

    set appliedFilters(value) {
        this._appliedFilters = value;
    }

    get title() {
        return $(this._titleArea).text();
    }

    set title(text) {
        $(this._titleArea).text(text);
    }

    get legend(){
        return this._legend;
    }

    set isLoading(value) {
        if (value) {
            this.title = 'Loading...';
            if (this.filterController !== null) {
                this.filterController.isLoading = true;
            }
            this.legend.isLoading = true;
            this.filterLabel.setFilterLabelContainerVisibility(false);
        }

        this._isLoading = value;
    }

    set description(text) {
        $(this._descriptionArea).html(text);
    }

    get filterController() {
        return this._filterController;
    }

    prepareDomElements() {
        this._container = $(mapChipBlockClass)[0];
        this._closeButton = $(this.container).find('.filters__header_close')
        this._descriptionArea = $(this.container).find('.map-options__context--v2 .map-option__context_text div');
        this._titleArea = $(this.container).find('.filters__header_name div');
        this._filtersContainer = $(this.container).find(filterContentClass);
        this._legendContainer = $(this.container).find(legendContainerClass);
        this._filterHeaderTitleContainer = $(this.container).find(filterHeaderClass);
        this._filterHeaderToggleContainer = $(this.container).find(filterHeaderToggleClass);
    }

    updateDomElements() {
        this._filterHeaderTitleContainer.find(".filters__header_name").css("width", "auto");
        this._toggleIconDownContainer = this._filterHeaderToggleContainer.find(".toggle-icon-v--first");
        this._toggleIconUpContainer = this._filterHeaderToggleContainer.find(".toggle-icon-v--last");
        this.updateToggleIcon();
        // Tooltip
        this._tooltip.enableTooltip(this._toggleIconDownContainer, "Collapse Details");
        this._tooltip.enableTooltip(this._toggleIconUpContainer.parent(), "Expand Details");

        // Snackbar
        $("<div id='mapchip-snackbar'></div>").insertBefore(`${mapChipBlockClass} .map-point-legend`);
    }

    prepareUIEvents() {
        this._closeButton.on('click', () => this.removeMapChip());
    }


    updateToggleIcon() {
      this._toggleIconDownContainer.find("svg").remove();
      this._toggleIconDownContainer.append("<i class='fas fa-chevron-down'></i>");
      this._toggleIconUpContainer.find("svg").remove();
      this._toggleIconUpContainer.append("<i class='fas fa-chevron-up'></i>");
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
        $(this.container).find('.map-options__legend').removeClass('hidden');
    }

    removeMapChip() {
        this.hide();
        this.isContentVisible = false;
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
        this.appliedFilters = selectedFilter;
        this.filterLabel.setFilterLabelSelectedCount(selectedFilter);
    }

    onChoropleth(payload) {
        this._legend.show(payload.colors, payload.intervals);
    }

    onSubIndicatorChange(params) {
        if (params.childData === undefined) {
            return;
        }
        this._filterController = new FilterController(this, this._filtersContainer);
        const previouslySelectedFilters = params.filter;
        let dataFilterModel = new DataFilterModel(params.groups, params.chartConfiguration.filter, previouslySelectedFilters, params.primaryGroup, params.childData);

        this.setTitle(params.indicatorTitle, params.selectedSubindicator);

        // Filter Label
        const defaultFilters = dataFilterModel.configFilters?.defaults || [];
        this.filterLabel.compareFilters(defaultFilters, this.appliedFilters);
        this.filterLabel.setFilterLabelTotalCount(params.groups);
        this.filterLabel.setFilterLabelSelectedCount({});
        this.filterLabel.setFilterLabelContainerVisibility(!this.isContentVisible);

        // Description Icon
        this.description = params.description;
        this.descriptionIcon.setDescriptionInfoIconVisibility(this.description.length > 0);

        this.show();
        if (this._filterController.filterCallback === null) {
            this._filterController.filterCallback = this.applyFilter;
        }
        this._filterController.setDataFilterModel(dataFilterModel);
    }
}

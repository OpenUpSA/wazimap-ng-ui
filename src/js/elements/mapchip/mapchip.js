import {FilterController} from "../subindicator_filter/filter_controller";
import {Legend} from "./legend";
import {DataFilterModel} from "../../models/data_filter_model";
import {Component} from "../../utils";
import {Tooltip} from "../../ui_components/tooltip";
import {FilterLabel} from "./components/filter_label";
import {DescriptionInfoIcon} from "./components/description_info_icon";
import {LinearScrubberRenderer} from "./components/linear_scrubber/renderer";
import {SidePanels} from "../side_panels";

const filterContentClass = '.map-options__filters_content';
const mapChipBlockParentClass = '.map-bottom-items--v2';
const mapChipBlockClass = `${mapChipBlockParentClass} .map-options`;
const legendClass = ".map-options__legend";
const legendContainerClass = '.map-options__legend_wrap';
const filterHeaderClass = '.filter__header_sub-indicator';
const filterHeaderToggleClass = ".filters__header_toggle";

/**
 * Represent the map chip at the bottom of the map
 */
export class MapChip extends Component {
    constructor(parent, legendColors, siteWideFiltersEnabled, restrictValues, defaultFilters) {
        super(parent);
        this._tooltip = new Tooltip();
        this.prepareDomElements();
        this.updateDomElements();

        this._legend = new Legend(this, this._legendContainer, legendColors);
        this._isLoading = false;
        this._filterController = null;
        this._isContentVisible = false;
        this._appliedFilters = [];
        this._previouslyAppliedFilters = [];
        this.siteWideFiltersEnabled = siteWideFiltersEnabled;
        this.restrictValues = restrictValues;
        this.defaultFilters = defaultFilters;
        this.prepareUIEvents();
        this.choroplethMethods = {
            subindicator: 'subindicator',
            sibling: 'sibling',
            absolute: 'absolute_value'
        }

        // Load components
        this._filterLabel = new FilterLabel(this);
        this._descriptionIcon = new DescriptionInfoIcon(this);
        this._linearScrubber = new LinearScrubberRenderer(this, this._linearScrubberContainer);
    }

    get isContentVisible() {
        return this._isContentVisible;
    }

    get filterLabel() {
        return this._filterLabel;
    }

    get descriptionIcon() {
        return this._descriptionIcon;
    }

    get linearScrubber() {
        return this._linearScrubber;
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

    get appliedFilters() {
        return this._appliedFilters;
    }

    set appliedFilters(value) {
        this._appliedFilters = value;
    }

    get previouslyAppliedFilters() {
        return this._previouslyAppliedFilters;
    }

    set previouslyAppliedFilters(value) {
        this._previouslyAppliedFilters = value;
    }

    get title() {
        return $(this._titleArea).text();
    }

    set title(text) {
        $(this._titleArea).text(text);
    }

    get legend() {
        return this._legend;
    }

    get metadata() {
        return this._metadata;
    }

    set metadata(value) {
        this._metadata = value;
    }

    get config() {
        return this._config;
    }

    set config(value) {
        this._config = value;
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

        this.appendSubIndicatorDescriptionHtml();
    }

    appendSubIndicatorDescriptionHtml() {
        let descText = document.createElement('div');
        $(descText).addClass('choropleth-method-description');
        $(this.container).find(legendClass).append(descText);

        let qMark = document.createElement('div');
        $(qMark).addClass('choropleth-method-qMark');
        $(qMark).text('?');
        $(this.container).find(legendClass).append(qMark);
    }

    updateSubIndicatorDescriptionHtml(method) {
        if (method === this.choroplethMethods.subindicator) {
            $(this.container).find(legendClass).find('.choropleth-method-qMark').show();
            $(this.container).find(legendClass).find('.choropleth-method-description').show();
            $(this.container).find(legendClass).find('.choropleth-method-description').text('of all categories');
            this._tooltip.enableTooltip($(this.container).find(legendClass).find('.choropleth-method-qMark'),
                'The percentage shown is the value for the selected category in a given geographic area, as a percentage of the total for all categories in that area.');
        } else if (method === this.choroplethMethods.sibling) {
            $(this.container).find(legendClass).find('.choropleth-method-qMark').show();
            $(this.container).find(legendClass).find('.choropleth-method-description').show();
            $(this.container).find(legendClass).find('.choropleth-method-description').text('of total for shaded areas');
            this._tooltip.enableTooltip($(this.container).find(legendClass).find('.choropleth-method-qMark'),
                'The percentage shown is the value for each shaded geographic area as a percentage of the total for all shaded geographic areas');
        } else if (method === this.choroplethMethods.absolute) {
            $(this.container).find(legendClass).find('.choropleth-method-qMark').hide();
            $(this.container).find(legendClass).find('.choropleth-method-description').hide();
        }
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
        $("<div id='mapchip-snackbar'></div>").insertBefore(`${mapChipBlockParentClass} .map-point-legend`);

        // Linear Scrubber
        this._linearScrubberContainer = document.createElement('div');
        this._linearScrubberContainer.setAttribute("class", "map-options__linear_scrubber_wrap");
        $(this._linearScrubberContainer).insertBefore(`${mapChipBlockClass} ${legendClass}`);
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

    applyFilter = (filterResult, selectedFilter, selectedFilterDetails, updadateSharedUrl) => {
        if (filterResult !== null) {
            const payload = {
                data: filterResult,
                selectedFilter: selectedFilter,
                selectedFilterDetails: selectedFilterDetails,
                metadata: this.metadata,
                config: this.config,
                updadateSharedUrl: updadateSharedUrl
            }

            this.triggerEvent("mapchip.choropleth.filtered", payload)
        }
        this.appliedFilters = selectedFilterDetails;
        if (updadateSharedUrl){
          this.previouslyAppliedFilters = selectedFilterDetails;
        }
        this.filterLabel.setFilterLabelSelectedCount(selectedFilter);
    }

    changeSubindicator = (params) => {
        params.metadata = this.metadata;
        params.config = this.config
        this.setTitle(params.indicatorTitle, params.selectedSubindicator);
        this.triggerEvent("mapchip.choropleth.selectSubindicator", params);
    }

    onChoropleth(payload) {
        this._legend.show(payload.colors, payload.intervals);
    }

    onSubIndicatorChange(params) {
        if (params.childData === undefined) {
            return;
        }
        this.appliedFilters = [];

        this.metadata = params.metadata;
        this.config = params.config;
        const previouslySelectedFilters = params.filter;
        let chartDefaultFilters = this.config.chartConfiguration.filter;

        if (this.defaultFilters.length > 0) {
            // there are global default filters
            if (chartDefaultFilters?.defaults === undefined) {
                chartDefaultFilters = {
                    defaults: []
                }
            }

            this.defaultFilters.forEach(df => {
                chartDefaultFilters.defaults.push(df);
            })
        }

        let dataFilterModel = new DataFilterModel(this.metadata.groups,
            chartDefaultFilters,
            previouslySelectedFilters,
            this.metadata.primary_group,
            params.childData,
            params.siteWideFilters,
            DataFilterModel.FILTER_TYPE.indicators,
            this.restrictValues);

        this.setTitle(params.indicatorTitle, params.selectedSubindicator);

        // Filter Label
        this.setFilterLabel(dataFilterModel, this.metadata.groups);

        // Description Icon
        this.setDescriptionIcon(this.metadata.indicatorDescription);

        //update subIndicator description html
        this.updateSubIndicatorDescriptionHtml(params.method);

        // Linear Scrubber
        this.showLinearScrubber(params)

        this.show();

        // Filter controller
        this.setFilterController(dataFilterModel, this.siteWideFiltersEnabled);

        const previouslyAppliedFilters = structuredClone(this.previouslyAppliedFilters);
        const appliedFilters = structuredClone(this.appliedFilters);
        this.filterLabel.compareFilters(previouslyAppliedFilters, appliedFilters, dataFilterModel.siteWideFilters);
        this.previouslyAppliedFilters = appliedFilters;
    }

    setFilterLabel(dataFilterModel, groups) {
        this.filterLabel.setFilterLabelTotalCount(groups);
        this.filterLabel.setFilterLabelSelectedCount({});
        this.filterLabel.setFilterLabelContainerVisibility(!this.isContentVisible);
    }

    setDescriptionIcon(description) {
        this.description = description;
        this.descriptionIcon.setDescriptionInfoIconVisibility(this.description.length > 0);
    }

    showLinearScrubber(params) {
        this.linearScrubber.render(params);
    }

    setFilterController(dataFilterModel, addLockButton = true) {
        this._filterController = new FilterController(this, this._filtersContainer, {
            filterRowClass: '.map-options__filter-row',
            filterDropdown: '.mapping-options__filter',
            addButton: 'a.mapping-options__add-filter',
            filterPanel: SidePanels.PANELS.dataMapper,
            removeFilterButton: '.mapping-options__remove-filter',
            addLockButton: addLockButton,
            rowContainer : this.filterController?.rowContainer
        });

        this.show();
        if (this._filterController.filterCallback === null) {
            this._filterController.filterCallback = this.applyFilter;
        }
        this._filterController.setDataFilterModel(dataFilterModel);
    }
}

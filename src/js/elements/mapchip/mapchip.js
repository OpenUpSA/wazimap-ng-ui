import {FilterController} from "../subindicator_filter/filter_controller";
import {Legend} from "./legend";
import {DataFilterModel} from "../../models/data_filter_model";
import {Component} from "../../utils";

const filterContentClass = '.map-options__filters_content';
const mapChipBlockClass = '.map-bottom-items--v2 .map-options';
const legendContainerClass = '.map-options__legend_wrap';
const filterHeaderClass = '.filter__header_sub-indicator';
const filterHeaderToggleClass = ".filters__header_toggle"

/**
 * Represent the map chip at the bottom of the map
 */
export class MapChip extends Component {
    constructor(parent, legendColors) {
        super(parent);

        this.prepareDomElements();
        this.updateDomElements();


        this._legend = new Legend(this, this._legendContainer, legendColors);
        this._isLoading = false;
        this._filterController = null;
        this._isContentVisible = false;
        this._appliedFilters = {};
        this.prepareUIEvents();
    }

    get isContentVisible() {
      return this._isContentVisible;
    }

    set isContentVisible(value) {
      this._isContentVisible = value;
      this.setFilterLabelContainerVisibility(!value);
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
            this.setFilterLabelContainerVisibility(false);
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

    getFilterLabelHTML (){
      let html = "<div class='filters__header_label' title='Show Applied Filters'>";
      html += "<span id='selected_filter_count'>0</span>"
      html += " of "
      html += "<span id='total_filter_count'></span>"
      html += " filters applied"
      html += "</div>"

      return html;
    }

    updateDomElements() {
        const filterLabelHTML = this.getFilterLabelHTML();
        this._filterHeaderTitleContainer.find(".filters__header_name").css("width", "auto");
        this._filterHeaderTitleContainer.append(filterLabelHTML);
        this._filterHeaderLabelContainer = this._filterHeaderTitleContainer.find(".filters__header_label");
        this._selectedFilterCountContainer = this._filterHeaderLabelContainer.find("#selected_filter_count");
        this._totalFilterCountContainer = this._filterHeaderLabelContainer.find("#total_filter_count");
        this._toggleIconDownContainer = this._filterHeaderToggleContainer.find(".toggle-icon-v--first");
        this._toggleIconUpContainer = this._filterHeaderToggleContainer.find(".toggle-icon-v--last");

        // Update right side menu
        this.updateToggleIcon();
        this.addInfoIcon();

        this._descriptionInfoIconContainer = $(this._container).find(".filters__header_info");
        this._descriptionInfoIconContainer.tooltip({
          position: {
            my: "center bottom-20",
            at: "center top",
            using: function( position, feedback ) {
              $( this ).css( position );
              $( "<div>" )
                .addClass( "arrow" )
                .addClass( feedback.vertical )
                .addClass( feedback.horizontal )
                .appendTo( this );
            }
          }
        });
        this._filterHeaderLabelContainer.tooltip({
          position: {
            my: "center bottom-20",
            at: "center top",
            using: function( position, feedback ) {
              $( this ).css( position );
              $( "<div>" )
                .addClass( "arrow" )
                .addClass( feedback.vertical )
                .addClass( feedback.horizontal )
                .appendTo( this );
            }
          }
        });
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

    addInfoIcon() {
      let html = "<div class='filters__header_info' title='Show Description'>";
      html += "<i class='fa fa-info-circle'></i>";
      html += "</div>";

      this._filterHeaderToggleContainer.before(html)
    }

    setTitle(indicatorTitle, selectedSubindicator) {
        let label = `${indicatorTitle} (${selectedSubindicator})`;
        if (indicatorTitle === selectedSubindicator) {
            label = indicatorTitle;
        }

        this.title = label;
    }

    setFilterLabelTotalCount(groups) {
        const total_group_length = groups.length - 1;
        this._totalFilterCountContainer.html(total_group_length);
    }

    setFilterLabelSelectedCount(selectedFilter) {
        const selected_filter_length = Object.keys(selectedFilter).length;
        this._selectedFilterCountContainer.html(selected_filter_length);
    }

    setFilterLabelContainerVisibility(is_visible=!this.isContentVisible) {
      if (is_visible){
        $(this._filterHeaderLabelContainer).removeClass('hidden');
      } else {
        $(this._filterHeaderLabelContainer).addClass('hidden');
        $(this._filterHeaderLabelContainer).removeClass('notification-badges');
      }
    }

    setDescriptionInfoIconVisibility(is_visible) {
      if (is_visible){
        $(this._descriptionInfoIconContainer).removeClass('hidden');
      } else {
        $(this._descriptionInfoIconContainer).addClass('hidden');
      }
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
        this.setFilterLabelSelectedCount(selectedFilter);
    }

    onChoropleth(payload) {
        this._legend.show(payload.colors, payload.intervals);
    }

    isEqualsJson(obj1, obj2){
      let keys1 = Object.keys(obj1);
      let keys2 = Object.keys(obj2);
      return keys1.length === keys2.length && Object.keys(obj1).every(key=>obj1[key]==obj2[key]);
    }

    compareFilters(defaultFilters, oldFilters){
      let flattenFilterObject = {}
      defaultFilters.forEach((item, idx) => {
          flattenFilterObject[item.name] = item.value
      });

      const showBadge = this.isEqualsJson(flattenFilterObject, oldFilters);
      if (!showBadge){
        this._filterHeaderLabelContainer.addClass("notification-badges");
        if (defaultFilters.length === 0){
          this.appliedFilters = {};
        }
      }
    }

    onSubIndicatorChange(params) {
        if (params.childData === undefined) {
            return;
        }
        this._filterController = new FilterController(this, this._filtersContainer);
        const previouslySelectedFilters = params.filter;
        let dataFilterModel = new DataFilterModel(params.groups, params.chartConfiguration.filter, previouslySelectedFilters, params.primaryGroup, params.childData);

        const defaultFilters = dataFilterModel.configFilters?.defaults || [];
        this.compareFilters(defaultFilters, this.appliedFilters);
        this.setTitle(params.indicatorTitle, params.selectedSubindicator);
        this.setFilterLabelTotalCount(params.groups);
        this.setFilterLabelSelectedCount({});
        this.description = params.description;

        this.setFilterLabelContainerVisibility();
        this.setDescriptionInfoIconVisibility(this.description.length > 0);
        this.show();
        if (this._filterController.filterCallback === null) {
            this._filterController.filterCallback = this.applyFilter;
        }
        this._filterController.setDataFilterModel(dataFilterModel);
    }
}

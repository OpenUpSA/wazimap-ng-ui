import {format as d3format} from "d3-format";

import {Component} from "../utils";
import {defaultValues} from "../defaultValues";
import XLSX from 'xlsx';
import Papa from 'papaparse';

import embed from "vega-embed";
import * as vega from "vega";

import {configureBarchart, configureBarchartDownload} from './charts/barChart';
import {configureLinechart, configureLinechartDownload} from './charts/lineChart';
import {slugify} from './charts/utils';
import {FilterController} from "../elements/subindicator_filter/filter_controller";
import {DataFilterModel} from "../models/data_filter_model";
import {SidePanels} from "../elements/side_panels";
import {configureGroupedBarchart, configureGroupedBarchartDownload} from "./charts/groupedBarChart";
import {isEmpty} from "vega-lite";

const PERCENTAGE_TYPE = "percentage";
const VALUE_TYPE = "value";
const graphValueTypes = {
    'Percentage': PERCENTAGE_TYPE, 'Value': VALUE_TYPE
};
const chartTypes = {
    LineChart: 'line', BarChart: 'bar', GroupedBarChart: 'grouped'
}
const chartContainerClass = ".indicator__chart";
const tooltipClass = ".bar-chart__row_tooltip";
const filterRowClass = '.profile-indicator__filter-row';
const filterWrapperClass = '.profile-indicator__filters-wrapper';

const MAX_RICH_TABLE_ROWS = 7;


export class Chart extends Component {
    constructor(parent, config, data, groups, _subCategoryNode, title, chartAttribution, addLockButton = true, restrictValues = {}, defaultFilters = []) {
        //we need the subindicators and groups too even though we have detail parameter. they are used for the default chart data
        super(parent);

        this._isToggleDisabled = false;
        this.data = data;
        this.title = title;
        this._config = config;
        this.selectedFilter = null;
        this.selectedGroup = null;
        this.table = null;
        this.filter = null;
        this.groups = data.metadata.groups;
        this._isGrouped = false;

        this.profileAttribution = chartAttribution;
        this.subCategoryNode = _subCategoryNode;

        const chartContainer = $(chartContainerClass, this.subCategoryNode);
        this.container = chartContainer[0];

        this.containerParent = $(this.container).closest('.profile-indicator');

        this._filtersContainer = $(this.containerParent).find(filterWrapperClass);
        this._filterController = new FilterController(this, this._filtersContainer, {
            filterRowClass: filterRowClass,
            filterDropdown: '.profile-indicator__filter',
            addButton: 'a.profile-indicator__new-filter',
            filterPanel: SidePanels.PANELS.richData,
            removeFilterButton: '.profile-indicator__remove-filter',
            addLockButton: addLockButton
        });

        this.addChart(restrictValues, defaultFilters, true, false, null);
    }

    get hasGroupedBarChart() {
        return this.data.chartConfiguration.drilldown !== undefined && this.data.chartConfiguration.drilldown !== '' && this.data.chart_type !== 'line';
    }

    get isGrouped() {
        return this._isGrouped;
    }

    set isGrouped(value) {
        this._isGrouped = value;
    }

    get previouslySelectedFilters() {
        if (this.parent.previouslySelectedFilters === undefined) {
            return [];
        } else {
            return this.parent.previouslySelectedFilters;
        }
    }

    get siteWideFilters() {
        return this.parent.siteWideFilters;
    }

    get chartType() {
        const type = this.data.chart_type;
        if (type === chartTypes.LineChart) {
            return chartTypes.LineChart;
        } else {
            return chartTypes.BarChart;
        }
    }

    get isToggleDisabled() {
        return this._isToggleDisabled;
    }

    set isToggleDisabled(value) {
        if (value) {
            this.disableChartTypeToggle();
        }

        this._isToggleDisabled = value;
    }

    get config() {
        if (this.chartType === chartTypes.LineChart) {
            this._config.defaultType = 'Value';
        }

        return this._config;
    }

    get filterController() {
        return this._filterController;
    }

    addChart = (restrictValues, defaultFilters, setFilters, isGroupedBarChart = false, callback) => {
        $(".bar-chart", this.container).remove();
        $("svg", this.container).remove();

        let vegaSpec = this.configureChart(this.data.data, this.data.metadata, this.config, isGroupedBarChart);

        const calculatePosition = (item, event, tooltipBox,) => {
            let x, y, offsetX, offsetY;
            if (this.chartType === chartTypes.BarChart) {
                offsetX = 0;
                offsetY = 10;
                x = event.pageX + offsetX;
                y = event.pageY + offsetY;

                if (x + tooltipBox.width > window.innerWidth) {
                    x = +event.pageX - offsetX - tooltipBox.width;
                }

                if (y < window.innerHeight) {
                    y = window.innerHeight + offsetY;
                }
                if (y + tooltipBox.height > window.innerHeight) {
                    y = +event.pageY - offsetY - tooltipBox.height;
                }
            } else {
                const selector = 'g.mark-symbol.role-mark path[fill="white"]';
                offsetX = 5;
                offsetY = -5;
                x = $(selector).offset().left + offsetX;
                y = $(selector).offset().top - tooltipBox.height + offsetY;
            }

            return {x, y};
        }

        const handler = (_, event, item, value) => {
            const tooltipClassSubstr = tooltipClass.substring(1)
            this.el = $(tooltipClass) ? $(tooltipClass)[0] : null;
            if (!this.el) {
                this.el = document.createElement('div');
                this.el.classList.add(tooltipClassSubstr);
                document.body.appendChild(this.el);
            }
            const tooltipContainer = document.fullscreenElement != null ? document.fullscreenElement : document.body;
            tooltipContainer.appendChild(this.el);
            // hide tooltip for null, undefined, or empty string values
            if (value == null || value === '') {
                this.el.remove()
                return;
            }
            // set the tooltip content
            let tooltipPercentageType = ''
            if (this.config.defaultType.toLowerCase() == PERCENTAGE_TYPE || !this.isToggleDisabled) {
                tooltipPercentageType = `
          <div class="bar-chart__tooltip_value">
              <div>${value.percentage}</div>
          </div>`
            }
            this.el.innerHTML = `
        <div class="bar-chart__row_tooltip-card">
          <div class="bar-chart__tooltip_name">
              <div>${value.group}</div>
          </div>
          ${tooltipPercentageType}
          <div class="bar-chart__tooltip_alt-value">
              <div>${value.count}</div>
          </div>
          <div class="bar-chart__row_tooltip-notch"></div>
        </div>`

            // make the tooltip visible
            this.el.classList.add('visible', tooltipClassSubstr);
            const {x, y} = calculatePosition(item, event, this.el.getBoundingClientRect());
            this.el.setAttribute('style', `top: ${y}px; left: ${x}px; z-index: 999;`);
        }

        embed(this.container, vegaSpec, {renderer: 'svg', actions: false, tooltip: handler.bind(this)})
            .then(async (result) => {
                this.vegaView = result.view;
                this.vegaDownloadView = null;
                this.setChartMenu();
                this.showChartDataTable();
                this.setDownloadUrl();
                let $svg = $(this.container).find('svg')
                $svg.attr('preserveAspectRatio', 'xMinYMin meet')
                $svg.removeAttr('width')
                $svg.removeAttr('height');
                this.filterGroups = this.data.metadata.groups;
                this.isGrouped = isGroupedBarChart;

                if (setFilters) {
                    this.handleChartFilter(this.data, this.data.metadata.groups, restrictValues, defaultFilters);
                }

                if (callback !== null) {
                    callback();
                }
            });
    };

    configureChart = (data, metadata, config, isGroupedBarChart = false) => {
        if (isGroupedBarChart) {
            return configureGroupedBarchart(data, metadata, config);
        } else {
            if (this.chartType === chartTypes.LineChart) {
                return configureLinechart(data, metadata, config);
            } else {
                return configureBarchart(data, metadata, config);
            }
        }
    }

    configureChartDownload = (data, metadata, config, annotations) => {
        if (this.isGrouped) {
            return configureGroupedBarchartDownload(data, metadata, config, annotations);
        } else {
            if (this.chartType === chartTypes.LineChart) {
                return configureLinechartDownload(data, metadata, config, annotations);
            } else {
                return configureBarchartDownload(data, metadata, config, annotations);
            }
        }
    }

    showChartDataTable = () => {
        this.createDataTable();
        this.appendDataToTable();
    }

    createDataTable = () => {
        this.containerParent.find('.profile-indicator__table').remove();

        this.table = document.createElement('table');
        $(this.table).addClass('profile-indicator__table profile-indicator__table_content');
        let thead = document.createElement('thead');
        $(thead).addClass('profile-indicator__table_row--header');
        let headRow = document.createElement('tr');
        $(headRow).addClass('profile-indicator__table_row');
        let headCol1 = document.createElement('th');
        $(headCol1).addClass('profile-indicator__table_cell profile-indicator__table_cell--first');
        $(headCol1).text(this.title);
        $(headRow).append(headCol1);
        let headCol2 = document.createElement('th');
        $(headCol2).addClass('profile-indicator__table_cell');
        $(headCol2).text('Value');
        $(headRow).append(headCol2);
        if (this.config.defaultType.toLowerCase() == PERCENTAGE_TYPE || !this.isToggleDisabled) {
            let headCol3 = document.createElement('th');
            $(headCol3).addClass('profile-indicator__table_cell');
            $(headCol3).text('Percentage');
            $(headRow).append(headCol3);
        }
        $(thead).append(headRow);
        $(this.table).append(thead);

        this.containerParent.append(this.table);
    }

    appendDataToTable = () => {
        $(this.table).find('tbody').remove();

        let tbody = document.createElement('tbody');

        const dataArr = this.vegaView.data('data_formatted');
        const primaryGroup = this.vegaView.signal('mainGroup');
        const formatting = this.vegaView.signal('numberFormat');

        dataArr.forEach((d) => {
            let absoluteVal = d.count;
            let percentageVal = d.percentage;
            let row = document.createElement('tr');
            $(row).addClass('profile-indicator__table_row');
            let col1 = document.createElement('td');
            $(col1).addClass('profile-indicator__table_cell profile-indicator__table_cell--first');
            $(col1).text(d[primaryGroup]);
            $(row).append(col1);
            let col2 = document.createElement('td');
            $(col2).text(d3format(formatting[VALUE_TYPE])(absoluteVal));
            $(col2).addClass('profile-indicator__table_cell');
            $(row).append(col2);
            if (this.config.defaultType.toLowerCase() == PERCENTAGE_TYPE || !this.isToggleDisabled) {
                let col3 = document.createElement('td');
                $(col3).addClass('profile-indicator__table_cell');
                $(col3).text(d3format(formatting[PERCENTAGE_TYPE])(percentageVal));
                $(row).append(col3);
            }
            $(tbody).append(row);
        })

        $(this.table).append(tbody);

        let $showExtra = $('.profile-indicator__table_load-more', this.containerParent);
        if (dataArr.length > MAX_RICH_TABLE_ROWS && $showExtra.length < 1) {
            let showExtraRows = false;
            let btnDiv = document.createElement('div');
            $(btnDiv).addClass('profile-indicator__table_show-more profile-indicator__table_showing profile-indicator__table_load-more');
            let btn = document.createElement('button');
            $(btn).text('Load more rows');
            $(btn).on("click", () => {
                showExtraRows = !showExtraRows;
                showExtraRows ? $(btn).text('Show less rows') : $(btn).text('Load more rows');
                showExtraRows ? $(this.table).removeClass("profile-indicator__table_content") : $(this.table).addClass("profile-indicator__table_content");
            })
            btnDiv.append(btn);
            this.containerParent.append(btnDiv);
        }

        $('.profile-indicator__table_content').css('overflow', 'hidden');
    }

    setChartDomain(chart, config, chartType) {
        const chartConfig = config.types[chartType]
        if (chartConfig.minX != defaultValues.DEFAULT_CONFIG) chart.minX(chartConfig.minX)
        if (chartConfig.maxX != defaultValues.DEFAULT_CONFIG) chart.maxX(chartConfig.maxX)
    }

    setDownloadUrl = async () => {
        const containerParent = $(this.container).closest(".profile-indicator");

        let titleEle = $(".map-location__tags").find('.location-tag__name');
        let filters = "";
        if (this.selectedFilter) {
            for (const [group, attribute] of Object.entries(this.selectedFilter)) {
                filters += group.replace(/^\w/, g => g.toUpperCase()) + ": " + attribute + ", ";
            }
        }

        let annotations = {
            "title": this.title,
            "geography": `Selected area : ${titleEle.slice(-1).text().trim()}`,
            "filters": filters,
            "attribution": this.profileAttribution,
            "graphValueType": this.graphValueType
        }

        let specDownload = this.configureChartDownload(this.vegaView.data('table'), this.data.metadata, this.config, annotations);

        this.vegaDownloadView = new vega.View(vega.parse(specDownload));
        this.setGroupedBarChartHeight();

        const pngDownloadUrl = await this.vegaDownloadView.toImageURL('png', 1);
        const saveImgButton = $(containerParent).find(".hover-menu__content a.hover-menu__content_item:nth-child(1)");
        saveImgButton.attr('href', pngDownloadUrl);
        const chartTitle = this.title;
        saveImgButton.attr('download', `${chartTitle ? chartTitle : 'chart'}.png`);
    }

    disableChartTypeToggle = () => {
        $(this.containerParent).find('.hover-menu__content_item--no-link:first').hide();
        $(this.containerParent).find('.hover-menu__content_list').hide();
    }

    setChartMenu = (barChart) => {
        const self = this;
        const saveImgButton = $(this.containerParent).find('.hover-menu__content a.hover-menu__content_item:nth-child(1)');

        $(saveImgButton).off('click');
        $(saveImgButton).on('click', () => {
            this.triggerEvent('profile.chart.saveAsPng', this);
        })

        $(this.containerParent).find('.hover-menu__content_list a').each(function () {
            $(this).off('click');
            $(this).on('click', () => {
                let displayType = $(this).data('id');
                self.selectedGraphValueTypeChanged(self.containerParent, displayType);
                self.vegaView.signal("Units", graphValueTypes[displayType]).run();
                self.setDownloadUrl();
            })
        });

        self.selectedGraphValueTypeChanged(self.containerParent, this.config.defaultType);

        if (this.chartType === chartTypes.LineChart || this.config.disableToggle) {
            this.isToggleDisabled = true;
        }

        $(this.containerParent).find('.hover-menu__content_list--last a').each(function () {
            $(this).off('click');
            $(this).on('click', () => {
                let exportType = $(this).data('id');
                const downloadFn = {
                    'csv': self.exportAsCsv,
                    'excel': self.exportAsExcel,
                    'json': self.exportAsJson,
                    'kml': self.exportAsKml,
                };
                self.triggerEvent(`profile.chart.download_${exportType}`, self);

                let fileName = self.getChartTitle('-');
                downloadFn[exportType](fileName);
            })
        });
    };

    selectedGraphValueTypeChanged = (containerParent, selectedDisplayType) => {
        this.graphValueType = selectedDisplayType;
        this.triggerEvent("profile.chart.valueTypeChanged", this);
        $(containerParent)
            .find(".hover-menu__content_list a")
            .each(function () {
                let itemDisplayType = $(this).data('id');
                $(this).removeClass("active");

                if (itemDisplayType === selectedDisplayType) {
                    $(this).addClass("active");
                }
            });

    };

    getChartTitle = (separator) => {
        return this.selectedGroup === null ? `${this.title}` : `${this.title} by ${this.selectedGroup} ${separator} ${this.selectedFilter}`;
    }

    getPercentageValue = (currentValue, subindicators) => {
        let percentage = 0;
        let total = 0;

        for (const [label, value] of Object.entries(subindicators)) {
            total += value.count;
        }

        percentage = currentValue / total;

        return percentage;
    };

    handleChartFilter = (indicators, groups, restrictValues, defaultFilters) => {
        let chartDefaultFilters = this.data.chartConfiguration.filter;

        if (defaultFilters.length > 0) {
            // there are global default filters
            if (chartDefaultFilters?.defaults === undefined) {
                chartDefaultFilters = {
                    defaults: []
                }
            }

            defaultFilters.forEach(df => {
                chartDefaultFilters.defaults.push(df);
            })
        }
        let dataFilterModel = new DataFilterModel(groups, chartDefaultFilters, this.previouslySelectedFilters, indicators.metadata.primary_group, {}, this.siteWideFilters, DataFilterModel.FILTER_TYPE.indicators, restrictValues, this.config?.drilldown,);
        if (this._filterController.filterCallback === null) {
            this._filterController.filterCallback = this.applyFilter;
        }
        this._filterController.setDataFilterModel(dataFilterModel);
    };

    applyFilter = (filteredData, selectedFilter, selectedFilterDetails, updadateSharedUrl) => {
        if (this.hasGroupedBarChart && !this.isGrouped && Object.keys(selectedFilter).indexOf(this.data.chartConfiguration?.drilldown) >= 0) {
            this.addChart(null, null, false, true, () => this.applyFilter(filteredData, selectedFilter, selectedFilterDetails, updadateSharedUrl));
            return;
        } else if (this.isGrouped && Object.keys(selectedFilter).indexOf(this.data.chartConfiguration?.drilldown) < 0) {
            this.addChart(null, null, false, false, () => this.applyFilter(filteredData, selectedFilter, selectedFilterDetails, updadateSharedUrl));
            return;
        }
        this.filteredData = filteredData;
        this.filterGroups.forEach((group) => {
            let {name: filterName} = group;
            filterName = slugify(filterName)
            this.vegaView.signal(`${filterName}Filter`, false)
        });

        for (const [group, value] of Object.entries(selectedFilter)) {
            if (value !== "All values") {
                let filterName = group;
                filterName = slugify(filterName)
                this.vegaView.signal(`${filterName}Filter`, true)
                this.vegaView.signal(`${filterName}FilterValue`, value)
            }
        }
        this.selectedFilter = selectedFilter;

        this.vegaView.run();
        this.appendDataToTable();
        this.setDownloadUrl();

        this.setGroupedBarChartHeight();

        const payload = {
            indicatorId: this.data.id,
            selectedFilter: selectedFilterDetails,
            title: this.title,
            updadateSharedUrl: updadateSharedUrl,
        };
        this.triggerEvent('profile.chart.filtered', payload);
    };

    setGroupedBarChartHeight() {
        const isDrilldownSelected = this.selectedFilter != null
            && Object.keys(this.selectedFilter).indexOf(this.config.drilldown) >= 0;

        if (!this.isGrouped || !isDrilldownSelected) {
            return;
        }

        const groupCount = this.vegaView.data('data_grouped').length;
        const yCount = this.vegaView.data('data_formatted').length / groupCount;
        const labelOffset = (25 + yCount * 15) * -1;
        const yscale_step = yCount * 30 + 40;
        const height = this.vegaView.data('data_formatted').length * 30 + (40 * groupCount);

        this.vegaView.signal('yscale_step', yscale_step);
        this.vegaView.signal('height', height);
        this.vegaView.signal('label_offset', labelOffset);
        this.vegaView.run();

        this.vegaDownloadView.signal('yscale_step', yscale_step);
        this.vegaDownloadView.signal('height', height);
        this.vegaDownloadView.signal('label_offset', labelOffset);
        this.vegaDownloadView.run();
    }

    exportAsCsv = () => {
        const data = this.vegaView.data('table');

        const fileName = `${this.title}.csv`;

        let csvContent = "data:text/csv;charset=utf-8," + Papa.unparse(data);

        let encodedUri = encodeURI(csvContent);
        let link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", fileName);
        document.body.appendChild(link); // Required for FF

        link.click();
        document.body.removeChild(link);
    }

    exportAsExcel = () => {
        const table = this.vegaView.data('table');
        // export json (only array possible) to Worksheet of Excel
        const data = XLSX.utils.json_to_sheet(table);
        // A workbook is the name given to an Excel file
        const wb = XLSX.utils.book_new(); // make Workbook of Excel
        // add Worksheet to Workbook
        XLSX.utils.book_append_sheet(wb, data, this.title);
        // export Excel file
        XLSX.writeFile(wb, this.title + '.xlsx');
    }

    exportAsJson = () => {
        const data = this.vegaView.data('table');

        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", this.title + ".json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }
}

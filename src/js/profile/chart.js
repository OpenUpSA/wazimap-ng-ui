import {format as d3format} from "d3-format/src/defaultLocale";
import {select as d3select} from "d3-selection";

import {appendFilterArrays, Component} from "../utils";
import {defaultValues} from "../defaultValues";

import {SubindicatorFilter} from "./subindicator_filter";
import XLSX from 'xlsx';
import Papa from 'papaparse';

import embed from "vega-embed";

import {configureBarchart} from './charts/barChart';
import {slugify} from './charts/utils';
import DropdownMenu from "../elements/dropdown_menu";

const PERCENTAGE_TYPE = "percentage";
const VALUE_TYPE = "value";
const graphValueTypes = {
    'Percentage': PERCENTAGE_TYPE,
    'Value': VALUE_TYPE
};
const chartContainerClass = ".indicator__chart";
const tooltipClass = ".bar-chart__row_tooltip";
const filterRowClass = '.profile-indicator__filter-row';
const filterWrapperClass = '.profile-indicator__filters-wrapper';

const MAX_RICH_TABLE_ROWS = 7;


export class Chart extends Component {
    constructor(
        parent,
        config,
        data,
        groups,
        _subCategoryNode,
        title
    ) {
        //we need the subindicators and groups too even though we have detail parameter. they are used for the default chart data
        super(parent);

        this.data = data;
        this.title = title;
        this.config = config;
        this.selectedFilter = null;
        this.selectedGroup = null;
        this.table = null;
        this.filter = null;
        this.groups = data.metadata.groups;

        this.subCategoryNode = _subCategoryNode;

        const chartContainer = $(chartContainerClass, this.subCategoryNode);
        this.container = chartContainer[0];
        this.containerParent = $(this.container).closest('.profile-indicator');

        this.addChart(data);
    }

    addChart = (data) => {
        $(".bar-chart", this.container).remove();
        $("svg", this.container).remove();

        let vegaSpec = configureBarchart(data.data, data.metadata, this.config);

        const calculatePosition = (event, tooltipBox, offsetX, offsetY) => {
            let x = event.pageX + offsetX;
            if (x + tooltipBox.width > window.innerWidth) {
                x = +event.pageX - offsetX - tooltipBox.width;
            }
            let y = event.pageY + offsetY;
            if (y < window.innerHeight) {
              y = window.innerHeight + offsetY;
            }
            if (y + tooltipBox.height > window.innerHeight) {
                y = +event.pageY - offsetY - tooltipBox.height;
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
            if (this.config.defaultType.toLowerCase() == PERCENTAGE_TYPE || !this.config.disableToggle) {
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
            const {x, y} = calculatePosition(
                event,
                this.el.getBoundingClientRect(),
                0, 10
            );
            this.el.setAttribute('style', `top: ${y}px; left: ${x}px; z-index: 999;`);
        }

        embed(this.container, vegaSpec, {renderer: 'svg', actions: false, tooltip: handler.bind(this)})

            .then(async (result) => {
                this.vegaView = result.view;
                this.setChartMenu();
                this.showChartDataTable();
                this.setDownloadUrl();
                let $svg = $(this.container).find('svg')
                $svg.attr('preserveAspectRatio', 'xMinYMin meet')
                $svg.removeAttr('width')
                $svg.removeAttr('height')

                this.handleChartFilter(data, data.metadata.groups);
            })
            .catch(console.error);
    };

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
        if (this.config.defaultType.toLowerCase() == PERCENTAGE_TYPE || !this.config.disableToggle) {
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
            if (this.config.defaultType.toLowerCase() == PERCENTAGE_TYPE || !this.config.disableToggle) {
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
    }

    setChartDomain(chart, config, chartType) {
        const chartConfig = config.types[chartType]
        if (chartConfig.minX != defaultValues.DEFAULT_CONFIG)
            chart.minX(chartConfig.minX)
        if (chartConfig.maxX != defaultValues.DEFAULT_CONFIG)
            chart.maxX(chartConfig.maxX)
    }

    setDownloadUrl = async () => {
        const containerParent = $(this.container).closest(".profile-indicator");
        const pngDownloadUrl = await this.vegaView.toImageURL('png', 1);
        const saveImgButton = $(containerParent).find(
            ".hover-menu__content a.hover-menu__content_item:nth-child(1)"
        );
        saveImgButton.attr('href', pngDownloadUrl);
        saveImgButton.attr('download', 'chart.png');
    }

    disableChartTypeToggle = (disable) => {
        if (disable) {
            $(this.containerParent).find('.hover-menu__content_item--no-link:first').hide()
            $(this.containerParent).find('.hover-menu__content_list').hide()
        }
    }

    setChartMenu = (barChart) => {
        const self = this;
        const saveImgButton = $(this.containerParent).find('.hover-menu__content a.hover-menu__content_item:nth-child(1)');

        $(saveImgButton).off('click');
        $(saveImgButton).on('click', () => {
            let chartTitle = self.getChartTitle(':');
            let fileName = 'chart.png';
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
        this.disableChartTypeToggle(this.config.disableToggle);


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

    handleChartFilter = (indicators, groups) => {
        const filterArea = $(this.subCategoryNode).find(".profile-indicator__filters");

        let filtersToAdd = [];
        let defaultFilters = this.getDefaultFilters();
        let nonAggFilters = this.getNonAggFilters();
        filtersToAdd = appendFilterArrays(defaultFilters, nonAggFilters, indicators.metadata.primary_group);

        for (let i = 1; i < filtersToAdd.length; i++) {
            this.addFilter(filtersToAdd[i].default);
        }
        let dropdowns = $(this.subCategoryNode).find(`${filterRowClass} .profile-indicator__filter`);

        this.filterGroups = groups.filter((g) => {
            return g.name !== indicators.metadata.primary_group
        })
        let siFilter = new SubindicatorFilter(this, filterArea, this.filterGroups, this.title, this.applyFilter, dropdowns, filtersToAdd, indicators.child_data, '.profile-indicator__filter-row');
        this.filter = siFilter;

        this.setAddFilterButton();

        this.bubbleEvent(siFilter, "point_tray.subindicator_filter.filter");
    };

    getDefaultFilters = () => {
        let defaultFilters = [];

        if (typeof this.data.chartConfiguration.filter !== 'undefined') {
            this.data.chartConfiguration.filter['defaults'].forEach((f) => {
                let defaultFilter = {
                    group: f.name,
                    value: f.value,
                    default: true
                }

                let item = defaultFilters.filter((df) => {
                    return df.group === f.name
                })[0];
                if (item !== null && typeof item !== 'undefined') {
                    item.default = true;
                } else {
                    defaultFilters.push(defaultFilter);
                }
            })
        }

        return defaultFilters;
    }

    getNonAggFilters = () => {
        let filterArr = [];

        let nonAgg = [...this.data.metadata.groups].filter((g) => {
            return !g.can_aggregate;
        })
        nonAgg.forEach((n) => {
            let filter = {
                group: n.name,
                value: n.subindicators[Math.floor(Math.random() * n.subindicators.length)],
                default: true
            }

            let item = filterArr.filter((df) => {
                return df.group === n.name
            })[0];
            if (item !== null && typeof item !== 'undefined') {
                item.default = true;
            } else {
                filterArr.push(filter);
            }
        })

        return filterArr;
    }

    setAddFilterButton = () => {
        let rowCount = $(this.subCategoryNode).find(filterRowClass).length;
        let btn = 'a.profile-indicator__new-filter';
        $(this.subCategoryNode).find(filterRowClass).each(function (index) {
            if (index !== rowCount - 1) {
                $(this).find(btn).addClass('is--hidden');
            } else {
                $(this).find(btn).removeClass('is--hidden');
            }
        });

        if (this.filter.allDropdowns.length >= this.filterGroups.length * 2) {
            $(this.subCategoryNode).find(btn).addClass('disabled');
        } else {
            $(this.subCategoryNode).find(btn).removeClass('disabled');
            $(this.subCategoryNode).find(btn).off('click').on('click', () => this.addFilter());
        }
    }

    addFilter = (isDefault = false) => {
        let filterRow = $(this.subCategoryNode).find(filterRowClass)[0].cloneNode(true);

        let indicatorDd = $(filterRow).find('.profile-indicator__filter')[0];
        let subindicatorDd = $(filterRow).find('.profile-indicator__filter')[1];

        $(filterRow).attr('data-isextra', true);
        $(filterRow).attr('data-isdefault', isDefault);
        if (!isDefault) {
            this.setRemoveFilter(filterRow, indicatorDd, subindicatorDd);
        }
        new DropdownMenu($(filterRow), '.profile-indicator__filter_menu');
        //$(this.subCategoryNode).find(filterWrapperClass).append(filterRow);
        $(filterRow).insertBefore($(this.subCategoryNode).find('a.profile-indicator__new-filter'));
        if (this.filter !== null) {
            this.filter.allDropdowns.push(indicatorDd);
            this.filter.allDropdowns.push(subindicatorDd);
            this.filter.setDropdownEvents(indicatorDd, subindicatorDd);

            this.setAddFilterButton();
        }
    }

    setRemoveFilter = (filterRow, indicatorDd, subindicatorDd) => {
        let btn = $(filterRow).find('.profile-indicator__remove-filter');
        btn.removeClass('is--hidden');
        btn.on('click', () => {
            this.removeFilter(filterRow, indicatorDd, subindicatorDd);
        })
    }

    removeFilter = (filterRow, indicatorDd, subindicatorDd) => {
        $(filterRow).remove();
        this.filter.allDropdowns = this.filter.allDropdowns.filter((dd, el) => {
            return el !== indicatorDd && el !== subindicatorDd
        })

        this.filter.handleFilter(null);

        this.setAddFilterButton();
    }

    applyFilter = (filteredData, selectedFilter) => {
        this.filteredData = filteredData;
        this.filterGroups.forEach((group) => {
            let {name: filterName} = group;
            filterName = slugify(filterName)
            this.vegaView.signal(`${filterName}Filter`, false)
        });

        if (selectedFilter.length > 0) {
            selectedFilter.forEach((sf) => {
                if (sf.value !== "All values") {
                    let filterName = sf.group;
                    filterName = slugify(filterName)
                    this.setDownloadUrl();
                    this.vegaView.signal(`${filterName}Filter`, true)
                    this.vegaView.signal(`${filterName}FilterValue`, sf.value)
                }
            });
        }
        this.vegaView.run();
        this.appendDataToTable();
    };

    exportAsCsv = () => {
        const data = this.vegaView.data('table');

        const fileName = `${this.title}.csv`;

        let csvContent = "data:text/csv;charset=utf-8,"
            + Papa.unparse(data);

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

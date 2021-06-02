import { format as d3format } from "d3-format/src/defaultLocale";
import { select as d3select } from "d3-selection";

import { Observable } from "../utils";
import { defaultValues } from "../defaultValues";

import { SubindicatorFilter } from "./subindicator_filter";
import XLSX from 'xlsx';
import Papa from 'papaparse';

import embed from "vega-embed";

import { configureBarchart } from './charts/barChart';
import { slugify } from './charts/utils';

const PERCENTAGE_TYPE = "percentage";
const VALUE_TYPE = "value";
const graphValueTypes = {
  'Percentage': PERCENTAGE_TYPE,
  'Value': VALUE_TYPE
};
const chartContainerClass = ".indicator__chart";
const tooltipClass = ".bar-chart__row_tooltip";

let tooltipClone = null;

const MAX_RICH_TABLE_ROWS = 7

export class Chart extends Observable {
  constructor(
    config,
    data,
    groups,
    _subCategoryNode,
    title
  ) {
    //we need the subindicators and groups too even though we have detail parameter. they are used for the default chart data
    super();

    this.data = data;
    this.title = title;
    this.config = config;
    this.selectedFilter = null;
    this.selectedGroup = null;
    this.table = null;

    tooltipClone = $(tooltipClass)[0].cloneNode(true);
    this.subCategoryNode = _subCategoryNode;

    const chartContainer = $(chartContainerClass, this.subCategoryNode);
    this.container = chartContainer[0];
    this.containerParent = $(this.container).closest('.profile-indicator');

    this.handleChartFilter(data, data.metadata.groups, title);
    this.addChart(data);
  }

  addChart = (data) => {
    $(".bar-chart", this.container).remove();
    $("svg", this.container).remove();
    
    let vegaSpec = configureBarchart(data.data, data.metadata, this.config);

    const calculatePosition = (event, tooltipBox, offsetX, offsetY) => {
      let x = event.pageX + offsetX;
      if (x + tooltipBox.width > window.innerWidth) {
        x =+ event.pageX - offsetX - tooltipBox.width;
      }
      let y = event.pageY + offsetY;
      if (y + tooltipBox.height > window.innerHeight) {
        y =+ event.pageY - offsetY - tooltipBox.height;
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
      this.el.innerHTML = `
        <div class="bar-chart__row_tooltip-card">
          <div class="bar-chart__tooltip_name">
              <div>${value.group}</div>
          </div>
          <div class="bar-chart__tooltip_value">
              <div>${value.percentage}</div>
          </div>
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
        10, 10
      );
      this.el.setAttribute('style', `top: ${y}px; left: ${x}px; z-index: 999;`);
    }

    embed(this.container, vegaSpec, { renderer: 'svg', actions: false, tooltip: handler.bind(this)})

      .then(async (result) => {
        this.vegaView = result.view;
        this.setChartMenu();
        this.showChartDataTable();
        let $svg = $(this.container).find('svg')
        $svg.attr('preserveAspectRatio', 'xMinYMin meet')
        $svg.removeAttr('width')
        $svg.removeAttr('height')
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
    $(headCol2).text('Absolute');
    $(headRow).append(headCol2);
    let headCol3 = document.createElement('th');
    $(headCol3).addClass('profile-indicator__table_cell');
    $(headCol3).text('Percentage');
    $(headRow).append(headCol3);

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
      let col2 = document.createElement('td');
      $(col2).text(d3format(formatting[VALUE_TYPE])(absoluteVal));
      $(col2).addClass('profile-indicator__table_cell');
      let col3 = document.createElement('td');
      $(col3).addClass('profile-indicator__table_cell');
      $(col3).text(d3format(formatting[PERCENTAGE_TYPE])(percentageVal));
      $(row).append(col1);
      $(row).append(col2);
      $(row).append(col3);
      $(tbody).append(row);
    })

    $(this.table).append(tbody);

    if (dataArr.length > MAX_RICH_TABLE_ROWS) {
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

    this.disableChartTypeToggle(this.config.disableToggle);


    $(this.containerParent).find('.hover-menu__content_list--last a').each(function () {
      $(this).off('click');
      $(this).on('click', () => {
        let exportType = $(this).data('id');
        const downloadFn = {
          0: {type: 'csv', fn: self.exportAsCsv},
          1: {type: 'excel', fn: self.exportAsExcel},
          2: {type: 'json', fn: self.exportAsJson},
          3: {type: 'kml', fn: self.exportAsKml},
        }[index];
        self.triggerEvent(`profile.chart.download_${downloadFn['type']}`, self);

        let fileName = self.getChartTitle('-');
        downloadFn.fn(fileName);
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

  handleChartFilter = (indicators, groups, title) => {
    let dropdowns = $(this.subCategoryNode).find(".filter__dropdown_wrap");
    const filterArea = $(this.subCategoryNode).find(
      ".profile-indicator__filters"
    );

    let g = groups.filter((g) => { return g.name !== indicators.metadata.primary_group })
    let siFilter = new SubindicatorFilter(filterArea, g, title, this.applyFilter, dropdowns, undefined, indicators.child_data);
    this.bubbleEvent(siFilter, "point_tray.subindicator_filter.filter");
  };

  applyFilter = (filteredData, selectedGroup, selectedFilter) => {
    this.filteredData = filteredData;
    this.selectedFilter = selectedFilter;
    this.selectedGroup = selectedGroup;
    let { name:filterName } = selectedGroup;
    filterName = slugify(filterName)
    if(selectedFilter !== "All values") {
      this.setDownloadUrl();
      this.vegaView.signal(`${filterName}Filter`, true)
      this.vegaView.signal(`${filterName}FilterValue`, selectedFilter).run()
      this.appendDataToTable();
    }
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

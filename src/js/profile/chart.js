import { format as d3format } from "d3-format/src/defaultLocale";
import { select as d3select } from "d3-selection";

import { Observable } from "../utils";
import { defaultValues } from "../defaultValues";

import { horizontalBarChart } from "../reusable-charts/horizontal-bar-chart";
import { SubindicatorFilter } from "./subindicator_filter";
import XLSX from 'xlsx';
import Papa from 'papaparse';

import embed from "vega-embed";

const PERCENTAGE_TYPE = "percentage";
const VALUE_TYPE = "value";
const graphValueTypes = {
  'Percentage': PERCENTAGE_TYPE,
  'Value': VALUE_TYPE
};
const chartContainerClass = ".indicator__chart";
const tooltipClass = ".bar-chart__row_tooltip";

let tooltipClone = null;

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

    const chartConfig = this.config.types["Value"];
    const percentageChartConfig = this.config.types["Percentage"];

    const barChart = {
      $schema: "https://vega.github.io/schema/vega/v5.json",
      description: "A",
      width: 800,
      padding: {"left": 5, "top": 5, "right": 30, "bottom": 5},
      data: [
        {
          name: "table",
          values: data.data,
          transform: [
            {
              type: "filter",
              expr: "applyFilter ? datum[filterIndicator] === filterValue : datum"
            }
          ]
        },
        {
          name: "data_formatted",
          source: "table",
          transform: [
            {
              type: "aggregate",
              ops: ["sum"],
              as: ["count"],
              fields: ["count"],
              groupby: { signal: "groups" }
            },
            {
              type: "joinaggregate",
              as: ["TotalCount"],
              ops: ["sum"],
              fields: ["count"]
            },
            {
              type: "formula",
              expr: "datum.count/datum.TotalCount",
              as: "percentage"
            }
          ]
        }
      ],
      signals: [
        {
          name: "groups",
          value: [data.metadata.primary_group],
        },
        {
          name: "barvalue",
          value: "datum",
        },
        {
          name: "Units",
          value: graphValueTypes[this.config.defaultType]
        },
        {
          name: "applyFilter",
          value: false,
        },
        {
          name: "filterIndicator",
        },
        {
          name: "filterValue",
        },
        {
          name: "mainGroup",
          value: data.metadata.primary_group,
        },
        {
          name: "numberFormat",
          value: { percentage: percentageChartConfig.formatting, value: chartConfig.formatting },
        },
        {
          name: "datatype",
          value: { percentage: "percentage", value: "count" },
        },
        {
          name: "y_step",
          value: 30
        },
        {
          name: "height",
          update: "bandspace(domain('yscale').length, 0.1, 0.05) * y_step"
        }
      ],
      scales: [
        {
          name: "yscale",
          type: "band",
          domain: { data: "data_formatted", field: {signal: "mainGroup"} },
          range: {step: {signal: "y_step"}},
          padding: 0.1,
        },
        {
          name: "xscale",
          type: "linear",
          domain: { data: "data_formatted", field: { signal: "datatype[Units]" } },
          range: "width",
          nice: true,
        },
      ],

      axes: [
        {
          orient: "left",
          scale: "yscale",
          domainOpacity: 0.5,
          labelOpacity: 0.5,
          tickSize: 0,
          labelPadding: 6,
          zindex: 1,
        },
        {
          orient: "bottom",
          scale: "xscale",
          bandPosition: 0,
          domainOpacity: 0.5,
          tickSize: 0,
          format: { signal: "numberFormat[Units]" },
          grid: true,
          gridOpacity: 0.5,
          labelOpacity: 0.5,
          labelPadding: 6,
        },
      ],

      marks: [
        {
          name: "bars",
          from: { data: "data_formatted" },
          type: "rect",
          encode: {
            enter: {
              y: { scale: "yscale", field: {signal: "mainGroup"} },
              height: { scale: "yscale", band: 1 },
              x: { scale: "xscale", field: { signal: "datatype[Units]" } },
              x2: { scale: "xscale", value: 0 },
            },
            update: {
              fill: { value: "rgb(57, 173, 132)" },
              x: { scale: "xscale", field: { signal: "datatype[Units]" } },
              x2: { scale: "xscale", value: 0 },
            },
            hover: {
              fill: { value: "rgb(57, 173, 132, 0.7)" },
            },
          },
        },
        {
          type: "text",
          from: { data: "data_formatted" },
          encode: {
            enter: {
              align: { value: "left" },
              baseline: { value: "middle" },
              fill: { value: "grey" },
              fontSize: { value: 10 },
            },
            update: {
              text: {
                signal: "format(datum[datatype[Units]],numberFormat[Units])"
              },
              x: {
                scale: "xscale",
                field: { signal: "datatype[Units]" },
                offset: 5,
              },
              y: {
                scale: "yscale",
                field: { signal: "mainGroup" },
                band: 0.5,
              },
            },
          },
        },
      ],
    };

    embed(this.container, barChart, { actions: false})
      .then(async (result) => {
        this.vegaView = result.view;
        this.setChartMenu();
        this.showChartDataTable();
      })
      .catch(console.error);
  };

  showChartDataTable = () => {
    this.containerParent.find('.chart-table').remove();

    let table = document.createElement('table');
    $(table).addClass('chart-table');
    let thead = document.createElement('thead');
    let headRow = document.createElement('tr');
    let headCol1 = document.createElement('th');
    $(headCol1).text(this.title);
    $(headRow).append(headCol1);
    let headCol2 = document.createElement('th');
    $(headCol2).text('Absolute');
    $(headRow).append(headCol2);
    let headCol3 = document.createElement('th');
    $(headCol3).text('Percentage');
    $(headRow).append(headCol3);

    $(thead).append(headRow);
    $(table).append(thead);

    const dataArr = this.vegaView.data('data_formatted');
    const primaryGroup = this.vegaView.signal('mainGroup');
    const formatting = this.vegaView.signal('numberFormat');

    dataArr.forEach((d) => {
      let absoluteVal = d.count;
      let percentageVal = d.percentage;
      let row = document.createElement('tr');
      let col1 = document.createElement('td');
      $(col1).text(d[primaryGroup]);
      let col2 = document.createElement('td');
      $(col2).text(d3format(formatting[VALUE_TYPE])(absoluteVal));
      let col3 = document.createElement('td');
      $(col3).text(d3format(formatting[PERCENTAGE_TYPE])(percentageVal));
      $(row).append(col1);
      $(row).append(col2);
      $(row).append(col3);
      $(table).append(row);
    })

    this.containerParent.append(table);
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
      barChart.saveAsPng(this.container, fileName, chartTitle);
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
          'csv': self.exportAsCsv,
          'excel': self.exportAsExcel,
          'json': self.exportAsJson
        }[exportType];
        self.triggerEvent(`profile.chart.download_${downloadFn['type']}`, self);

        let fileName = self.getChartTitle('-');
        downloadFn(fileName);
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

    let siFilter = new SubindicatorFilter(filterArea, groups, title, this.applyFilter, dropdowns);
    this.bubbleEvent(siFilter, "point_tray.subindicator_filter.filter");
  };

  applyFilter = (filteredData, selectedGroup, selectedFilter) => {
    this.filteredData = filteredData;
    this.selectedFilter = selectedFilter;
    this.selectedGroup = selectedGroup;
      this.setDownloadUrl(); //ToDo: use vega for getting data?
      this.vegaView.signal('filterIndicator', selectedGroup)
      this.vegaView.signal('filterValue', selectedFilter)
      if(selectedGroup && selectedFilter !== "All values") {
        this.vegaView.signal('applyFilter', true).run()
      } else {
        this.vegaView.signal('applyFilter', false).run()
      }
  };

  getExportData = (isArray = false) => {
    const data = this.vegaView.data('data_formatted');
    const primaryGroup = this.vegaView.signal('mainGroup');
    const formatting = this.vegaView.signal('numberFormat');
    const datatypes  = this.vegaView.signal('datatype');
    let rows = [];

    if (isArray){
        rows.push([primaryGroup, datatypes[VALUE_TYPE], datatypes[PERCENTAGE_TYPE]]);
    }

    data.forEach(function (rowArray) {
      let row = isArray ? [] : {};
      if (isArray){
          row.push(rowArray[primaryGroup]);
          row.push(d3format(formatting[VALUE_TYPE])(rowArray[datatypes[VALUE_TYPE]]));
          row.push(d3format(formatting[PERCENTAGE_TYPE])(rowArray[datatypes[PERCENTAGE_TYPE]]));
      }
      else{
          row[primaryGroup] = rowArray[primaryGroup];
          row[datatypes[VALUE_TYPE]] = d3format(formatting[VALUE_TYPE])(rowArray[datatypes[VALUE_TYPE]]);
          row[datatypes[PERCENTAGE_TYPE]] = d3format(formatting[PERCENTAGE_TYPE])(rowArray[datatypes[PERCENTAGE_TYPE]]);
      }
      rows.push(row);
    });

    return rows;
  }

  exportAsCsv = () => {
    const exportData = this.getExportData(true);

    const fileName = `${this.title}.csv`;

    let csvContent = "data:text/csv;charset=utf-8,"
        + Papa.unparse(exportData);

    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName);
    document.body.appendChild(link); // Required for FF

    link.click();
    document.body.removeChild(link);
  }

  exportAsExcel = () => {
    const exportData = this.getExportData();
    // export json (only array possible) to Worksheet of Excel
    const data = XLSX.utils.json_to_sheet(exportData);
    // A workbook is the name given to an Excel file
    const wb = XLSX.utils.book_new(); // make Workbook of Excel
    // add Worksheet to Workbook
    XLSX.utils.book_append_sheet(wb, data, 'Chart data');
    // export Excel file
    XLSX.writeFile(wb, this.title + '.xlsx');
  }

  exportAsJson = () => {
      const exportData = this.getExportData();

      var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData));
      var downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", this.title + ".json");
      document.body.appendChild(downloadAnchorNode); // required for firefox
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
  }
}

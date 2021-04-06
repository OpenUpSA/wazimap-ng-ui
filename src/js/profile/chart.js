import { format as d3format } from "d3-format/src/defaultLocale";
import { select as d3select } from "d3-selection";

import { Observable } from "../utils";
import { defaultValues } from "../defaultValues";

import { horizontalBarChart } from "../reusable-charts/horizontal-bar-chart";
import { SubindicatorFilter } from "./subindicator_filter";

import embed from "vega-embed";

const PERCENTAGE_TYPE = "percentage";
const VALUE_TYPE = "value";
const graphValueTypes = [PERCENTAGE_TYPE, VALUE_TYPE];
const chartContainerClass = ".indicator__chart";
const tooltipClass = ".bar-chart__row_tooltip";

let tooltipClone = null;
const typeIndex = {
  'Percentage': 0,
  'Value': 1
}


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

    //this.handleChartFilter(indicators, groups, title);
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
      width: 400,
      height: 400,
      autosize: {
            "type": "fit-x",
          
    },
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
            },
            {
              type: "formula",
              as: "current",
              expr: "datum[datatype[Units]]"
            },
            {
              type: "formula",
              as: "current_text",
              expr: "format(datum[datatype[Units]],numberFormat[Units])"
            },
            {
              "type": "formula", // added to format the text to the correct position
              "as": "main_group",
              "expr": "datum[mainGroup]"
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
          value: graphValueTypes[typeIndex[this.config.defaultType]]
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
      ],

      scales: [
        {
          name: "yscale",
          type: "band",
          domain: { data: "data_formatted", field: {signal: "mainGroup"} },
          range: "height",
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
          from: { data: "bars" },
          encode: {
            enter: {
              align: { value: "left" },
              baseline: { value: "middle" },
              fill: { value: "grey" },
              fontSize: { value: 10 }
            },
            update: {
              text: {
                field: "datum.current_text",
              },
              x: {
                scale: "xscale",
                field: "datum.current",
                offset: 10,
              },
              y: {
                scale: "yscale",
                field: "datum.main_group",
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

    /*
    for (const [label, subindicator] of Object.entries(this.subindicators)) {
      let absolute_val = subindicator.count;
      let percentage_val = this.getPercentageValue(absolute_val, this.subindicators);
      let row = document.createElement('tr');
      let col1 = document.createElement('td');
      $(col1).text(subindicator.keys);
      let col2 = document.createElement('td');
      $(col2).text(d3format(this.config.types[VALUE_TYPE].formatting)(absolute_val));
      let col3 = document.createElement('td');
      $(col3).text(d3format(this.config.types[PERCENTAGE_TYPE].formatting)(percentage_val));
      $(row).append(col1);
      $(row).append(col2);
      $(row).append(col3);
      $(table).append(row);
    }
    */

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

    //todo:don't use index, specific class names should be used here when the classes are ready
    $(this.containerParent).find('.hover-menu__content_list a').each(function (index) {
      $(this).off('click');
      $(this).on('click', () => {
        self.selectedGraphValueTypeChanged(self.containerParent, index);
        self.vegaView.signal("Units", graphValueTypes[index]).run()
        self.setDownloadUrl();
      })
    });

    this.disableChartTypeToggle(this.config.disableToggle);


    $(this.containerParent).find('.hover-menu__content_list--last a').each(function (index) {
      $(this).off('click');
      $(this).on('click', () => {
        const downloadFn = {
          0: {type: 'csv', fn: barChart.exportAsCsv},
          1: {type: 'excel', fn: barChart.exportAsExcel},
          2: {type: 'json', fn: barChart.exportAsJson},
          3: {type: 'kml', fn: barChart.exportAsKml},
        }[index];
        self.triggerEvent(`profile.chart.download_${downloadFn['type']}`, self);

        let fileName = self.getChartTitle('-');
        downloadFn.fn(fileName);
      })
    });
  };

  selectedGraphValueTypeChanged = (containerParent, index) => {
    this.graphValueType = graphValueTypes[index];
    this.triggerEvent("profile.chart.valueTypeChanged", this);
    $(containerParent)
      .find(".hover-menu__content_list a")
      .each(function (itemIndex) {
        $(this).removeClass("active");

        if (index === itemIndex) {
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

    /*
    let siFilter = new SubindicatorFilter(
      indicators,
      filterArea,
      groups,
      title,
      this,
      dropdowns
    );
    this.bubbleEvent(siFilter, "point_tray.subindicator_filter.filter");
    */
  };

  applyFilter = (chartData, selectedGroup, selectedFilter) => {
    this.selectedFilter = selectedFilter;
    this.selectedGroup = selectedGroup;
    if (chartData !== null) {
      this.setDownloadUrl();
      this.vegaView.signal('filterIndicator', selectedGroup)
      this.vegaView.signal('filterValue', selectedFilter)
      if(selectedGroup && selectedFilter !== "All values") {
        this.vegaView.signal('applyFilter', true).run()
      } else {
        this.vegaView.signal('applyFilter', false).run()
      }
    }
  };
}

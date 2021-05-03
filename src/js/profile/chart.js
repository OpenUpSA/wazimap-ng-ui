import { format as d3format } from "d3-format/src/defaultLocale";
import { select as d3select } from "d3-selection";

import { Observable } from "../utils";
import { defaultValues } from "../defaultValues";

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
      })
      .catch(console.error);
  };

  showChartDataTable = () => {
    let data = this.getValuesFromSubindicators();

        this.containerParent.find('.profile-indicator__table').remove();

        let table = document.createElement('table');
        $(table).addClass('profile-indicator__table profile-indicator__table_content');
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
        $(table).append(thead);
        let tbody = document.createElement('tbody');
    
    
        for (const [label, subindicator] of Object.entries(this.subindicators)) {
            let absolute_val = subindicator.count;
            let percentage_val = this.getPercentageValue(absolute_val, this.subindicators);
            let row = document.createElement('tr');
            $(row).addClass('profile-indicator__table_row');
            let col1 = document.createElement('td');
            $(col1).addClass('profile-indicator__table_cell profile-indicator__table_cell--first');
            $(col1).text(subindicator.keys);
            let col2 = document.createElement('td');
            $(col2).addClass('profile-indicator__table_cell');
            $(col2).text(d3format(this.config.types[VALUE_TYPE].formatting)(absolute_val));
            let col3 = document.createElement('td');
            $(col3).addClass('profile-indicator__table_cell');
            $(col3).text(d3format(this.config.types[PERCENTAGE_TYPE].formatting)(percentage_val));
            $(row).append(col1);
            $(row).append(col2);
            $(row).append(col3);
            $(tbody).append(row);
        }
        $(table).append(tbody);
        this.containerParent.append(table);
        if (data.length > MAX_RICH_TABLE_ROWS) {
          let showExtraRows = false;
          let btnDiv = document.createElement('div');
          $(btnDiv).addClass('profile-indicator__table_show-more profile-indicator__table_showing profile-indicator__table_load-more');
          let btn = document.createElement('button');
          $(btn).text('Load more rows');
          $(btn).on("click", () => {
            showExtraRows = !showExtraRows;
            showExtraRows ? $(btn).text('Show less rows') : $(btn).text('Load more rows');
            showExtraRows ? $(table).removeClass("profile-indicator__table_content") : $(table).addClass("profile-indicator__table_content");
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

    let g = groups.filter((g) => { return g.name !== indicators.metadata.primary_group })
    let siFilter = new SubindicatorFilter(filterArea, g, title, this.applyFilter, dropdowns, undefined, indicators.child_data);
    this.bubbleEvent(siFilter, "point_tray.subindicator_filter.filter");
  };

  applyFilter = (filteredData, selectedGroup, selectedFilter) => {
    this.filteredData = filteredData;
    this.selectedFilter = selectedFilter;
    this.selectedGroup = selectedGroup;
      this.setDownloadUrl();
      this.vegaView.signal('filterIndicator', selectedGroup.name)
      this.vegaView.signal('filterValue', selectedFilter)
      if(selectedGroup && selectedFilter !== "All values") {
        this.vegaView.signal('applyFilter', true).run()
      } else {
        this.vegaView.signal('applyFilter', false).run()
      }
  };
}

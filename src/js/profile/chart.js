import { format as d3format } from "d3-format/src/defaultLocale";
import { select as d3select } from "d3-selection";

import { Observable } from "../utils";
import { defaultValues } from "../defaultValues";

import { horizontalBarChart } from "../reusable-charts/horizontal-bar-chart";
import { SubindicatorFilter } from "./subindicator_filter";

import embed from "vega-embed";

const PERCENTAGE_TYPE = "Percentage";
const VALUE_TYPE = "Value";
const graphValueTypes = [PERCENTAGE_TYPE, VALUE_TYPE];
const chartContainerClass = ".indicator__chart";
const tooltipClass = ".bar-chart__row_tooltip";

let tooltipClone = null;

export class Chart extends Observable {
  constructor(
    config,
    subindicators,
    groups,
    indicators,
    graphValueType,
    _subCategoryNode,
    title
  ) {
    //we need the subindicators and groups too even though we have detail parameter. they are used for the default chart data
    super();

    this.subindicators = subindicators;
    this.graphValueType = graphValueType;
    this.title = title;
    this.config = config;
    this.selectedFilter = null;
    this.selectedGroup = null;

    tooltipClone = $(tooltipClass)[0].cloneNode(true);
    this.subCategoryNode = _subCategoryNode;

    const chartContainer = $(chartContainerClass, this.subCategoryNode);
    this.container = chartContainer[0];

    this.handleChartFilter(indicators, groups, title);
    this.addChart(indicators[title]);
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
      height: data.data.length * 35,
      padding: 5,

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
          value: "percentage"
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

  getValuesFromSubindicators = () => {
    let arr = [];

    for (const [label, subindicator] of Object.entries(this.subindicators)) {
      let count = subindicator.count;
      let percentage_val = this.getPercentageValue(count, this.subindicators)
      arr.push({
        label: subindicator.keys,
        value: count,
        percentageValue: percentage_val,
      });
    }

    return arr;
  };

  setDownloadUrl = async () => {
    const containerParent = $(this.container).closest(".profile-indicator");
    const pngDownloadUrl = await this.vegaView.toImageURL('png', 1);
    const saveImgButton = $(containerParent).find(
      ".hover-menu__content a.hover-menu__content_item:nth-child(1)"
    );
    saveImgButton.attr('href', pngDownloadUrl);
    saveImgButton.attr('download', 'chart.png');
  }

  setChartMenu = (barChart) => {
    const self = this;
    const containerParent = $(this.container).closest(".profile-indicator");

    const saveImgButton = $(containerParent).find(
      ".hover-menu__content a.hover-menu__content_item:nth-child(1)"
    );
    saveImgButton.attr('download', 'chart.png');
    self.setDownloadUrl();

    $(saveImgButton).off("click");
    $(saveImgButton).on("click", async () => {
      this.triggerEvent("profile.chart.saveAsPng", this);
    });

  //todo:don't use index, specific class names should be used here when the classes are ready
  var unitValues = ["percentage", "value"]
  $(containerParent)
      .find(".hover-menu__content_list a")
      .each(function (index) {
        $(this).off("click");
        $(this).on("click", () => {
          self.selectedGraphValueTypeChanged(containerParent, index);
          self.vegaView.signal("Units", unitValues[index]).run()
          self.setDownloadUrl();
        });
      });

    $(containerParent)
      .find(".hover-menu__content_list--last a")
      .each(function (index) {
        $(this).off("click");
        $(this).on("click", () => {
          const downloadFn = {
            0: { type: "csv", fn: barChart.exportAsCsv },
            1: { type: "excel", fn: barChart.exportAsExcel },
            2: { type: "json", fn: barChart.exportAsJson },
            3: { type: "kml", fn: barChart.exportAsKml },
          }[index];
          self.triggerEvent(
            `profile.chart.download_${downloadFn["type"]}`,
            self
          );

          let fileName =
            self.selectedGroup === null
              ? `${self.title}`
              : `${self.title} - by ${self.selectedGroup} - ${self.selectedFilter}`;
          downloadFn.fn(fileName);
        });
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

    let siFilter = new SubindicatorFilter(
      indicators,
      filterArea,
      groups,
      title,
      this,
      dropdowns
    );
    this.bubbleEvent(siFilter, "point_tray.subindicator_filter.filter");
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

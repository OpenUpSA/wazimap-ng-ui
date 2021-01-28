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
    this.addChart();
  }

  addChart = () => {
    $(".bar-chart", this.container).remove();
    $("svg", this.container).remove();

    let data = this.getValuesFromSubindicators();

    let width = $('.rich-data').first().width() - 500;

    const barChart = {
      $schema: "https://vega.github.io/schema/vega/v5.json",
      description: "A",
      height: { signal: data.length * 35 },
      width: width,
      padding: 5,

      data: [
        {
          name: "table",
          values: data,
        },
      ],

      signals: [
        {
          name: "barvalue",
          value: "datum",
        },
        {
          name: "Units",
          value: "percentage"
        },
        {
          name: "format",
          value: { percentage: "%", value: ".1s" },
        },
        {
          name: "datatype",
          value: { percentage: "percentageValue", value: "value" },
        },
        {
          name: "textformat",
          value: { percentage: "percentageValueText", value: "valueText" },
        },
      ],

      scales: [
        {
          name: "yscale",
          type: "band",
          domain: { data: "table", field: "label" },
          range: "height",
          padding: 0.1,
        },
        {
          name: "xscale",
          type: "linear",
          domain: { data: "table", field: { signal: "datatype[Units]" } },
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
          format: { signal: "format[Units]" },
          grid: true,
          gridOpacity: 0.5,
          labelOpacity: 0.5,
          labelPadding: 6,
        },
      ],

      marks: [
        {
          name: "bars",
          from: { data: "table" },
          type: "rect",
          encode: {
            enter: {
              y: { scale: "yscale", field: "label" },
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
              fontSize: { value: 10 },
              text: {
                signal: "datum[textformat[Units]]",
              },
              x: {
                scale: "xscale",
                signal: "datum[datatype[Units]]",
                offset: 2,
              },
              y: {
                scale: "yscale",
                signal: "datum.label",
                band: 0.5,
              },
            },
            update: {
            },
          },
        },
      ],
    };

    embed(this.container, barChart, { actions: false})
      .then(async (result) => {
        const pngDownloadUrl = await result.view.toImageURL('png', 1);
        this.vegaView = result.view;
        this.setChartMenu(pngDownloadUrl);
      })
      .catch(console.error);
  };

  getValuesFromSubindicators = () => {
    let arr = [];
    const chartConfig = this.config.types[this.graphValueType];

    for (const [label, subindicator] of Object.entries(this.subindicators)) {
      let count = subindicator.count;
      let val =
        this.graphValueType === VALUE_TYPE
          ? this.getPercentageValue(count, this.subindicators)
          : count;
      let percentage_val =
        this.graphValueType === PERCENTAGE_TYPE
          ? this.getPercentageValue(count, this.subindicators)
          : count;
      arr.push({
        label: subindicator.keys,
        value: val,
        percentageValue: percentage_val,
        valueText: d3format(".4s")(val),
        percentageValueText: d3format(chartConfig.formatting)(percentage_val),
      });
    }

    return arr;
  };

  setChartMenu = (barChart) => {
    const self = this;
    const containerParent = $(this.container).closest(".profile-indicator");

    const saveImgButton = $(containerParent).find(
      ".hover-menu__content a.hover-menu__content_item:nth-child(1)"
    );
    saveImgButton.attr('download', 'chart.png');
    saveImgButton.attr('href', barChart);

    $(saveImgButton).off("click");
    $(saveImgButton).on("click", () => {
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

    this.addChart();
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
      this.subindicators = chartData;
      this.addChart();
    }
  };
}

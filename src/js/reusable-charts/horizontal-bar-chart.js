import {scaleBand, scaleLinear, scaleOrdinal} from 'd3-scale';
import {max} from 'd3-array';
import 'd3-transition';
import {easeLinear} from 'd3-ease';
import d3Tip from 'd3-tip';
import {selectAll, select} from 'd3-selection';
import {axisBottom, axisLeft} from 'd3-axis';
import {saveSvgAsPng} from 'save-svg-as-png';
import html2canvas from 'html2canvas';
import xlsExport from "xlsexport";

export function horizontalBarChart() {
    const initialConfiguration = {
        data: [],
        width: 760,
        height: 450,
        colors: ['#39ad84', '#339b77'],
        xAxisPadding: 10,
        yAxisPadding: 10,
        xLabelPadding: 10,
        barHeight: 30,
        barPadding: 10,
        margin: {
            top: 15,
            right: 25,
            bottom: 15,
            left: 100,
        },
        tooltipFormatter: (d) => {
            return `${d.data.label}: ${d.data.value}`;
        },
        xAxisFormatter: (d) => {
            return d;
        }
    };

    let data = initialConfiguration.data;
    let tooltipFormatter = initialConfiguration.tooltipFormatter;
    let width = initialConfiguration.width;
    let height = initialConfiguration.height;
    let colors = initialConfiguration.colors;
    let margin = initialConfiguration.margin;
    let xAxisPadding = initialConfiguration.xAxisPadding;
    let yAxisPadding = initialConfiguration.yAxisPadding;
    let xLabelPadding = initialConfiguration.xLabelPadding;
    let xAxisFormatter = initialConfiguration.xAxisFormatter;
    let barHeight = initialConfiguration.barHeight;
    let barPadding = initialConfiguration.barPadding;

    function chart(selection) {
        selection.each(() => {
            width = width - margin.left - margin.right;
            height = data.length * (barHeight + barPadding);

            /**
             * settings - width, height etc
             */
            const barChartSvg = selection.append('svg')
                .attr("preserveAspectRatio", "xMinYMin meet")
                .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom + xAxisPadding + xLabelPadding))
                .append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);

            const x = scaleLinear()
                .range([0, width]) //**
                .domain([0, max(data, (d) => d.value)]);

            const y = scaleBand()
                .rangeRound([height, 0])
                .padding(0.1)
                .domain(data.map((d) => d.label));

            /**
             * create x and y axis
             */
            const yAxis = axisLeft(y)
                .tickSize(0)
                .tickPadding(yAxisPadding);
            const xAxis = axisBottom(x)
                .tickSize(0)
                .tickPadding(xAxisPadding)
                .tickFormat(xAxisFormatter);

            /**
             * append y axis
             */
            const gy = barChartSvg.append('g')
                .attr('class', 'y-axis')
                .style('color', '#999')
                .style('font-size', '11px')
                .call(yAxis);

            /**
             * append x axis
             */
            const gx = barChartSvg.append('g')
                .attr('class', 'x-axis')
                .attr("transform", "translate(0," + height + ")")
                .style('color', '#999')
                .style('font-size', '11px')
                .call(xAxis);

            /**
             * create gridlines in x axis
             */
            function make_x_gridlines() {
                return axisBottom(x)
                    .ticks(8)
            }

            /**
             * append grid lines
             */
            barChartSvg.append("g")
                .attr("class", "grid")
                .attr("transform", "translate(0," + height + ")")
                .call(make_x_gridlines()
                    .tickSize(-height)
                    .tickFormat("")
                )

            /**
             * bars
             */
            const bars = barChartSvg.selectAll('.bar')
                .data(data)
                .enter()
                .append('g');

            /**
             * tooltip
             */
            const tooltip = d3Tip()
                .attr("class", "bar-tooltip")
                .direction(function (d) {
                    return 'n';
                })
                .offset(function (d) {
                    return [0, 0];
                })
                .html(tooltipFormatter)
                .style('background-color', 'white');

            barChartSvg.call(tooltip);

            /**
             * append bars
             */
            bars.append('rect')
                .attr('class', '')
                .attr('fill', colors[0])
                .attr('y', (d) => y(d.label))
                .attr('height', barHeight)
                .attr('x', 0)
                .attr('width', (d) => x(d.value))
                .style('cursor', 'pointer')
                .on("mouseover", function (d) {
                    $(this).attr("fill", colors[1]);
                    tooltip.show({data: d, isArea: true}, this);
                    $(this).closest('g').find('rect:nth-child(2)').attr("fill", '#f5f5f5');
                })
                .on("mouseout", function (d, i) {
                    $(this).attr("fill", colors[0]);
                    tooltip.hide();
                    $(this).closest('g').find('rect:nth-child(2)').attr("fill", 'transparent');
                });

            bars.append('rect')
                .attr('class', '')
                .attr('fill', 'transparent')
                .attr('y', (d) => y(d.label))
                .attr('height', barHeight)
                .attr('x', (d) => x(d.value))
                .attr('width', (d) => {
                    return width - x(d.value)
                })
                .style('cursor', 'pointer')
                .on("mouseover", function (d) {
                    let bar = $(this).closest('g').find('rect:nth-child(1)');
                    tooltip.show({data: d, isArea: true}, bar[0]);
                    $(this).attr("fill", '#f5f5f5');
                    $(bar).attr("fill", colors[1]);
                })
                .on("mouseout", function (d, i) {
                    let bar = $(this).closest('g').find('rect:nth-child(1)');
                    tooltip.hide();
                    $(this).attr("fill", 'transparent');
                    $(bar).attr("fill", colors[0]);
                });

            // text label for the x axis
            barChartSvg.append("text")
                .attr("transform",
                    "translate(" + (width / 2) + " ," +
                    (height + margin.top + xLabelPadding) + ")")
                .attr("class", "bar-chart__x-label")
                .style("text-anchor", "middle")
                .style("fill", "#999")
                .text("LABEL GOES HERE");
        });
    }

    chart.saveAsPng = function (container) {
        let element = $(container).closest('.profile-indicator')[0];
        $(element).find('.profile-indicator__options').attr('data-html2canvas-ignore', true);

        let options = {
            x: $(element).offset().left - 30,
            y: $(element).offset().top - 5,
            width: $(element).width() + 30
        }

        html2canvas(element, options).then(function (canvas) {
            saveAs(canvas.toDataURL(), 'chart.png');
        });
    }

    function saveAs(uri, filename) {
        let link = document.createElement('a');
        if (typeof link.download === 'string') {

            link.href = uri;
            link.download = filename;

            //Firefox requires the link to be in the body
            document.body.appendChild(link);

            //simulate click
            link.click();

            //remove the link when done
            document.body.removeChild(link);

        } else {
            window.open(uri);
        }
    }

    chart.exportAsCsv = function (title) {
        const exportData = getExportData();
        const fileName = title + '.xls';
        const sheetName = 'Chart Data';
        const xls = new xlsExport(exportData, sheetName);

        xls.exportToCSV(fileName);
    }

    chart.exportAsExcel = function (title) {
        const exportData = getExportData();
        const fileName = title + '.xls';
        const sheetName = 'Chart Data';
        const xls = new xlsExport(exportData, sheetName);

        xls.exportToXLS(fileName);
    }

    chart.exportAsJson = function (title) {
        const exportData = getExportData();

        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData));
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", title + ".json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    chart.exportAsKml = function (title) {
        const exportData = getExportData();

        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData));
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", title + ".kml");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    function getExportData() {
        const exportData = data.map((d) => {
            return {
                'Sub-indicator': d.label.toString(),
                'Value': d.valueText.toString()
            }
        })

        return exportData;
    }

    chart.width = function (value) {
        if (!arguments.length) return width;
        width = value;
        return chart;
    };

    chart.height = function (value) {
        if (!arguments.length) return height;
        height = value;
        return chart;
    };

    chart.margin = function (value) {
        if (!arguments.length) return margin;
        margin = value;
        return chart;
    };

    chart.colors = function (value) {
        if (!arguments.length) return colors;
        colors = value;
        return chart;
    };

    chart.xAxisPadding = function (value) {
        if (!arguments.length) return xAxisPadding;
        xAxisPadding = value;
        return chart;
    };

    chart.yAxisPadding = function (value) {
        if (!arguments.length) return yAxisPadding;
        yAxisPadding = value;
        return chart;
    };

    chart.xLabelPadding = function (value) {
        if (!arguments.length) return xLabelPadding;
        xLabelPadding = value;
        return chart;
    };

    chart.barHeight = function (value) {
        if (!arguments.length) return barHeight;
        barHeight = value;
        return chart;
    };

    chart.barPadding = function (value) {
        if (!arguments.length) return barPadding;
        barPadding = value;
        return chart;
    };

    chart.tooltipFormatter = function (value) {
        if (!arguments.length) {
            return tooltipFormatter
        } else {
            if (value == null) {
                tooltipFormatter = initialConfiguration.tooltipFormatter;
            } else {
                tooltipFormatter = value;
            }
            return chart;
        }
    };

    chart.xAxisFormatter = function (value) {
        if (!arguments.length) {
            return xAxisFormatter;
        } else {
            if (value === null) {
                xAxisFormatter = initialConfiguration.xAxisFormatter;
            } else {
                xAxisFormatter = value;
            }

            return chart;
        }
    };

    chart.data = function (value) {
        if (!arguments.length) {
            return data;
        }
        data = value;

        return chart;
    };

    return chart;
}

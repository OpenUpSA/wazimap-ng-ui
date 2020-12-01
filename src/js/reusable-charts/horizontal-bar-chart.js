import {scaleBand, scaleLinear, scaleOrdinal} from 'd3-scale';
import {max} from 'd3-array';
import 'd3-transition';
import d3Tip from 'd3-tip';
import {axisBottom, axisLeft} from 'd3-axis';
import html2canvas from 'html2canvas';
import xlsExport from "xlsexport";
import {saveAs} from "../utils";

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
        xLabel: "LABEL GOES HERE",
        barLabelLength: 15,
        margin: {
            top: 15,
            right: 25,
            bottom: 15,
            left: 100,
        },
        reverse: false,
        minX: 0,
        maxX: null,
        barTextPadding: {
            top: 15,
            left: 10
        },

        tooltipFormatter: (d) => {
            return `${d.data.label}: ${d.data.value}`;
        },
        xAxisFormatter: (d) => {
            return d;
        },
        yAxisFormatter: (d) => {
            if (d.length > barLabelLength)
                d = d.substring(0, barLabelLength) + '...'
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
    let yAxisFormatter = initialConfiguration.yAxisFormatter;
    let barHeight = initialConfiguration.barHeight;
    let barPadding = initialConfiguration.barPadding;
    let xLabel = initialConfiguration.xLabel;
    let barLabelLength = initialConfiguration.barLabelLength;
    let reverse = initialConfiguration.reverse;
    let minX = initialConfiguration.minX;
    let maxX = initialConfiguration.maxX;
    let barTextPadding = initialConfiguration.barTextPadding;

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
                .domain([minX, _maxX()])

            const y = scaleBand()
                .rangeRound([height, 0])
                .padding(0.1)
                .domain(data.map((d) => d.label));

            /**
             * create x and y axis
             */
            const yAxis = axisLeft(y)
                .tickSize(0)
                .tickPadding(yAxisPadding)
                .tickFormat(yAxisFormatter);
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
                .attr("stroke-opacity", 0.2)
                .attr("stroke", '#999')
                .attr("transform", "translate(0," + height + ")")
                .call(make_x_gridlines()
                    .tickSize(-height)
                    .tickFormat("")
                )
                .call(g => g.selectAll(".tick line")
                    .attr("stroke", "#999")
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

            // text on the bars
            bars.append('text')
                .attr('y', (d) => y(d.label) + barTextPadding.top)
                .attr('x', (d) => x(d.value) + barTextPadding.left)
                .attr("class", "bar-chart__x-label")
                .style('fill', '#999')
                .text((d) => d.valueText);

            // text label for the x axis
            barChartSvg.append("text")
                .attr("transform",
                    "translate(" + (width / 2) + " ," +
                    (height + margin.top + xLabelPadding) + ")")
                .attr("class", "bar-chart__x-label")
                .style("text-anchor", "middle")
                .style("fill", "#999")
                .text(xLabel);
        });
    }

    chart.saveAsPng = function (container) {

        let element = $(container).closest('.profile-indicator')[0];

        $(element).find('.profile-indicator__options').attr('data-html2canvas-ignore', true);
        $(element).find('.profile-indicator__filters').attr('data-html2canvas-ignore', true);
        const rightMargin = 60;

        let options = {
            x: $(element).offset().left - 30,
            y: $(element).offset().top - 5,
            width: element.getBoundingClientRect().width + rightMargin,
            height: element.getBoundingClientRect().height,
            //fix the size of the chart so it doesn't get affected by the client's resolution
            windowWidth: 1920,
            windowHeight: 1080,
            scale: 0.9
        }

        html2canvas(element, options).then(function (canvas) {
            saveAs(canvas.toDataURL(), 'chart.png');

            $(element).find('.profile-indicator__options').removeAttr('data-html2canvas-ignore');
            $(element).find('.profile-indicator__filters').removeAttr('data-html2canvas-ignore');
        });
    }

    chart.exportAsCsv = function (title) {
        const exportData = getExportData();
        let rows = [];

        rows.push(['Sub-indicator', 'Value']);

        exportData.forEach(function (rowArray) {
            let row = [];
            for (const [label, value] of Object.entries(rowArray)) {
                row.push(value);
            }
            rows.push(row);
        });

        const fileName = `${title}.csv`;

        let csvContent = "data:text/csv;charset=utf-8,"
            + rows.map(e => e.join(",")).join("\n");

        let encodedUri = encodeURI(csvContent);
        let link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", fileName);
        document.body.appendChild(link); // Required for FF

        link.click();
        document.body.removeChild(link);
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

    function _maxX() {
        return maxX || max(data, d => d.value);
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

    chart.xLabel = function (value) {
        if (!arguments.length) return xLabel;
        xLabel = value;
        return chart;
    };

    chart.barLabelLength = function (value) {
        if (!arguments.length) return barLabelLength;
        barLabelLength = value;
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

    chart.minX = function (value) {
        if (!arguments.length) {
            return minX
        }
        minX = value;

        return chart;
    }

    chart.maxX = function (value) {
        if (!arguments.length) {
            return _maxX()
        }
        maxX = value;

        return chart;
    }

    chart.yAxisFormatter = function (value) {
        if (!arguments.length) {
            return yAxisFormatter;
        } else {
            if (value === null) {
                yAxisFormatter = initialConfiguration.yAxisFormatter;
            } else {
                yAxisFormatter = value;
            }

            return chart;
        }
    };

    chart.reverse = function (value) {
        if (!arguments.length) return reverse;

        reverse = value;
        if (value)
            data = data.reverse()
        return chart;
    };

    chart.data = function (value) {
        if (!arguments.length) {
            return data;
        }
        data = value;

        return chart;
    };

    chart.barTextPadding = function (value) {
        if (!arguments.length) return barTextPadding;
        barTextPadding = value;
        return chart;
    };


    return chart;
}

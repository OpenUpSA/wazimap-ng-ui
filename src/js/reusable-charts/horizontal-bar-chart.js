import {scaleBand, scaleLinear, scaleOrdinal} from 'd3-scale';
import {max} from 'd3-array';
import 'd3-transition';
import {easeLinear} from 'd3-ease';
import d3Tip from 'd3-tip';
import {selectAll} from 'd3-selection';
import {axisBottom, axisLeft} from 'd3-axis';

export function horizontalBarChart() {
    const initialConfiguration = {
        data: [],
        width: 760,
        height: 450,
        colors: ['#39ad84', '#339b77'],
        margin: {
            top: 15,
            right: 25,
            bottom: 15,
            left: 100,
        },
        tooltipFormatter: (d) => {
            return `${d.data.label}: ${d.data.value}`;
        }
    };

    let {data} = initialConfiguration;
    let tooltipFormatter = initialConfiguration.tooltipFormatter;
    let width = initialConfiguration.width;
    let height = initialConfiguration.height;
    let colors = initialConfiguration.colors;
    let margin = initialConfiguration.margin;

    function chart(selection) {
        selection.each(() => {

            width = width - margin.left - margin.right;
            height = height - margin.top - margin.bottom;

            /**
             * settings - width, height etc
             */
            const barChartSvg = selection.append('svg')
                .attr('height', height + margin.top + margin.bottom)
                .attr('width', width + margin.left + margin.right)
                .append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);

            const x = scaleLinear()
                .range([0, width])
                .domain([0, max(data, (d) => d.value)]);

            const y = scaleBand()
                .rangeRound([height, 0])
                .padding(0.1)
                .domain(data.map((d) => d.label));

            /**
             * create x and y axis
             */
            const yAxis = axisLeft(y).tickSize(0);
            const xAxis = axisBottom(x).tickSize(0);

            /**
             * append y axis
             */
            const gy = barChartSvg.append('g')
                .attr('class', 'y-axis')
                .style('color', '#999')
                .style('font-size', '14px')
                .call(yAxis);

            /**
             * append x axis
             */
            const gx = barChartSvg.append('g')
                .attr('class', 'x-axis')
                .attr("transform", "translate(0," + height + ")")
                .style('color', '#999')
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
                .attr('height', y.bandwidth())
                .attr('x', 0)
                .attr('width', (d) => x(d.value))
                .style('cursor', 'pointer')
                .on("mouseover", function (d) {
                    $(this).attr("fill", colors[1]);
                    tooltip.show({data: d, isArea: true}, this);
                })
                .on("mouseout", function (d, i) {
                    $(this).attr("fill", colors[0]);
                    tooltip.hide();
                });
        });

        /**
         * we need these stylings
         */
        $(".bar-tooltip").css("z-index", 100);
        $('line').css('stroke', '#999');
        $('line').css('stroke-opacity', '0.2');
        $('.grid').css('color', '#999');
        $('.grid').css('stroke-opacity', '0.2');
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

    chart.data = function (value) {
        if (!arguments.length) {
            return data;
        }
        data = value;

        return chart;
    };

    return chart;
}

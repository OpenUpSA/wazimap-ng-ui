import React, {useEffect, useState} from "react";
import {Card, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {format as d3format} from "d3-format";
import {scaleSequential as d3scaleSequential} from 'd3-scale';
import {defaultValues} from "../defaultValues";
import {fillMissingKeys} from "../utils";
import {ResultArrowSvg, ResultArrowSvg2} from "./svg-icons";

//components
import SectionTitle from "./section-title";

const Result = (props) => {
    const [rows, setRows] = useState([]);
    const arrowSvg = ResultArrowSvg;

    const arrowSvg2 = ResultArrowSvg2;

    useEffect(() => {
        populateRows();
    }, [props.indicatorObjs, props.indicators, props.selectedGeographies])

    const populateRows = () => {
        let rows = [];
        props.selectedGeographies.map((geo) => {
            let newRow = {geo: geo.name, objs: []};
            props.indicatorObjs.map((obj) => {
                let chartConfig = props.indicators
                    .filter(x => x.geo === geo.code && x.indicator === obj.indicator)[0]?.indicatorDetail
                    .chart_configuration;

                chartConfig = fillMissingKeys(chartConfig, defaultValues.chartConfiguration || {});

                const formatting = chartConfig.types['Value'].formatting;

                let newObj = {
                    obj: obj,
                    value: calculateValue(geo, obj),
                    formatting: formatting
                }
                newRow.objs.push(newObj);
            })

            rows.push(newRow);
        })

        setBackgroundColors(rows);

        setRows(rows);
    }

    const setBackgroundColors = (rows) => {
        let darkestColor = '#BABABA';
        let lightestColor = '#ffffff';

        props.indicatorObjs.forEach((obj) => {
            let objValues = [];
            rows.forEach((row) => {
                let objValue = row.objs.filter(x => x.obj === obj)[0]?.value;
                if (objValue != null) {
                    objValues.push(objValue);
                }
            })

            const max = Math.max(...objValues);
            const min = Math.min(...objValues);

            const scale = d3scaleSequential()
                .domain([min, max])
                .range([lightestColor, darkestColor]);

            rows.forEach((row) => {
                let rowObj = row.objs.filter(x => x.obj === obj)[0];
                if (rowObj != null && rowObj.value != null) {
                    rowObj.background = scale(rowObj.value);
                    rowObj.value = rowObj.formatting == null ? rowObj.value : d3format(rowObj.formatting)(rowObj.value);
                }
            })
        })
    }

    const calculateFullHeight = () => {
        const topSpace = 56 + 60;
        const bottomSpace = 40;
        return window.innerHeight - topSpace - bottomSpace;
    }

    const calculateValue = (geo, obj) => {
        let selectedIndicator = props.indicators.filter((ind) => ind.geo === geo.code && ind.indicator === obj.indicator)[0];
        if (selectedIndicator == null) {
            return;
        }

        const primaryGroup = selectedIndicator.indicatorDetail.metadata?.primary_group;
        const data = selectedIndicator.indicatorDetail.data?.filter(x => x[primaryGroup] === obj.category);
        if (data != null && data.length > 0) {
            return data.reduce((n, {count}) => n + parseFloat(count), 0);
        } else {
            return null;
        }
    }

    const renderResult = () => {
        if (props.selectedGeographies.length <= 0) {
            return renderEmptyGeographyState();
        } else if (props.indicatorObjs.length <= 0) {
            return renderEmptyIndicatorState();
        } else {
            return renderTable();
        }
    }

    const renderTable = () => {
        return <TableContainer
            component={Paper}
            sx={{maxHeight: calculateFullHeight()}}
        >
            <Table
                stickyHeader
                sx={{minWidth: 650}}
                aria-label={'simple table'}
                data-testid={'result-table'}
            >
                <TableHead>
                    <TableRow>
                        <TableCell
                          data-testid={'table-header-0'}
                        ><b>Geography</b></TableCell>
                        {
                            props.indicatorObjs.map((column) => {
                                if (column.indicator !== '' && column.category !== '') {
                                    return (
                                        <TableCell
                                            data-testid={`table-header-${column.index}`}
                                            key={column.index}
                                            className={'truncate-table-cell'}
                                            title={column.indicator + ' : ' + column.category}
                                        ><b>{column.indicator} : {column.category}</b></TableCell>
                                    )
                                }
                            })
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        rows.map((row, idx) => {
                            return (
                                <TableRow
                                    key={row.geo}
                                >
                                    <TableCell
                                        data-testid={`table-row-${idx}-cell-0`}
                                        component={'td'}
                                        scope={'row'}
                                    >{row.geo}</TableCell>
                                    {
                                        props.indicatorObjs.map((obj) => {
                                            if (obj.indicator !== '' && obj.category !== '') {
                                                const value = row.objs.filter(x => x.obj === obj)[0]?.value;
                                                if (value === 'NaN') {
                                                    return (
                                                        <TableCell
                                                            data-testid={`table-row-${idx}-cell-${obj.index}`}
                                                            component={'td'}
                                                            scope={'row'}
                                                            key={obj.index}
                                                            sx={{backgroundColor: '#fff'}}
                                                        ></TableCell>   //empty
                                                    )
                                                } else {
                                                    return (
                                                        <TableCell
                                                            data-testid={`table-row-${idx}-cell-${obj.index}`}
                                                            component={'td'}
                                                            scope={'row'}
                                                            key={obj.index}
                                                            sx={{backgroundColor: row.objs.filter(x => x.obj === obj)[0]?.background}}
                                                        >{value}
                                                        </TableCell>
                                                    )
                                                }
                                            }
                                        })
                                    }
                                </TableRow>
                            )
                        })
                    }
                </TableBody>
            </Table>
        </TableContainer>
    }

    const renderEmptyGeographyState = () => {
        return (
            <div className={'result-empty-state'}>
                <span>{arrowSvg}</span>
                <span>We can’t wait to show you some data! Choose a geography to get started!</span>
            </div>
        )
    }

    const renderEmptyIndicatorState = () => {
        return (
            <div
                className={'result-empty-state result-empty-indicators'}
                style={{marginTop: calculateFullHeight() / 2 - 8}}>
                <span>{arrowSvg2}</span>
                <span>You’ve chosen a geography, now select an indicator!</span>
            </div>
        )
    }

    return (
        <Grid
            container
        >
            <Grid
                className={'margin-bottom-20'}
            >
                <SectionTitle>Resulting comparison</SectionTitle>
            </Grid>
            <Grid container>
                <Card
                    className={'dark-grey-bg full-width border-radius-10'}
                    variant={'outlined'}
                    sx={{height: calculateFullHeight()}}
                >
                    {renderResult()}
                </Card>
            </Grid>
        </Grid>
    );
}

export default Result;

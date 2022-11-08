import React, {useState, useEffect} from "react";
import {Card, Grid, TableContainer, Table, TableBody, TableCell, Paper, TableHead, TableRow} from "@mui/material";
import {format as d3format} from "d3-format";
import {scaleSequential as d3scaleSequential} from 'd3-scale';

//components
import SectionTitle from "./section-title";

const Result = (props) => {
    const [rows, setRows] = useState([]);

    useEffect(() => {
        populateRows();
    }, [props.indicatorObjs, props.indicators, props.selectedGeographies])

    const populateRows = () => {
        let rows = [];
        props.selectedGeographies.map((geo) => {
            let newRow = {geo: geo.name, objs: []};
            props.indicatorObjs.map((obj) => {
                const formatting = props.indicators
                    .filter(x => x.geo === geo.code && x.indicator === obj.indicator)[0]?.indicatorDetail
                    .chart_configuration
                    .types['Value'].formatting;

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
                if (rowObj != null) {
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
        let value = data?.reduce((n, {count}) => n + parseFloat(count), 0);

        return value;
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
                    <TableContainer
                        component={Paper}
                        sx={{maxHeight: calculateFullHeight()}}
                    >
                        <Table
                            stickyHeader
                            sx={{minWidth: 650}}
                            aria-label={'simple table'}
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell
                                    ><b>Geography</b></TableCell>
                                    {
                                        props.indicatorObjs.map((column) => {
                                            if (column.indicator !== '' && column.category !== '') {
                                                return (
                                                    <TableCell
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
                                    rows.map((row) => {
                                        return (
                                            <TableRow
                                                key={row.geo}
                                            >
                                                <TableCell
                                                    component={'th'}
                                                    scope={'row'}
                                                >{row.geo}</TableCell>
                                                {
                                                    props.indicatorObjs.map((obj) => {
                                                        if (obj.indicator !== '' && obj.category !== '') {
                                                            return (
                                                                <TableCell
                                                                    component={'th'}
                                                                    scope={'row'}
                                                                    key={obj.index}
                                                                    sx={{backgroundColor: row.objs.filter(x => x.obj === obj)[0]?.background}}
                                                                >{row.objs.filter(x => x.obj === obj)[0]?.value}
                                                                </TableCell>
                                                            )
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
                </Card>
            </Grid>
        </Grid>
    );
}

export default Result;
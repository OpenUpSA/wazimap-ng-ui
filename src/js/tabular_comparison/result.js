import React, {useEffect, useState} from "react";
import {Card, Chip, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {format as d3format} from "d3-format";
import {scaleSequential as d3scaleSequential} from 'd3-scale';

//components
import SectionTitle from "./section-title";

const Result = (props) => {
    const [rows, setRows] = useState([]);
    const arrowSvg =
        <svg width="213" height="290" viewBox="0 0 213 290" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M0.36742 6.7255C-0.0602784 7.07491 -0.123745 7.70489 0.225674 8.13259L5.91973 15.1024C6.26915
                15.5301 6.89912 15.5935 7.32683 15.2441C7.75452 14.8947 7.81798 14.2647 7.46857 13.837L2.40718
                7.64166L8.60253 2.58028C9.03024 2.23086 9.0937 1.60088 8.74428 1.17319C8.39487 0.745486 7.76489
                0.682026 7.33719 1.03144L0.36742 6.7255ZM212.623 287.508C189.548 284.647 172.188 278.459 159.049
                269.827C145.918 261.201 136.954 250.102 130.711 237.334C118.192 211.731 116.628 179.477 114.498
                146.997C112.376 114.634 109.69 82.0613 94.6764 56.3165C79.6005 30.4642 52.2065 11.6532 1.10032
                6.50495L0.899863 8.49488C51.5436 13.5966 78.2745 32.1606 92.9487 57.324C107.685 82.5948 110.374
                114.679 112.502 147.128C114.622 179.461 116.183 212.176 128.914 238.213C135.297 251.266 144.488
                262.655 157.951 271.499C171.406 280.338 189.077 286.604 212.377 289.493L212.623 287.508Z"
                fill="#39AD84"/>
        </svg>

    const arrowSvg2 =
        <svg width="263" height="57" viewBox="0 0 263 57" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.0557372 12.671C-0.126071 13.1925 0.149305 13.7626 0.670807 13.9444L9.16917 16.9072C9.69067
            17.089 10.2608 16.8136 10.4426 16.2921C10.6244 15.7706 10.3491 15.2005 9.82756 15.0187L2.27346 12.3851L4.907
            4.83101C5.0888 4.30951 4.81343 3.73936 4.29193 3.55756C3.77042 3.37575 3.20028 3.65112 3.01847
             4.17263L0.0557372 12.671ZM262.293 51.0218C205.916 62.9429 164.549 41.9099 125.18 23.4163C85.8461
             4.93904 48.4461 -11.0265 0.56508 12.0997L1.43492 13.9007C48.4 -8.78318 85.0001 6.75127 124.33
             25.2265C163.625 43.6855 205.584 65.0574 262.707 52.9785L262.293 51.0218Z" fill="#39AD84"/>
        </svg>

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
        return data?.reduce((n, {count}) => n + parseFloat(count), 0);
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
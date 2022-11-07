import React, {useState, useEffect} from "react";
import {Card, Grid, TableContainer, Table, TableBody, TableCell, Paper, TableHead, TableRow} from "@mui/material";
import {format as d3format} from "d3-format";

//components
import SectionTitle from "./section-title";

const Result = (props) => {
    const columns = ['Geography', 'Youth Population', 'Income poverty : Poor', 'Employment status : Unemployed'];

    const calculateFullHeight = () => {
        const topSpace = 56 + 60;
        const bottomSpace = 40;
        return window.innerHeight - topSpace - bottomSpace;
    }

    const displayValue = (geo, obj) => {
        const primaryGroup = obj.indicatorDetail.metadata?.primary_group;
        const data = obj.indicatorDetail.data?.filter(x => x[primaryGroup] === obj.category);
        const formatting = obj.indicatorDetail.chart_configuration?.types.Value.formatting;
        let value = data?.reduce((n, {count}) => n + count, 0);

        console.log({geo, obj})

        return (
            <TableCell
                component="th"
                scope="row"
            >{formatting === undefined ? value : d3format(formatting)(value)}</TableCell>
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
                    <TableContainer component={Paper}>
                        <Table sx={{minWidth: 650}} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell
                                    ><b>Geography</b></TableCell>
                                    {props.indicatorObjs.map((column) => {
                                        return (
                                            <TableCell
                                                key={column.index}
                                            ><b>{column.indicator} : {column.category}</b></TableCell>
                                        )
                                    })}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {props.selectedGeographies.map((geo) => {
                                    return (
                                        <TableRow
                                            key={geo.code}
                                        >
                                            <TableCell
                                                component="th"
                                                scope="row"
                                            >{geo.name}</TableCell>
                                            {
                                                props.indicatorObjs.map((obj) => displayValue(geo, obj))
                                            }
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>
            </Grid>
        </Grid>
    );
}

export default Result;
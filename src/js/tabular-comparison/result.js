import React, {useState, useEffect} from "react";
import {Card, Grid, TableContainer, Table, TableBody, TableCell, Paper, TableHead, TableRow} from "@mui/material";

//components
import SectionTitle from "./section-title";

const Result = (props) => {
    const columns = ['Geography', 'Youth Population', 'Income poverty : Poor', 'Employment status : Unemployed'];

    const calculateFullHeight = () => {
        const topSpace = 56 + 60;
        const bottomSpace = 40;
        return window.innerHeight - topSpace - bottomSpace;
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
                                    {columns.map((column) => {
                                        return (
                                            <TableCell><b>{column}</b></TableCell>
                                        )
                                    })}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {props.selectedGeographies.map((row) => {
                                    return (
                                        <TableRow>
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                key={row.code}
                                            >{row.name}</TableCell>
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
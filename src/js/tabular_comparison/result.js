import React, {useEffect, useState, useCallback} from "react";
import {Card, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";

import {format as d3format} from "d3-format";
import {scaleSequential as d3scaleSequential} from 'd3-scale';
import {max as d3max, min as d3min} from 'd3-array';
import {defaultValues} from "../defaultValues";
import {Config as SAConfig} from '../configurations/geography_sa';
import {fillMissingKeys, getColorRange} from "../utils";
import {ResultArrowSvg, ResultArrowSvg2, UnfoldMoreSvg, FoldMoreSvg} from "./svg-icons";
import {UnfoldButton, CategoryChip, FilterChip} from './components/styledElements';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';

//components
import SectionTitle from "./section-title";

const Result = (props) => {
    const [rows, setRows] = useState([]);
    const arrowSvg = ResultArrowSvg;
    const arrowSvg2 = ResultArrowSvg2;
    const defaultConfig = new SAConfig();
    const [isResultHeaderFolded, setIsResultHeaderFolded] = useState(true);

    useEffect(() => {
        populateRows();
    }, [props.indicatorObjs, props.indicators, props.selectedGeographies])

    const populateRows = () => {
        let rows = [];
        props.selectedGeographies.map((geo) => {
            let newRow = {geo: geo.name, objs: []};
            props.indicatorObjs.map((obj) => {
                let indicatorDetail = props.indicators
                    .filter(x => x.geo === geo.code && x.indicator === obj.indicator)[0]?.indicatorDetail;
                let chartConfig = indicatorDetail?.chart_configuration || {};
                chartConfig = fillMissingKeys(chartConfig, defaultValues.chartConfiguration || {});
                const {value, formatting, tooltip} = getRowDetailsByChoroplethMethod(
                    geo, obj, chartConfig
                );

                let newObj = {
                    obj: obj,
                    value: value,
                    formatting: formatting,
                    tooltip: tooltip,
                }
                newRow.objs.push(newObj);
            })

            rows.push(newRow);
        })

        setBackgroundColors(rows);

        setRows(rows);
    }

    const getBounds = (values) => {
        const hasNegative = values.some(v => v < 0);
        const hasPositive = values.some(v => v > 0);

        if (hasNegative && hasPositive) {
          const maxScaleValue = Math.max(...values.map(v => Math.abs(v)));
          return [maxScaleValue * -1, maxScaleValue]
        }
        return [d3min(values), d3max(values)]
    }

    const setBackgroundColors = (rows) => {
        let choroplethConfig = props.profileConfig?.choropleth || {};
        choroplethConfig = fillMissingKeys(choroplethConfig, defaultConfig.choropleth || {});

        props.indicatorObjs.forEach((obj) => {
            let objValues = [];
            rows.forEach((row) => {
                let objValue = row.objs.filter(x => x.obj === obj)[0]?.value;
                if (objValue != null) {
                    objValues.push(objValue);
                }
            })

            let positiveColorRange = getColorRange(objValues, choroplethConfig, true);
            let negativeColorRange = getColorRange(objValues, choroplethConfig, false);
            const [min, max] = getBounds(objValues);

            const negativeColorScale = d3scaleSequential()
                .domain([min, max])
                .range(negativeColorRange);

            const positiveColorScale = d3scaleSequential()
                .domain([min, max])
                .range(positiveColorRange);

            rows.forEach((row) => {
                let rowObj = row.objs.filter(x => x.obj === obj)[0];
                if (rowObj != null && rowObj.value != null) {
                    rowObj.background = rowObj.value > 0 ? positiveColorScale(rowObj.value) : negativeColorScale(rowObj.value);
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

    const getTotalCount = (data) => {
      if (data != null && data.length > 0) {
          return data.reduce((n, {count}) => n + parseFloat(count), 0);
      }
      return null;
    }

    const getRowDetailsByChoroplethMethod = (geo, obj, chartConfig) => {
        let value = null, tooltip = null;
        let formatting = chartConfig.types['Value'].formatting;
        let selectedIndicator = props.indicators.filter((ind) => ind.geo === geo.code && ind.indicator === obj.indicator)[0];
        if (selectedIndicator == null) {
            return {value, tooltip, formatting};
        }
        const choroplethMethod = selectedIndicator.indicatorDetail?.choropleth_method;
        const primaryGroup = selectedIndicator.indicatorDetail.metadata?.primary_group;

        let indicatorData = selectedIndicator.indicatorDetail.data;
        if (obj.filters.length > 0){
          obj.filters.map(
            filterObj => {
              if (filterObj.group.length > 0 && filterObj.value.length > 0){
                indicatorData = indicatorData.filter(
                  f => f[filterObj.group] === filterObj.value
                )
              }
            }
          )
        }

        const data = indicatorData?.filter(x => x[primaryGroup] === obj.category);

        if (data === null && data.length === 0) {
          return {value, tooltip, formatting};
        }

        const primaryGroupTotal = getTotalCount(data);
        if (choroplethMethod === "subindicator"){
          const totalCount = getTotalCount(indicatorData);
          tooltip = d3format(formatting)(primaryGroupTotal);
          value = (primaryGroupTotal/totalCount);
          formatting = chartConfig.types['Percentage'].formatting;
        } else {
          value = primaryGroupTotal;
        }

        return {value, tooltip, formatting};
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

    const getCategoryChipText = useCallback(
      (category) => {
        if (category === null){
          return "No category selected"
        }
        return isResultHeaderFolded ? category : `Category: ${category}`;
      }, [
        isResultHeaderFolded
      ]
    )

    const getFilterChipText = useCallback(
      (filter) => {
        return isResultHeaderFolded ? filter.value : `${filter.group}: ${filter.value}`;
      }, [
        isResultHeaderFolded
      ]
    )

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
                          sx={{padding: "9px 10px"}}
                        ><b>Geography</b></TableCell>
                        {
                            props.indicatorObjs.map((column) => {
                                if (column.indicator !== '' && column.category !== '') {
                                    return (
                                        <TableCell
                                            data-testid={`table-header-${column.index}`}
                                            key={column.index}
                                            className={isResultHeaderFolded ? 'truncate-table-cell': 'untruncate-table-cell'}
                                            title={column.indicator + ' : ' + column.category}
                                            sx={{padding: "9px 10px"}}
                                        >
                                          <>
                                          <b>{column.indicator}</b>
                                            <Stack useFlexGap flexWrap="wrap" direction="row">
                                              <CategoryChip data-testid={`filter-chip-0`}>
                                                {getCategoryChipText(column.category)}
                                              </CategoryChip>
                                              {column.category !== null && column.filters.map(
                                                (item, idx) => {
                                                  if (item.group.length > 0 && item.value.length > 0){
                                                    return <FilterChip data-testid={`filter-chip-${idx+1}`}>{getFilterChipText(item)}</FilterChip>
                                                  }
                                                })
                                              }
                                            </Stack>
                                          </>
                                        </TableCell>
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
                                                const tooltip = row.objs.filter(x => x.obj === obj)[0]?.tooltip;
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
                                                          title={tooltip}
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
            <Grid container
                className={'margin-bottom-20'}
            >
                <SectionTitle>Resulting comparison</SectionTitle>
                {props.indicatorObjs.length > 0 &&

                  <Tooltip
                    title={isResultHeaderFolded ? "Expand header row" : "Collapse header row"}
                    arrow
                  >
                    <UnfoldButton
                      aria-label="delete"
                      size="small"
                      onClick={() => setIsResultHeaderFolded(!isResultHeaderFolded)}
                    >
                      {isResultHeaderFolded ? UnfoldMoreSvg : FoldMoreSvg}
                    </UnfoldButton>
                  </Tooltip>
                }

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

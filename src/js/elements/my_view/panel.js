import React, {useEffect, useState} from "react";
import MyViewHeader from "./my_view_header";
import ViewSettings from "./view_settings";
import {LoadingIconContainer, PanelContainer} from "./styled_elements";
import CircularProgress from '@mui/material/CircularProgress';

const Panel = (props) => {
    const [filteredIndicators, setFilteredIndicators] = useState([]);
    const [siteWideFilters, setSiteWideFilters] = useState([]);
    const [startedListening, setStartedListening] = useState(false);
    const [siteWideFiltersEnabled] = useState(props.siteWideFiltersEnabled);
    const [profileIndicators, setProfileIndicators] = useState([]);
    const [hiddenIndicators, setHiddenIndicators] = useState(props.controller.hiddenIndicators);
    const [allFiltersAreAvailable, setAllFiltersAreAvailable] = useState(true);
    const [filtersNotAvailableText, setFiltersNotAvailableText] = useState('');
    const [loading, setLoading] = useState(false);

    if (!startedListening) {
        setStartedListening(true);
        props.controller.on('my_view.filteredIndicators.updated', payload => {
            const fi = payload.payload.slice(0);
            setFilteredIndicators(prev => fi);
            fi.forEach(i => {
                if (allFiltersAreAvailable && !i.indicatorIsAvailable) {
                    setFiltersNotAvailableText('This indicator or filter has either been changed or deleted since the view you requested was shared. It is currently unavailable.');
                }
            })
        });

        props.controller.on('my_view.hiddenIndicatorsPanel.reload', payload => {
            setHiddenIndicators(payload.payload);
        });

        props.controller.on('my_view.siteWideFilters.updated', payload => {
            setSiteWideFilters(prev => payload.payload.siteWideFilters.slice(0));
        })
    }

    useEffect(() => {
        setLoading(true);
        props.api.loadProfileIndicators(props.profileId).then(
            (data) => {
                setLoading(false);
                setProfileIndicators(data);
            }).catch((response) => {
            throw(response);
        })
    }, [props.api, props.profileId, setProfileIndicators, setLoading]);

    useEffect(() => {
        let newFilteredIndicators = filteredIndicators.map(fi => {
            const currentIndicator = getCurrentIndicator(fi.indicatorId);
            fi.filters.forEach(fs => {
                fs.isFilterAvailable = checkIfFilterAvailable(currentIndicator, fs.group, fs.value);
                if (!fs.isFilterAvailable && allFiltersAreAvailable) {
                    setFiltersNotAvailableText('Some filters cannot be applied because the field or value is not available in the relevant data. This might be because the indicator data has been modified since the link was shared, or because the shared link was modified and is not compatible with the data.');
                }
            })

            return fi;
        })

        if (JSON.stringify(newFilteredIndicators) !== JSON.stringify(filteredIndicators)) {

            setFilteredIndicators(newFilteredIndicators);
        }

        setFilterAvailability();
    }, [profileIndicators, filteredIndicators])

    useEffect(() => {
        props.setFilterAvailability(allFiltersAreAvailable);
    }, [allFiltersAreAvailable])

    const checkIfFilterAvailable = (currentIndicator, group, value) => {
        let isFilterAvailable;
        if (currentIndicator === null) {
            isFilterAvailable = true;
        } else {
            isFilterAvailable = currentIndicator.groups.filter(x => {
                const isValueEqual = typeof(value) === "string" ? x.subindicators.includes(value) : value.every(item => x.subindicators.includes(item));
                return x.name === group && isValueEqual;
            }).length > 0;
        }

        return isFilterAvailable;
    }

    const setFilterAvailability = () => {
        let isAvailable = !filteredIndicators.some(x => !x.indicatorIsAvailable && x.filters.length > 0);
        if (isAvailable) {
            isAvailable = !filteredIndicators.some(x => x.filters.some(y => !y.isFilterAvailable))
        }

        setAllFiltersAreAvailable(isAvailable);
    }

    const getCurrentIndicator = (indicatorId) => {
        let currentIndicator = null;
        profileIndicators.forEach((category) => {
            category.subcategories.forEach((subcategory) => {
                subcategory.indicators.forEach((indicator) => {
                    if (currentIndicator === null && indicator.id === indicatorId) {
                        currentIndicator = indicator;
                    }
                })
            })
        })

        return currentIndicator;
    }

    const removeFilter = (filteredIndicator, selectedFilter) => {
        props.controller.triggerEvent('my_view.filteredIndicators.removed', {
            filteredIndicator,
            selectedFilter
        });
    }

    const updateHiddenIndicators = (indicatorId, action) => {
        props.controller.triggerEvent('my_view.hiddenIndicators.updated', {
            "indicatorId": indicatorId,
            "action": action
        });
    }

    const removeSiteWideFilter = (swf) => {
        props.controller.removeSiteWideFilter(swf.indicatorValue, swf.subIndicatorValue);
    }

    return (
        <PanelContainer
            className={'narrow-scroll'}
            data-test-id={'my-view-panel'}
        >
            <MyViewHeader/>
            {loading ?
                <LoadingIconContainer>
                    <CircularProgress/>
                </LoadingIconContainer>
                :
                <ViewSettings
                    filteredIndicators={filteredIndicators}
                    siteWideFilters={siteWideFilters}
                    profileIndicators={profileIndicators}
                    removeFilter={(fi, sf) => removeFilter(fi, sf)}
                    hiddenIndicators={hiddenIndicators}
                    updateHiddenIndicators={updateHiddenIndicators}
                    removeSiteWideFilter={(swf) => removeSiteWideFilter(swf)}
                    siteWideFiltersEnabled={siteWideFiltersEnabled}
                    allFiltersAreAvailable={allFiltersAreAvailable}
                    filtersNotAvailableText={filtersNotAvailableText}
                />
            }
        </PanelContainer>
    );
}

export default Panel;

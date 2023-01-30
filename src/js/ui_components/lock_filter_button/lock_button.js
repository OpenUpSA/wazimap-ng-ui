import React, {useEffect, useState} from "react";
import {styled} from "@mui/system";
import {Button} from "@mui/material";
import {LockButtonSvg, LockedButtonSvg, UnavailableLockButtonSvg} from "../../elements/my_view/svg_icons";

const LockButton = (props) => {
    const [startedListening, setStartedListening] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const [siteWideFilters, setSideWideFilters] = useState([]);
    const [rowIndicator, setRowIndicator] = useState(null);
    const [rowSubIndicator, setRowSubIndicator] = useState(null);
    const [isUnavailable, setIsUnavailable] = useState(false);
    const lockButtonSvg = LockButtonSvg;
    const lockedButtonSvg = LockedButtonSvg;
    const unavailableLockedButtonSvg = UnavailableLockButtonSvg;

    useEffect(() => {
        setIsUnavailable(props.filterRow.model.isUnavailable);
        setIsVisible(rowIndicator !== 'All indicators' && rowSubIndicator !== 'All values');
        checkAndSetIsLocked();
    }, [siteWideFilters, rowIndicator, rowSubIndicator])

    if (!startedListening) {
        setStartedListening(true);
        props.filterRow.on('filterRow.indicatorOrSubIndicatorSelected', payload => {
            setRowIndicator(props.filterRow.model.currentIndicatorValue);
            setRowSubIndicator(props.filterRow.model.currentSubindicatorValue);
        });

        props.filterRow.on('filterRow.siteWideFilters.updated', payload => {
            setSideWideFilters(prev => payload.slice(0));
        })

        props.filterRow.on('filterRow.created.setState', payload => {
            setSideWideFilters(payload.siteWideFilters);
            setRowIndicator(payload.currentIndicatorValue);
            setRowSubIndicator(payload.currentSubIndicatorValue);
        })

        props.filterRow.triggerEvent('filterRow.created.new');
    }

    const StyledButton = styled(Button)(() => ({
        minWidth: 'unset',
        paddingTop: '10px',
        paddingBottom: '10px',
        marginRight: '10px',
        width: '34px'
    }));

    const checkAndSetIsLocked = () => {
        let filterResult = siteWideFilters.filter(x => x.indicatorValue === rowIndicator && x.subIndicatorValue === rowSubIndicator);
        setIsLocked(filterResult.length > 0);
    }

    const lockButtonClicked = () => {
        let newVal = !isLocked;
        if (newVal) {
            props.filterRow.triggerEvent('filterRow.filter.locked');
        } else {
            props.filterRow.triggerEvent('filterRow.filter.unlocked');
        }
    }

    return (
        <StyledButton
            className={isVisible ? '' : 'hidden'}
            onClick={lockButtonClicked}
        >
            {isLocked ? (isUnavailable ? unavailableLockedButtonSvg : lockedButtonSvg) : lockButtonSvg}
        </StyledButton>
    );
}

export default LockButton;
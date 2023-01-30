import React, {useCallback, useEffect, useState} from "react";
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
        marginRight: '10px',
        width: '36px',
        height: '36px',
        padding: '0'
    }));

    const showMarkTooltip = useCallback(event => {
        props.tooltip.enableTooltip(
            $(event.target),
            isLocked ?
                (isUnavailable ? 'This filter cannot be applied here' : 'Remove site-wide filter')
                :
                (alreadySiteWide() ? 'Cannot set as site-wide filter' : 'Set as site-wide filter')
        );
    }, [isLocked, isUnavailable, siteWideFilters, rowIndicator]);

    const checkAndSetIsLocked = () => {
        let filterResult = siteWideFilters.filter(x => x.indicatorValue === rowIndicator && x.subIndicatorValue === rowSubIndicator);
        setIsLocked(filterResult.length > 0);
    }

    const lockButtonClicked = () => {
        if (isUnavailable) {
            return
        }

        let newVal = !isLocked;
        if (newVal) {
            props.filterRow.triggerEvent('filterRow.filter.locked');
        } else {
            props.filterRow.triggerEvent('filterRow.filter.unlocked');
        }
    }

    const alreadySiteWide = () => {
        let filterResult = siteWideFilters.filter(x => x.indicatorValue === rowIndicator);
        return filterResult.length > 0;
    }

    return (
        <StyledButton
            className={isVisible ? '' : 'hidden'}
            onClick={lockButtonClicked}
            onMouseEnter={showMarkTooltip}
        >
            {isLocked ?
                (isUnavailable ? unavailableLockedButtonSvg : lockedButtonSvg)
                :
                (alreadySiteWide() ? unavailableLockedButtonSvg : lockButtonSvg)}
        </StyledButton>
    );
}

export default LockButton;
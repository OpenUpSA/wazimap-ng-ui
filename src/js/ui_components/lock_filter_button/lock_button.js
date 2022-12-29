import React, {useState} from "react";
import {styled} from "@mui/system";
import {Button} from "@mui/material";
import {LockButtonSvg} from "../../elements/my_view/svg_icons";

const LockButton = (props) => {
    const [startedListening, setStartedListening] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const lockButtonSvg = LockButtonSvg;

    if (!startedListening) {
        props.filterRow.on('filterRow.indicatorOrSubIndicatorSelected', payload => {
            setIsVisible(payload.selectedIndicator && payload.selectedSubIndicator);
            setStartedListening(true);
        });
    }

    const StyledButton = styled(Button)(() => ({
        minWidth: 'unset',
        paddingTop: '10px',
        paddingBottom: '10px',
        marginRight: '10px'
    }));

    const lockButtonClicked = () => {
        console.log('lock clicked')
    }

    return (
        <StyledButton
            className={isVisible ? '' : 'hidden'}
            onClick={lockButtonClicked}
        >
            {lockButtonSvg}
        </StyledButton>
    );
}

export default LockButton;
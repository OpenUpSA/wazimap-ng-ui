import React from "react";
import {styled} from "@mui/system";
import Box from "@mui/material/Box";
import {ToggleSvg} from "./svg_icons";

const Toggle = (props) => {
    const toggleSvg = ToggleSvg;

    const ToggleContainer = styled(Box)(({theme}) => ({
        width: '44px',
        height: '44px',
        backgroundColor: '#fff',
        textAlign: 'center',
        cursor: 'pointer',
        alignContent: 'center',
        display: 'grid',
        boxShadow: '4px 0 8px 0 rgb(0 0 0 / 10%)',
        borderTopLeftRadius: '2px',
        borderBottomLeftRadius: '2px'
    }));

    const IconContainer = styled(Box)(({theme}) => ({
        margin: 'auto',
        marginTop: '3px'
    }));

    return (
        <ToggleContainer>
            <IconContainer>
                {toggleSvg}
            </IconContainer>
        </ToggleContainer>
    );
}

export default Toggle;
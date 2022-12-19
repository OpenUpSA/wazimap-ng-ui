import React from "react";
import {styled} from "@mui/system";
import Box from "@mui/material/Box";
import {CrossSvg, ToggleSvg} from "./svg_icons";

const MyViewHeader = (props) => {
    const toggleSvg = ToggleSvg;
    const crossSvg = CrossSvg;

    const Header = styled(Box)(() => ({
        fontStyle: 'normal',
        fontWeight: '700',
        fontSize: '1.2em',
        display: 'block',
        alignItems: 'center',
        padding: '22px',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
    }));

    const IconContainer = styled(Box)(() => ({
        marginRight: '15px',
        display: 'inline-block'
    }));

    const CloseButton = styled(Box)(() => ({
        float: 'right',
        cursor: 'pointer'
    }));

    const Title = styled(Box)(() => ({
        display: 'inline-block',
        lineHeight: '1.5em',
        verticalAlign: 'top'
    }));

    const setPanelInvisible = () => {
        document.getElementsByClassName('my-view')[0].classList.add('hidden');
    }

    return (
        <Header>
            <IconContainer>
                {toggleSvg}
            </IconContainer>
            <Title>
                My views
            </Title>
            <CloseButton
                onClick={setPanelInvisible}
            >
                {crossSvg}
            </CloseButton>
        </Header>
    );
}

export default MyViewHeader;
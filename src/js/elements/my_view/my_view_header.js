import React from "react";
import {CrossSvg, ToggleSvg} from "./svg_icons";
import {CloseButton, Header, IconContainer, MyViewTitle} from "./styled_elements";

const MyViewHeader = (props) => {
    const toggleSvg = ToggleSvg;
    const crossSvg = CrossSvg;

    const setPanelInvisible = () => {
        document.getElementsByClassName('my-view')[0].classList.add('hidden');
    }

    return (
        <Header>
            <IconContainer>
                {toggleSvg}
            </IconContainer>
            <MyViewTitle>
                My views
            </MyViewTitle>
            <CloseButton
                onClick={setPanelInvisible}
            >
                {crossSvg}
            </CloseButton>
        </Header>
    );
}

export default MyViewHeader;
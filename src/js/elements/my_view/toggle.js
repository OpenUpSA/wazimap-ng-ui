import React from "react";
import {ToggleSvg} from "./svg_icons";
import {ToggleContainer, ToggleIconContainer} from "./styled_elements";

const Toggle = (props) => {
    const toggleSvg = ToggleSvg;

    const setPanelVisible = () => {
        document.getElementsByClassName('my-view')[0].classList.remove('hidden');
    }

    return (
        <ToggleContainer
            onClick={setPanelVisible}
        >
            <ToggleIconContainer>
                {toggleSvg}
            </ToggleIconContainer>
        </ToggleContainer>
    );
}

export default Toggle;
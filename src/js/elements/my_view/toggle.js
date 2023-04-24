import React, {useEffect, useState} from "react";
import {ToggleSvg} from "./svg_icons";
import {ToggleContainer, ToggleIconContainer, UnavailableFilterToggleIconContainer} from "./styled_elements";

const Toggle = (props) => {
    const toggleSvg = ToggleSvg;
    const [allFiltersAreAvailable, setAllFiltersAreAvailable] = useState(props.allFiltersAreAvailable);

    useEffect(() => {
        if (props.allFiltersAreAvailable !== allFiltersAreAvailable) {
            setAllFiltersAreAvailable(props.allFiltersAreAvailable);
        }
    }, [props.allFiltersAreAvailable])

    const setPanelVisible = () => {
        document.getElementsByClassName('my-view')[0].classList.remove('hidden');
    }

    const renderToggleIcon = () => {
        if (allFiltersAreAvailable) {
            return (
                <ToggleIconContainer>
                    {toggleSvg}
                </ToggleIconContainer>
            )
        } else {
            return (
                <UnavailableFilterToggleIconContainer>
                    {toggleSvg}
                </UnavailableFilterToggleIconContainer>
            )
        }
    }

    return (
        <ToggleContainer
            data-test-id={'my-view-toggle'}
            onClick={setPanelVisible}
        >
            {renderToggleIcon()}
        </ToggleContainer>
    );
}

export default Toggle;
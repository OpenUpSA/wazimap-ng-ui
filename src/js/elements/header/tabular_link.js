import {Component} from '../../utils';
import {createRoot} from "react-dom/client";
import React from "react";
import {Button} from "@mui/material";
import {styled} from "@mui/system";


const StyledButton = styled(Button)(() => ({
    backgroundColor: '#39ad84',
}));

const TabularButton = () => {
    return (
        <StyledButton>
            <a href="tabular-comparison">Compare</a>
        </StyledButton>
    );
}


export class TabularLink extends Component {
    constructor(parent) {
        super(parent)
    }

    checkAndCreateButton() {
        const exists = document.getElementsByClassName('tabular-view-container').length > 0;

        if (!exists) {
            this.createButton();
        }
    }

    createButton() {
        let container = window.document.createElement('div');
        container.classList.add('tabular-button-container');
        window.document.getElementsByClassName('nav__content')[0].append(container);

        const root = createRoot(container);
        root.render(
            <TabularButton/>
        )
    }
}

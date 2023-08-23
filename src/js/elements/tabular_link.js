import {Component} from '../utils';
import {createRoot} from "react-dom/client";
import React from "react";
import {Button} from "@mui/material";
import {styled} from "@mui/system";


const StyledButton = styled(Button)(() => ({
    backgroundColor: '#39ad84',
    fontWeight: '700',
    fontSize: '14px',
    color: '#fff',
    textTransform: 'none',
    position: 'absolute',
    padding: '6px 12px',
    border: 'none',
    borderRadius: '2px',
    height: '43px',
    left: '0px',
    bottom: '0px',
    transition: 'all .2s',
    [`& svg`]: {
        marginRight: '5px'
    },
    '&:hover': {
        backgroundColor: '#39ad84',
        height: '48px',
        paddingBottom: '11px'
    }
}));

const TabularButton = () => {
    return (
        <StyledButton>
            <a href="tabular-comparison">Compare</a>
        </StyledButton>
    );
}


export class TabularLink extends Component {
    constructor(parent, isEnabled) {
        super(parent)
    }

    addButton() {
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
            <TabularButton />
        )
    }
}

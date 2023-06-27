import React from "react";
import {Button} from "@mui/material";
import {styled} from "@mui/system";


const StyledButton = styled(Button)(() => ({
    backgroundColor: '#39ad84',
    fontWeight: '700',
    color: '#fff',
    textTransform: 'none',
    right: 0,
    transform: 'rotate(-90deg) translate(0, -100%)',
    transformOrigin: '100% 0',
    position: 'absolute',
    bottom: '300px',
    '&:hover': {
        paddingBottom: '52px',
        backgroundColor: '#39ad84',
        color: '#fff'
    }
}));

const TutorialButton = (props) => {

    return (
        <StyledButton>
            test 123
        </StyledButton>
    );
}

export default TutorialButton;
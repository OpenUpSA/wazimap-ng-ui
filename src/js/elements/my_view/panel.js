import React from "react";
import {styled} from "@mui/system";
import Box from "@mui/material/Box";
import MyViewHeader from "./my_view_header";
import ViewSettings from "./view_settings";

const Panel = (props) => {
    const Container = styled(Box)(({theme}) => ({
        fontFamily: 'Roboto, sans-serif',
        position: 'fixed',
        width: '450px',
        backgroundColor: '#fff',
        right: '0',
        bottom: '0',
        top: '56px',
        zIndex: '999',
        boxShadow: '0 0 0 -1px rgb(0 0 0 / 20%), 1px 1px 6px -2px rgb(0 0 0 / 30%)'
    }));

    return (
        <Container>
            <MyViewHeader/>
            <ViewSettings/>
        </Container>
    );
}

export default Panel;
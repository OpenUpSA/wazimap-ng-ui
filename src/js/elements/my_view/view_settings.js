import React from "react";
import {styled} from "@mui/system";
import Box from "@mui/material/Box";
import {Accordion, AccordionDetails, AccordionSummary, Typography} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {IndicatorOptionsSvg} from "./svg_icons";

const ViewSettings = (props) => {
    const indicatorOptionsSvg = IndicatorOptionsSvg;

    const Container = styled(Box)(() => ({}));

    const Title = styled(Box)(() => ({
        backgroundColor: '#333',
        color: '#fff',
        padding: '10px',
        paddingLeft: '20px',
        fontWeight: '700'
    }));

    const StyledAccordionSummary = styled(AccordionSummary)(() => ({
        padding: '10px',
        paddingLeft: '20px',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)'
    }));

    const StyledTypography = styled(Typography)(() => ({
        color: '#707070',
        fontWeight: '600',
        letterSpacing: '0.06em',
        fontSize: '12px',
        lineHeight: 2
    }));

    const IconContainer = styled(Box)(() => ({
        marginRight: '15px',
        display: 'inline-block'
    }));

    const StyledAccordion = styled(Accordion)(() => ({
        boxShadow: 'unset'
    }));

    return (
        <Container>
            <Title>
                View settings
            </Title>
            <StyledAccordion TransitionProps={{unmountOnExit: true}}>
                <StyledAccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <IconContainer>
                        {indicatorOptionsSvg}
                    </IconContainer>
                    <StyledTypography>INDICATOR OPTIONS</StyledTypography>
                </StyledAccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                        malesuada lacus ex, sit amet blandit leo lobortis eget.
                    </Typography>
                </AccordionDetails>
            </StyledAccordion>
        </Container>
    );
}

export default ViewSettings;
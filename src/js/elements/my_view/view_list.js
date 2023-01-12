import React, {useEffect, useState} from "react";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {IndicatorOptionsSvg, TrashBinSvg} from "./svg_icons";
import ViewPanel from "./view_panel";
import {
    Container,
    FilteredIndicatorBox,
    FilteredIndicatorCard, HelpText,
    IconContainer,
    RemoveButton,
    StyledAccordion,
    StyledAccordionDetails,
    StyledAccordionSummary,
    StyledTypography, StyledTypographyWithBottomBorder,
    ViewSettingsTitle,
} from "./styled_elements"
import {Grid} from "@mui/material";
import {isEmpty} from 'lodash';

const ViewList = (props) => {

    return (
        <Container>
          {
            props.profileViews.map(
              (view, idx) =>
              <ViewPanel
                view={view}
                key={idx}
              />
            )
          }
        </Container>
    );
}

export default ViewList;

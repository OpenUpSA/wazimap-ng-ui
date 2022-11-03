import React, {useCallback} from 'react';
import {Component} from "../../../utils";

import { ThemeProvider } from '@mui/system';
import { useTheme } from '@mui/material/styles';
import {
    IconContainer, ParentContainer, TextContainer,
    Link, PanelIconSidebar,  PanelIconLink
} from './styledElements';


const RichDataPanelLink = (props) => {
  const theme = useTheme();

  const openRichDataPanel = useCallback(
    (event) => {
      props.parent.triggerEvent("open.rich_data.panel");
    },
    [
      props.parent
    ]
  )

  return (
    <ThemeProvider theme={theme}>
      <ParentContainer>
        <IconContainer>
          <PanelIconSidebar />
        </IconContainer>
        <TextContainer>
          <p>
            There are indicators for selected geography in the <Link
              href="#"
              onClick={() => openRichDataPanel()}
            > <PanelIconLink />Rich Data View
            </Link>
          </p>
        </TextContainer>
      </ParentContainer>
    </ThemeProvider>
  );
}

export default RichDataPanelLink;

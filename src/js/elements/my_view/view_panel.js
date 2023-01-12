import React, {useEffect, useState, useCallback} from "react";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {IndicatorOptionsSvg, TrashBinSvg} from "./svg_icons";
import {
    ProfileViewContainer,
} from "./styled_elements"
import {Grid} from "@mui/material";
import {isEmpty} from 'lodash';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import BookmarkIcon from '@mui/icons-material/Bookmark';

const ViewPanel = (props) => {

    const selectView = () => {
      if (!props.view.isSelected){
        props.view.selectView()
      }
    };

    return (
        <ProfileViewContainer
          isSelected={props.view.isSelected}
          onClick={selectView}
        >
          <Stack direction="row" spacing={2}>
            {props.view.name} {props.view.isSelected? "true": "false"}
          </Stack>
        </ProfileViewContainer>
    );
}

export default ViewPanel;

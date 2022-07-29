import React from 'react';
import Box from '@mui/material/Box';
import { SnackbarFilterLabelAvatar } from '../../../styled_components/mapchip/snackbar';

import './snackbar_content.module.css';


const SnackbarContent = (props) => {
  return (
    <div>
      <Box
        component="div"
        sx={{ display: 'inline'}}
      >
        <SnackbarFilterLabelAvatar>
          <i className="fa fa-repeat repeat-icon" />
        </SnackbarFilterLabelAvatar>
      </Box>
      <Box
        component="div"
        sx={{display: 'inline'}}
      >
          The selected filters have changed
      </Box>
    </div>
  );
}

export default SnackbarContent;

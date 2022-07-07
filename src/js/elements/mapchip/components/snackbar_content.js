import React from 'react';
import Box from '@mui/material/Box';
import { SnackbarFilterLableAvatar } from '../../../styled_components/mapchip/snackbar';

import './mapchip.module.css';


const SnackbarContent = (props) => {
  return (
    <div>
      <Box
        component="div"
        sx={{ display: 'inline'}}
      >
        <SnackbarFilterLableAvatar>
          <i className="fa fa-repeat repeat-icon" />
        </SnackbarFilterLableAvatar>
      </Box>
      <Box
        component="div"
        sx={{display: 'inline'}}
      >
          Filter selections have been reset
      </Box>
    </div>
  );
}

export default SnackbarContent;

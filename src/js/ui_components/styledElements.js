import { styled } from '@mui/system';
import Button from '@mui/material/Button';
import SliderUnstyled, { sliderUnstyledClasses } from '@mui/base/SliderUnstyled';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';


export const FilterDropdown = styled(Select)(({ theme }) => ({
  backgroundColor: 'rgba(0, 0, 0, 0.05);',
  border: 'none',
  boxShadow: 'none',
  color: '#2F2F2F',
  fontSize: '14px',
  fontStyle: 'normal',
  fontWeight: '400',
  lineHeight: 'normal',

  '& .MuiOutlinedInput-notchedOutline': {
      border: 0,
      padding: '0px'
    },

  '& .MuiSelect-select': {
    padding: '5px 6px 3px 12px',
    alignItems: 'center',
    gap: '4px',
    borderRadius: '4px',
  }
}));

export const FilterItem = styled(MenuItem)(({ theme }) => ({
  color: '#2F2F2F',
  fontSize: '14px',
  fontStyle: 'normal',
  fontWeight: '400',
  lineHeight: 'normal',
  width: '100%',
}));

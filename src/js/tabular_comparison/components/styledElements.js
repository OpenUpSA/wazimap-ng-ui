import { styled } from '@mui/system';
import Button from '@mui/material/Button';
import SliderUnstyled, { sliderUnstyledClasses } from '@mui/base/SliderUnstyled';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';

export const AddFilterButton = styled(Button)(({ theme }) => ({
  width: '100%',
  padding: '10px 13px',
  alignItems: 'center',
  borderRadius: '6px',
  background: '#F4F4F4',
  color: '#2F2F2F',
  fontSize: '13px',
  fontStyle: 'normal',
  fontWeight: '400',
  lineHeight: 'normal',
  letterSpacing: 'normal',
  "&:hover": {
    backgroundColor: '#e3e2e2'
  }
}));

export const FilterDropdown = styled(Select)(({ theme }) => ({
  fontSize: '13px'
}));

export const FilterItem = styled(MenuItem)(({ theme }) => ({
  fontSize: '13px'
}));

export const RemoveFilterButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: "#FFF",
  "&:hover": {
      backgroundColor: "#FFF"
    }
}));

import { styled } from '@mui/system';
import Button from '@mui/material/Button';
import SliderUnstyled, { sliderUnstyledClasses } from '@mui/base/SliderUnstyled';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';

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

export const UnfoldButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: "#E7E7E7",
  marginLeft: "auto",
  padding: "4px 7px",
  "&:hover": {
      backgroundColor: "#E7E7E7"
    }
}));

export const CategoryChip = styled('div')(({ theme }) => ({
  display: "flex",
  padding: "2px 6px",
  justifyContent: "center",
  alignItems: "center",
  gap: "10px",
  borderRadius: "100px",
  background: "#2F2F2F",
  color: "#FFF",
  fontSize: "10px",
  fontStyle: "normal",
  fontWeight: "400",
  lineHeight: "100%",
  height: "fit-content",
  marginRight: "4px",
  marginBottom: "4px",
}));

export const FilterChip = styled('div')(({ theme }) => ({
  display: "flex",
  padding: "2px 6px",
  justifyContent: "center",
  alignItems: "center",
  gap: "10px",
  borderRadius: "100px",
  background: "#E1E1E1",
  color: "#2F2F2F",
  fontSize: "10px",
  fontStyle: "normal",
  fontWeight: "400",
  lineHeight: "100%",
  height: "fit-content",
  marginRight: "4px",
  marginBottom: "4px",
}));

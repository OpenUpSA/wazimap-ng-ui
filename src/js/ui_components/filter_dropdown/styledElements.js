import { styled } from '@mui/system';

import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CheckIcon from '@mui/icons-material/Check';

export const CustomSelect = styled(Select)(({ theme }) => ({
  backgroundColor: 'rgba(0, 0, 0, 0.05);',
  border: 'none',
  boxShadow: 'none',
  color: '#2F2F2F',
  fontSize: '14px',
  fontStyle: 'normal',
  fontWeight: '400',
  lineHeight: 'normal',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',

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

export const FilterItemValueContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  width: '100%'
}));

export const FilterItemIconContainer = styled(Box)(({ theme }) => ({
  marginLeft: 'auto',
  fontSize: '16px'
}));

export const DrillDownIconContainer = styled('span')(({ theme }) => ({
  float: 'right',
  height: '20px'
}));

export const SelectedItem = styled(CheckIcon)(({ theme }) => ({
  fontSize: '14px',
  marginLeft: '5px',
  color: '#707070'
}));

export const UnavailableText = styled('em')(({ theme }) => ({
  textDecoration: 'line-through'
}));

import React from 'react';
import { styled } from '@mui/system';
import SvgIcon from '@mui/material/SvgIcon';
import Box from '@mui/material/Box';


export const ParentContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridAutoColumns: '1fr',
  borderRadius: 2,
  backgroundColor: '#e9eaeb',
  padding: '15px',
  marginTop: '20px',
  border: '1px solid #dbdbdb',
}));

export const IconContainer = styled(Box)(({ theme }) => ({
  gridRow: '1',
  gridColumn: '1/2'
}));

export const TextContainer = styled(Box)(({ theme }) => ({
  gridRow: '1',
  gridColumn: 'span 5',
  '& p': {
    fontSize: '12px',
    lineHeight: '100%',
  }
}));

export const Link = styled('a')(({ theme }) => ({
  color: '#39ad84'
}));

const PanelIcon = (props) => {
  return (
    <SvgIcon {...props}>
      <path
        fill="currentColor"
        d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"
      ></path>
    </SvgIcon>
  );
}

export const PanelIconSidebar = styled(PanelIcon)(({ theme }) => ({
  fontSize: '30px'
}));

export const PanelIconLink = styled(PanelIcon)(({ theme }) => ({
  fontSize: '18px',
  verticalAlign: 'bottom',
  color: '#39ad84'
}));

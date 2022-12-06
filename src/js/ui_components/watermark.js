import React from "react";
import {styled} from "@mui/system";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import logo from '../../images/powered-by-wazimap-logo.svg';

const Watermark = (props) => {
    const WatermarkContainer = styled(Box)(({theme}) => ({
        width: 'auto',
        padding: '10px',
        display: 'flex',
        paddingLeft: 0
    }));

    const PoweredBy = styled(Box)(({theme}) => ({
        fontSize: '12px',
        lineHeight: 1,
        borderRadius: '3px',
        backgroundColor: 'rgba(0, 0, 0, 0.06)',
        color: 'rgba(9, 45, 40, 0.7)',
        padding: '12px'
    }));

    const Logo = styled(Link)(({theme}) => ({
        padding: '8px 10px',
        borderRadius: '3px',
        backgroundColor: '#e2e2e2',
        '&:hover': {
            backgroundColor: '#d8d8d8'
        }
    }));

    return (
        <WatermarkContainer>
            <PoweredBy>
                Powered by:
            </PoweredBy>
            <Logo
                href={'https://wazimap-ng.com/'}
                target={'_blank'}
            >
                <img
                    src={logo}
                    loading={'lazy'}
                    width={'100px'}
                >
                </img>
            </Logo>
        </WatermarkContainer>
    );
}

export default Watermark;
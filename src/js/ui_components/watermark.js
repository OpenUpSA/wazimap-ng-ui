import React from "react";
import {styled} from "@mui/system";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";

const Watermark = (props) => {
    const WatermarkContainer = styled(Box)(({theme}) => ({
        width: 'auto',
        padding: '10px',
        display: 'flex',
        paddingLeft: 0
    }));

    const PoweredBy = styled(Box)(({theme}) => ({
        fontSize: '9px',
        lineHeight: '36px',
        borderRadius: '3px',
        backgroundColor: 'rgba(0, 0, 0, 0.06)',
        color: 'rgba(9, 45, 40, 0.7)',
        padding: '0px 4px'
    }));

    const Logo = styled(Link)(({theme}) => ({
        padding: '7px 10px',
        borderRadius: '3px',
        backgroundColor: 'rgba(0, 0, 0, 0.06)',
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
                    src={require('../../images/powered-by-wazimap-logo.svg')}
                    loading={'lazy'}
                    width={'80px'}
                >
                </img>
            </Logo>
        </WatermarkContainer>
    );
}

export default Watermark;
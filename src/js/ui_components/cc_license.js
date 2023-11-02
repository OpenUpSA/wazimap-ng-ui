import React from "react";
import {styled} from "@mui/system";
import Box from "@mui/material/Box";

const CcLicense = (props) => {
    const LicenseContainer = styled(Box)(({theme}) => ({
        width: 'auto',
        padding: '10px',
        display: 'flex',
        paddingLeft: 0
    }));

    return (
        <LicenseContainer>
            @ 2023. This work is openly licensed via <a href={'https://creativecommons.org/licenses/by-nc-nd/4.0'}
                                                        target={'_blank'}>CC BY-NC-ND 4.0</a>
        </LicenseContainer>
    );
}

export default CcLicense;
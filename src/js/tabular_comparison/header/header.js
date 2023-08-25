import React from "react";
import WaziLink from "./wazi-link";
import {Grid} from "@mui/material";
import Logo from "./logo";

const Header = (props) => {
    return (
        <div className={"header"}>
            <Grid container>
                <Grid
                    xs={6}
                    item={true}
                >
                    <div className={'logo'}>
                        <Logo
                            api={props.api}
                            profileId={props.profileId}
                            profileConfig={props.profileConfig}
                        />
                    </div>
                </Grid>
                <Grid
                    xs={6}
                    item={true}
                    justifyContent="flex-end"
                    alignItems="center"
                    container
                >
                    <div className={'tabular-header-containers'}>
                        <WaziLink/>
                    </div>
                </Grid>
            </Grid>
        </div>
    );
}

export default Header;
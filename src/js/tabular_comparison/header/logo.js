import React, {useEffect, useState} from "react";

const Logo = (props) => {
    const [logo, setLogo] = useState(null);

    useEffect(() => {
        if (logo != null || props.api == null) {
            return;
        }

        props.api.getProfileWithoutVersion(props.profileId, 'ZA').then((data) => {
            setLogo(data.profile.logo);
        })
    })

    return (
        <div className={'header-profile-logo'}>
            <img
                className={'profile-logo'}
                src={logo == null ? '' : logo.image} alt={''}
            />
        </div>
    );
}

export default Logo;
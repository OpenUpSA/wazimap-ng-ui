import React, {useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import {SnackbarProvider, useSnackbar} from 'notistack';

import './snackbar.modules.css';

const mountPoint = document.createElement('div');
const root = createRoot(mountPoint);

const ShowSnackbar = ({message, config}) => {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    useEffect(() => {
            let key = enqueueSnackbar(message, {
                ...config,
                onClick: () => closeSnackbar(key)
            });
        },
        [message, config]
    );
    return null;
};

const RenderSnackbar = (props) => {
    const {maxSnack, config, msg} = props;
    return (
        <SnackbarProvider
            maxSnack={maxSnack || 3}
            classes={{
                containerRoot: config.rootcomponentclass || []
            }}
        >
            <ShowSnackbar message={msg} config={config}/>
        </SnackbarProvider>
    );
}

export default {
    default: function (msg, config = {}, el) {
        this.toast(msg, 'default', config, el,);
    },
    success: function (msg, config = {}, el) {
        this.toast(msg, 'success', config, el);
    },
    warning: function (msg) {
        this.toast(msg, 'warning', config, el);
    },
    info: function (msg) {
        this.toast(msg, 'info', config, el);
    },
    error: function (msg) {
        this.toast(msg, 'error', config, el);
    },
    toast: function (msg, variant, config = {}, el) {
        const {maxSnack, ...updatedConfig} = config;
        config = {variant: variant, ...updatedConfig,};

        if (el !== undefined) {
            el.appendChild(mountPoint);
        } else {
            document.body.appendChild(mountPoint);
        }

        root.render(
            <RenderSnackbar
                maxSnack={maxSnack}
                config={config}
                msg={msg}
            />
        );

        return [];
    }
};

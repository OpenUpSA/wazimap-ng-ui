import React from 'react';
import { createRoot } from 'react-dom/client';
import { SnackbarProvider, useSnackbar } from 'notistack';

import './snackbar.modules.css';

const mountPoint = document.createElement('div');
const root = createRoot(mountPoint);

export default {
  default: function(msg, config = {}, el) {
    this.toast(msg, 'default', config, el, );
  },
  success: function(msg, config = {}, el) {
    this.toast(msg, 'success', config, el);
  },
  warning: function(msg) {
    this.toast(msg, 'warning', config, el);
  },
  info: function(msg) {
    this.toast(msg, 'info', config, el);
  },
  error: function(msg) {
    this.toast(msg, 'error', config, el);
  },
  toast: function(msg, variant, config = {}, el) {
    config = {
      variant: variant,
      ...config,
    }
    const ShowSnackbar = ({ message }) => {
      const { enqueueSnackbar } = useSnackbar();
      enqueueSnackbar(message, config);
      return null;
    };

    if (el !== undefined){
      el.appendChild(mountPoint);
    } else {
      document.body.appendChild(mountPoint);
    }
    root.render(
      <SnackbarProvider
        maxSnack={3}
        classes={{
          containerRoot: config.rootcomponentclass || []
        }}
      >
        <ShowSnackbar message={msg} variant={config.variant} />
      </SnackbarProvider>
    );
  }
};

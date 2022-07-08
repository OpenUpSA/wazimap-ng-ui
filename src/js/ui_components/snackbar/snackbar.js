import React from 'react';
import ReactDOM from 'react-dom';
import { SnackbarProvider, useSnackbar } from 'notistack';

import './snackbar.modules.css';

const mountPoint = document.createElement('div');
document.body.appendChild(mountPoint);

export default {
  default: function(msg, config = {}, el = mountPoint) {
    this.toast(msg, 'default', config, el, );
  },
  success: function(msg, config = {}, el = mountPoint) {
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
  toast: function(msg, variant, config = {}, el = mountPoint) {
    config = {
      variant: variant,
      ...config,
    }
    const ShowSnackbar = ({ message }) => {
      const { enqueueSnackbar } = useSnackbar();
      enqueueSnackbar(message, config);
      return null;
    };
    ReactDOM.render(
      <SnackbarProvider
        maxSnack={3}
        classes={{
          containerRoot: config.rootcomponentclass || []
        }}
      >
        <ShowSnackbar message={msg} variant={config.variant} />
      </SnackbarProvider>,
      el
    );
  }
};

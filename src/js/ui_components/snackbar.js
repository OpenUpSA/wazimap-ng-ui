import React from 'react';
import ReactDOM from 'react-dom';
import { SnackbarProvider, useSnackbar } from 'notistack';

import './snackbar.modules.css';

const mountPoint = document.createElement('div');
document.body.appendChild(mountPoint);

export default {
  default: function(msg, config = {}, el = mountPoint) {
    config = {
      variant: 'default',
      anchorOrigin: { horizontal: 'center', vertical: 'bottom' },
      ...config,
    }
    this.toast(msg, config, el);
  },
  success: function(msg, config = {}, el = mountPoint) {
    config = {
      variant: 'success',
      ...config,
    }
    this.toast(msg, config, el);
  },
  warning: function(msg) {
    config = {
      variant: 'warning',
      ...config,
    }
    this.toast(msg, config, el);
  },
  info: function(msg) {
    config = {
      variant: 'info',
      ...config,
    }
    this.toast(msg, config, el);
  },
  error: function(msg) {
    config = {
      variant: 'error',
      ...config,
    }
    this.toast(msg, config, el);
  },
  toast: function(msg, config = {}, el = mountPoint) {
    const ShowSnackbar = ({ message }) => {
      const { enqueueSnackbar } = useSnackbar();
      enqueueSnackbar(message, config);
      return null;
    };
    ReactDOM.render(
      <SnackbarProvider
        maxSnack={3}
        classes={{
          containerRoot: config.rootcomponentclass
        }}
      >
        <ShowSnackbar message={msg} variant={config.variant} />
      </SnackbarProvider>,
      el
    );
  }
};

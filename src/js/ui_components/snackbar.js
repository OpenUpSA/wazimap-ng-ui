import React from 'react';
import ReactDOM from 'react-dom';
import { SnackbarProvider, useSnackbar } from 'notistack';

const mountPoint = document.createElement('div');
document.body.appendChild(mountPoint);

export default {
  mapchipFilterChange: function(msg) {
    let config = {
      autoHideDuration: 2000,
      sx: {
        "& .SnackbarContent-root": {
          color: "black",
          backgroundColor: "white",
          minWidth: "auto !important",
          padding: "3px 10px 3px 10px"
        }
      }
    }
    this.toast(msg, '', config);
  },
  success: function(msg) {
    this.toast(msg, 'success');
  },
  warning: function(msg) {
    this.toast(msg, 'warning');
  },
  info: function(msg) {
    this.toast(msg, 'info');
  },
  error: function(msg) {
    this.toast(msg, 'error');
  },
  toast: function(msg, variant = 'default', config = {}) {
    const ShowSnackbar = ({ message }) => {
      const { enqueueSnackbar } = useSnackbar();

      config = {
        variant: variant,
        ...config,
      }
      enqueueSnackbar(message, config);
      return null;
    };
    ReactDOM.render(
      // see https://github.com/iamhosseindhv/notistack#snackbarprovider
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <ShowSnackbar message={msg} variant={variant} />
      </SnackbarProvider>,
      mountPoint
    );
  }
};

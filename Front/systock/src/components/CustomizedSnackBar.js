import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import PropTypes from 'prop-types';
import { Slide } from '@mui/material';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function CustomizedSnackbars({open, severity, snackMessage, autoHide, handleClose}) {

  return (
    <Slide direction="left" in={open} mountOnEnter unmountOnExit>
      <Snackbar open={open} autoHideDuration={autoHide} onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}>
          <Alert severity={severity}>{snackMessage}</Alert>
        </Snackbar>
    </Slide>
  );
}

CustomizedSnackbars.defaultProps = {
  autoHide: 3000
};

CustomizedSnackbars.propTypes = {
  open: PropTypes.bool,
  severity: PropTypes.string,
  snackMessage: PropTypes.string,
  autoHide: PropTypes.number,
  handleClose: PropTypes.func
};
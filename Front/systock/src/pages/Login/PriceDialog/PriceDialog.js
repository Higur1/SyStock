import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide } from "@mui/material";
import React from "react";
import PropTypes from 'prop-types';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const PriceDialog = (props) => {

  const { handleClose } = props;

  return (
    <Dialog
      open
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{"pRICES HERE?"}</DialogTitle>
      <DialogContent>
      </DialogContent>
    </Dialog>
  );
}

PriceDialog.propTypes = {
  handleClose: PropTypes.func.isRequired
}

export default PriceDialog;
import React from "react";
import PropTypes from 'prop-types';

import { Button, styled } from "@mui/material";

const ButtonStyled = styled(Button)({
  borderRadius: 16
});

const ButtonCustom = (props) => {

  const { label, onClick, variant, style, fullWidth, color, disabled } = props;

  return (
    <ButtonStyled 
      variant={variant}
      onClick={onClick}
      fullWidth={fullWidth}
      style={{...style}}
      color={color}
      disabled={disabled}
    >
      {label}
    </ButtonStyled>
  );
}

ButtonCustom.defaultProps = {
  fullWidth: false
}

ButtonCustom.propTypes = {
  label: PropTypes.string.isRequired,
  variant: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  style: PropTypes.object,
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  color: PropTypes.string
}

export default ButtonCustom;
import React from "react";
import PropTypes from 'prop-types';

import { TextField } from "@mui/material";

import styled from 'styled-components';

const CssTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    // borderRadius: 16,
  },
});

const InputCustom = (props) => {

  const { label, autoFocus, onChange, placeholder, value, required, fullWidth, InputProps, color, type } = props; 

  return (
    // <FormControl variant="filled">
    //   <InputLabel htmlFor="input-with-icon-adornment">
    //     {label}
    //   </InputLabel>
    //   <Input
    //     id="input-with-icon-adornment"
    //     onChange={onChange}
    //     startAdornment={startAdornment ? startAdornment : null}
    //     autoFocus={autoFocus}
    //     fullWidth={fullWidth}
    //     placeholder={placeholder}
    //     value={value}
    //     required={required}
    //   />
    // </FormControl>
    <CssTextField
      label={label}
      // sx={{ m: 1, width: '25ch' }}
      InputProps={InputProps}
      onChange={onChange}
      autoFocus={autoFocus}
      fullWidth={fullWidth}
      value={value}
      type={type}
      required={required}
      placeholder={placeholder}
      color={color}
    />
  );
};

InputCustom.defaultProps = {
  autoFocus: false,
  placeholder: ''
}

InputCustom.propTypes = {
  label: PropTypes.string.isRequired,
  autoFocus: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  required: PropTypes.bool,
  fullWidth: PropTypes.bool,
  InputProps: PropTypes.object,
  color: PropTypes.string,
  type: PropTypes.string
};

export default InputCustom;
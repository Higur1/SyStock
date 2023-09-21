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
      {...props}
    />
  );
};

InputCustom.defaultProps = {
  autoFocus: false,
  placeholder: ''
}

InputCustom.propTypes = {
  label: PropTypes.string,
  autoFocus: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  required: PropTypes.bool,
  fullWidth: PropTypes.bool,
  InputProps: PropTypes.object,
  inputProps: PropTypes.object,
  style: PropTypes.object,
  color: PropTypes.string,
  type: PropTypes.string,
  error: PropTypes.bool
};

export default InputCustom;
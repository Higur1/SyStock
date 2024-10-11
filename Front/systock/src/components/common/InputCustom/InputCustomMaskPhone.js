import React from "react";
import PropTypes from 'prop-types';

import { IMaskInput } from "react-imask";
import InputCustom from "./InputCustom";

const TextMaskCustom  = React.forwardRef(function TextMaskCustom(props, ref) {
  const { onChange, ...other } = props;

  return (
    <IMaskInput
      {...other}
      mask="(##) #####-####"
      definitions={{
        '#': /[0-9]/,
      }}
      inputRef={ref}
      onAccept={(value) => onChange(value)}
      overwrite
      placeholder="(00) 00000-0000"
    />
  );
});

TextMaskCustom.propTypes = {
  onChange: PropTypes.func.isRequired,
};   


export default function InputCustomMaskPhone(props) {

  return (
    <>
      <InputCustom
        {...props}
        InputProps={{
          inputComponent: TextMaskCustom
        }}
      />
    </>
  );
}
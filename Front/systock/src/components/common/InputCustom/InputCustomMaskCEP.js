import React from "react";
import PropTypes from 'prop-types';

import { IMaskInput } from "react-imask";
import InputCustom from "./InputCustom";
import { useEffect } from "react";

const TextMaskCustom  = React.forwardRef(function TextMaskCustom(props, ref) {
  const { onChange, ...other } = props;

  return (
    <IMaskInput
      {...other}
      mask="#####-###"
      placeholder="00000-000"
      definitions={{
        '#': /[0-9]/,
      }}
      inputRef={ref}
      onAccept={(value) => onChange(value)}
      overwrite
    />
  );
});

TextMaskCustom.propTypes = {
  onChange: PropTypes.func.isRequired,
};   


export default function InputCustomMaskCEP(props) {

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
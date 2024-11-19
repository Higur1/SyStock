import React from "react";
import { NumericFormat } from "react-number-format";

export function NumericFormatCustom(props) {
  const { onChange, ...other } = props;

  return (
    <NumericFormat
      {...other}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator="."
      decimalSeparator=","
      valueIsNumericString
      prefix="R$ "
    />
  );
}
/* eslint-disable react/prop-types */
import { Button, ButtonGroup } from '@mui/material'
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';

export default function ButtonGroupCustom(props) {

  const [selected, setSelected] = useState(props.value);

  useEffect(() => {
    if(selected === null) return;

    props.onChange(selected);
  }, [selected]);

  

  function handleChange(id) {
    setSelected(id);
  }

  return (
    <ButtonGroup variant="contained" color="primary">
      {props.options.map(opt => (
        <Button key={opt.id} onClick={() => handleChange(opt.id)} style={{background: opt.id === selected ? '#3c5b79' : '#4a7a9d'}}>{opt.label}</Button>
      ))}
    </ButtonGroup>

  )
}

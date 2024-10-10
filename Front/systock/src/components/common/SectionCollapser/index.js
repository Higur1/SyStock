import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import { Checkbox, Collapse, IconButton } from '@mui/material'
import React, { useState } from 'react'

export default function SectionCollapser({children, title}) {

  const [checkbox, setCheckbox] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 16, padding: "8px 16px", borderRadius: 12, width: "100%", height: "100%", border: '1px solid #DCDCDC'}}>
      <div style={{width: "100%", display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
          <Checkbox value={checkbox} checked={checkbox} onChange={e => setCheckbox(e.target.value)}/>
          <span>{title}</span>
        </div>
        <IconButton onClick={() => setOpen(prev => !prev)}>
          {open ? (<ArrowDropUp />) : (<ArrowDropDown />)}
        </IconButton>      
      </div>
      <Collapse in={open} unmountOnExit>
        {children}
      </Collapse>
    </div>
    
  )
}

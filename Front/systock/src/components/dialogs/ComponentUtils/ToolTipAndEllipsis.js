import { Tooltip } from "@mui/material";
import PropTypes from 'prop-types';
import React, { useRef } from "react";

export default function TooltipAndEllipsis(props) {

  let refInfo = useRef(null);
  
  const setRef = e => {
    if(e !== null) {
      refInfo = e;
    }
  }

  return (
    <Tooltip
      placement="top-start"
      disableHoverListener={refInfo !== null ? refInfo.scrollWidth <= refInfo.offsetWidth: false} 
      title={
        <div style={{wordWrap: 'break-word', fontSize: 16, padding: 0}}>
          {props.item}
        </div>
      }
    >
      <div style={{display: 'flex', flexGrow: 1, alignItems: 'center', width: '100%'}}>
        <div ref={setRef} style={{width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: props.centerText ? 'center' : 'left'}}>
          {props.item}
        </div>
      </div>
    </Tooltip>
  )
}

TooltipAndEllipsis.propTypes = {
  item: PropTypes.string,
  centerText: PropTypes.bool
}
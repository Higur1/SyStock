import { Tooltip } from "@mui/material";
import React, { useRef, useState } from "react";

export default function TooltipAndEllipsis(props) {

  let refInfo = useRef(null);
  const [rerender, setRerender] = useState(false);

  
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
        <div ref={setRef} style={{width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
          {props.item}
        </div>
      </div>
    </Tooltip>
  )
}
import { CircularProgress } from "@mui/material";
import React from "react";

const CircularLoading = () => {

  return (
    <div style={{ width: "100%", height: "100%", display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress />
    </div>
  );
};

export default CircularLoading;
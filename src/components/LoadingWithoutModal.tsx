'use client'

import React from "react";

import {CircularProgress, Typography} from "@mui/material";

const LoadingWithoutModal = ({ message = 'Chargement en cours...', padding = 'p-36' }) => {
  return (
    <div className={`flex flex-col items-center p-36 justify-items-center ${padding}`}>
      <CircularProgress size={36} />
      <Typography variant="h6" mt={2}>
        {message}
      </Typography>
    </div>
  );
}

export default  LoadingWithoutModal

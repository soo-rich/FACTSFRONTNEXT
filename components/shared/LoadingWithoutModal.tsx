"use client";

import React from "react";
import { CircularProgress } from "@heroui/progress";

const LoadingWithoutModal = ({
  message = "Chargement en cours...",
  padding = "p-36",
}) => {
  return (
    <div
      className={`flex flex-col items-center p-36 justify-items-center ${padding}`}
    >
      <CircularProgress size={"lg"} />
      <h6 className={"mt-2"}>{message}</h6>
    </div>
  );
};

export default LoadingWithoutModal;

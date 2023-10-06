import React from "react";

const ServerError = ({ children }) => {
  return <p className="text-red-100 text-xs mt-1">{children}</p>;
};

export default ServerError;

import React from "react";

const InputLabel = ({ children, htmlFor, className }) => {
  return (
    <label htmlFor={htmlFor} className={`block text-gray-100 text-sm ${className}`}>
      {children}
    </label>
  );
};

export default InputLabel;

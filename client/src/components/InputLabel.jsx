import React from "react";

const InputLabel = ({ children, htmlFor }) => {
  return (
    <label htmlFor={htmlFor} className="text-gray-400 text-mds">
      {children}
    </label>
  );
};

export default InputLabel;

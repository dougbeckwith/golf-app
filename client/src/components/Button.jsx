import React from "react";

const Button = ({ disabled, onClick, children }) => {
  return (
    <button
      disabled={disabled}
      type="button"
      onClick={onClick}
      className="px-4 py-2 text-sm font-medium rounded-md shadow-sm text-gray-300 bg-blue-400 hover:bg-blue-300 ">
      {children}
    </button>
  );
};

export default Button;

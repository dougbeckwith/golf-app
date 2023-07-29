import React from "react";

const Button = ({ disabled, onClick, children, className }) => {
  return (
    <button
      disabled={disabled}
      type="button"
      onClick={onClick}
      className={`w-full p-2 rounded-md shadow-sm text-gray-300 bg-blue-400 hover:bg-blue-300 cursor-pointer ${className}`}>
      {children}
    </button>
  );
};

export default Button;

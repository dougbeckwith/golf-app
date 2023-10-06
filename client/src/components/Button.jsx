import React from "react";

const Button = ({ disabled, onClick, children, styles, color }) => {
  const buttonStyles = `px-2 py-1 text-sm rounded-md shadow-sm text-gray-100 bg-${color}-300 hover:bg-${color}-200 cursor-pointer ${styles}`;
  return (
    <button disabled={disabled} type="button" onClick={onClick} className={buttonStyles}>
      {children}
    </button>
  );
};

export default Button;

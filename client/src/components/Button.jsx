import React from "react";

const Button = ({ disabled, onClick, children, styles, color }) => {
  const buttonStyles = `p-2 rounded-md shadow-sm text-gray-100 bg-${color}-100 hover:bg-${color}-200 cursor-pointer ${styles}`;
  return (
    <button disabled={disabled} type="button" onClick={onClick} className={buttonStyles}>
      {children}
    </button>
  );
};

export default Button;

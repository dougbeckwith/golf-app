import React from "react";

const ButtonSmall = ({ disabled, onClick, children, styles, color }) => {
  const buttonStyles = `text-xs font-medium px-2 py-1 rounded-md shadow-sm text-gray-100 bg-${color}-300 hover:bg-${color}-200 cursor-pointer ${styles}`;
  return (
    <button disabled={disabled} type="button" onClick={onClick} className={buttonStyles}>
      {children}
    </button>
  );
};

export default ButtonSmall;

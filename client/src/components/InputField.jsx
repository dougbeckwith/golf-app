import React from "react";

const InputField = ({ value, onChange, onBlur, name, innerRef, type }) => {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onBlur={onBlur}
      onChange={onChange}
      ref={innerRef}
      className="text-gray-200 bg-dark-200 text-sm w-full p-2 rounded-md border-2 border-dark-200  focus:border-blue-100 focus:outline-none"
    />
  );
};

export default InputField;

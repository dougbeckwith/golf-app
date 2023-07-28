import React from "react";

const InputField = ({ value, onChange, onBlur, name }) => {
  return (
    <input
      name={name}
      value={value}
      onBlur={onBlur}
      onChange={onChange}
      className="bg-dark-200 p-3 rounded-md border-2 border-dark-200 focus:outline-none focus:border-blue-400"
    />
  );
};

export default InputField;

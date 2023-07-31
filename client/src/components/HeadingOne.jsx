import React from "react";

const HeadingOne = ({ children, className }) => {
  return (
    <h1 className={`text-gray-100 text-xl md:text-2xl font-semibold ${className}`}>{children}</h1>
  );
};

export default HeadingOne;

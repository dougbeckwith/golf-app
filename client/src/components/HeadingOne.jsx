import React from "react";

const HeadingOne = ({ children, className }) => {
  return (
    <h1
      className={`inline-block border-b-[3px] border-teal-200 text-gray-200 text-xl md:text-2xl lg:text-3xl font-semibold ${className}`}>
      {children}
    </h1>
  );
};

export default HeadingOne;

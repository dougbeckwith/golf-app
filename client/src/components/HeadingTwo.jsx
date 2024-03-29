import React from "react";

const HeadingTwo = ({ children, styles }) => {
  return (
    <h1
      className={`inline-block border-b-2 border-teal-200 text-gray-300 text-md md:text-lg lg:text-lg font-semibold ${styles}`}>
      {children}
    </h1>
  );
};

export default HeadingTwo;

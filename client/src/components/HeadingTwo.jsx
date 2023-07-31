import React from "react";

const HeadingTwo = ({ children, styles }) => {
  return (
    <h1
      className={`inline border-b-2 border-blue-100 text-gray-100 text-xl font-semibold ${styles}`}>
      {children}
    </h1>
  );
};

export default HeadingTwo;

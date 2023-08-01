import React from "react";

const HeadingTwo = ({ children, styles }) => {
  return <h1 className={`inline text-gray-100 text-2xl font-semibold ${styles}`}>{children}</h1>;
};

export default HeadingTwo;

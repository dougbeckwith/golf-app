import React from "react";

const Card = ({ children }) => {
  const classes = `max-w-[400px] sm:mt-5 sm:w-[500px] sm:p-7`;
  return <div className={`inline-block rounded-md border-2 border-dark-200 p-5`}>{children}</div>;
};

export default Card;

import React from "react";

const Card = ({ children, styles }) => {
  return <div className={`rounded-md border-2 p-4 border-dark-100 ${styles}`}>{children}</div>;
};

export default Card;

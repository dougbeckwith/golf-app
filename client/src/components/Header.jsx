import React from "react";

const Header = ({ children }) => {
  return <div className="flex items-baseline w-full mb-3 flex-wrap">{children}</div>;
};

export default Header;

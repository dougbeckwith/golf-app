import React from "react";

const Header = ({ children }) => {
  return <div className="flex items-baseline w-full mb-5 lg:mb-10 flex-wrap">{children}</div>;
};

export default Header;

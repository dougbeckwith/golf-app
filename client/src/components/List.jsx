import React from "react";

const List = ({ children }) => {
  return <ul className="mt-2 gap-2 flex flex-wrap">{children}</ul>;
};

export default List;

import React from "react";

const List = ({ children }) => {
  return <ul className="mt-2 gap-2 flex flex-wrap mb-10">{children}</ul>;
};

export default List;

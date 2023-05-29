import React from "react";

const List = ({ children }) => {
  return (
    <div className="pt-4 h-full mx-auto flex flex-col justify-between items-center">
      {children}
    </div>
  );
};

export default List;

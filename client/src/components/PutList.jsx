import React from "react";

const PutList = ({ children }) => {
  return (
    <div className="pt-5 lg:justify-between gap-2 lg:gap-4 w-full flex flex-col md:flex-row flex-wrap">
      {children}
    </div>
  );
};

export default PutList;

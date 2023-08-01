import React from "react";

const StatSmall = ({ label, value }) => {
  return (
    <div>
      <p className="text-gray-100 text-sm">{label}</p>
      <p className="text-blue-200 text-md font-bold">{value}</p>
    </div>
  );
};

export default StatSmall;

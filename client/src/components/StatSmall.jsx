import React from "react";

const StatSmall = ({ label, value }) => {
  return (
    <div>
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-blue-400 text-md font-bold">{value}</p>
    </div>
  );
};

export default StatSmall;

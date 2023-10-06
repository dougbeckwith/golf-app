import React from "react";
import { GiGolfTee } from "react-icons/gi";

const StatsSection = ({ label, value }) => {
  return (
    <div className="flex justify-center items-center gap-2">
      <GiGolfTee size={30} color="#d1d5db" />
      <p className="text-gray-100 text-lg">{label} - </p>
      <p className="text-blue-200 text-lg font-bold flex">{value}</p>
    </div>
  );
};

export default StatsSection;

import React from "react";
import { GiGolfTee } from "react-icons/gi";

const StatCard = ({ iconColor, title, value }) => {
  return (
    <li className="flex bg-dark-400 px-4 py-2 rounded-md min-w-min items-center">
      <GiGolfTee size={40} color={iconColor} />
      <div className="pl-2">
        <p className="text-gray-100 text-sm">{title}</p>
        <p className="text-blue-100 text-xl font-bold flex">{value}</p>
      </div>
    </li>
  );
};

export default StatCard;

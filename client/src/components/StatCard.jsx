import React from "react";
import { GiGolfTee } from "react-icons/gi";

const StatCard = ({ iconColor, title, value }) => {
  return (
    <li className="flex w-[250px] bg-dark-200 px-4 py-2 rounded-md min-w-min items-center">
      <GiGolfTee size={40} color={iconColor} />
      <div className="pl-2">
        <p className="text-gray-300 text-sm">{title}</p>
        <p className="text-blue-200 text-md font-bold flex">{value}</p>
      </div>
    </li>
  );
};

export default StatCard;

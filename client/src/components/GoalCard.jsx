import React, { useEffect, useState } from "react";

const StatCard = ({ label, goal, current }) => {
  console.log(current);
  const widthPercentage = "50%";
  console.log(current[current.length - 1]);
  const [stat, setStat] = useState("");
  useEffect(() => {
    if (current[current.length - 1] === "%") {
      setStat(current.slice(0, -1));
    } else {
      setStat(current);
    }
  });
  // cacluate width percentage of bar
  return (
    <li className="flex w-[500px] flex-col items-center text-gray-300 bg-dark-200 px-4 py-2 rounded-md">
      <p>{label}</p>
      <div className="flex">
        <p>Current: {stat}</p>
        <p>Goal: {goal}</p>
      </div>
      <div className="w-full bg-gray-300 rounded-lg h-4 mb-1">
        <div style={{ width: widthPercentage }} className={`bg-teal-200 rounded-lg h-4 mb-1`}></div>
      </div>
    </li>
  );
};

export default StatCard;

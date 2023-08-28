import React, { useEffect, useState } from "react";

const StatCard = ({ label, goal, current }) => {
  const [width, setWidth] = useState();
  const [stat, setStat] = useState("");

  function formatAsPercentage(num) {
    return new Intl.NumberFormat("default", {
      style: "percent",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num / 100);
  }

  const calcWidth = (cur, goal) => {
    if (typeof cur === "string") {
      cur = Number(cur);
    }
    let percent = (cur / goal) * 100;
    percent = Math.round(percent);
    if (percent > 100) {
      return "100%";
    }
    return formatAsPercentage(percent);
  };

  useEffect(() => {
    if (current[current.length - 1] === "%") {
      setStat(current.slice(0, -1));
      const width = calcWidth(current.slice(0, -1), goal);
      setWidth(width);
    } else {
      setStat(current);
      const width = calcWidth(current, goal);
      setWidth(width);
    }
    // eslint-disable-next-line
  }, []);
  return (
    <li className="flex w-[500px] flex-col items-center text-gray-300 bg-dark-200 px-4 py-2 rounded-md">
      <p>{label}</p>
      <div className="flex">
        <p>Current: {stat}</p>
        <p>Goal: {goal}</p>
      </div>
      <div className="w-full bg-gray-300 rounded-lg h-4 mb-1">
        <div style={{ width: width }} className={`bg-teal-200 rounded-lg h-4 mb-1`}></div>
      </div>
    </li>
  );
};

export default StatCard;

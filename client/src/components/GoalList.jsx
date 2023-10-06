import React from "react";
import GoalCard from "../components/GoalCard";

const GoalList = ({ goals, styles, stats }) => {
  return (
    <ul className={`flex gap-2 flex-wrap mt-2 mb-6  ${styles}`}>
      {goals.map((goal, index) => {
        const key = Object.keys(goal)[0];
        const labelKey = Object.keys(goal)[1];
        const label = goal[labelKey];
        const value = goal[key];
        const current = stats[index].stat;
        return <GoalCard key={index} label={label} goal={value} current={current} />;
      })}
    </ul>
  );
};

export default GoalList;

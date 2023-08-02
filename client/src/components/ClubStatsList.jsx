import React from "react";
import StatCard from "./StatCard";

const ClubStatsList = ({ clubStats }) => {
  return (
    <ul className="flex gap-2 flex-wrap mt-2 mb-6">
      {clubStats.map((stat, index) => {
        return <StatCard key={index} iconColor="#9ca3af" title={stat.label} value={stat.stat} />;
      })}
    </ul>
  );
};

export default ClubStatsList;

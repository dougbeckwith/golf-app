import React from "react";
import Chart from "./Chart";

const ChartSection = ({ chartData }) => {
  return (
    <div className="w-full min-h-[300px] shrink-0 lg:w-[500px] lg:h-[300px] xl:w-[700px] xl:h-[350px]">
      <Chart putData={chartData} className={"shrink-0"} />
    </div>
  );
};

export default ChartSection;

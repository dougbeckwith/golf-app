import { Line } from "react-chartjs-2";
// eslint-disable-next-line
import { Chart as ChartJS } from "chart.js/auto";
import { useEffect, useState } from "react";

const Graph = ({ data, dataPoint, label, min, max }) => {
  const [dateList, setDateList] = useState([]);
  const [dataList, setDataList] = useState([]);

  const sortData = (item) => {
    item.forEach((round) => {
      setDataList((prevList) => {
        return [...prevList, round[dataPoint]];
      });
      setDateList((prevList) => {
        return [...prevList, round.dateCreated];
      });
    });
  };

  useEffect(() => {
    setDateList([]);
    setDataList([]);
    sortData(data);
    // eslint-disable-next-line
  }, [data]);

  const options = {
    scales: {
      x: {
        grid: {
          color: "#3e3e42"
        }
      },
      y: {
        min: min,
        max: max,
        grid: {
          color: "#3e3e42"
        }
      }
    },
    hover: {
      intersect: false
    },
    responsive: true,
    maintainAspectRatio: false
  };

  const chartData = {
    labels: dateList,
    datasets: [
      {
        label: label, // dynamic
        data: dataList,
        pointRadius: 0,
        backgroundColor: "#007acc",
        borderColor: "#007acc",
        borderWidth: 2,
        fill: false,
        tension: 0.1,
        options: {
          scaleShowVerticalLines: false
        }
      }
    ]
  };

  return <Line data={chartData} options={options} />;
};

export default Graph;

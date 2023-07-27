import { Line } from "react-chartjs-2";
// eslint-disable-next-line
import { Chart as ChartJS } from "chart.js/auto";
import { useEffect, useState } from "react";

const Graph = ({ putData }) => {
  const [dateList, setDateList] = useState([]);
  const [dataList, setDataList] = useState([]);

  const sortData = (data) => {
    data.forEach((round) => {
      setDataList((prevList) => {
        return [...prevList, round.puts];
      });
      setDateList((prevList) => {
        return [...prevList, round.dateCreated];
      });
    });
  };

  useEffect(() => {
    setDateList([]);
    setDataList([]);
    sortData(putData);
  }, [putData]);

  const options = {
    scales: {
      x: {
        grid: {
          color: "#3e3e42"
        }
      },
      y: {
        min: 10,
        max: 60,
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
        label: "Puts Per Round",
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

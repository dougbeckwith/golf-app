import { Line } from "react-chartjs-2";
// eslint-disable-next-line
import { Chart as ChartJS } from "chart.js/auto";
import { useEffect, useState } from "react";

const Graph = ({ putData }) => {
  const [dateList, setDateList] = useState([]);
  const [putsList, setPutsList] = useState([]);

  const sortData = (data) => {
    data.forEach((round) => {
      setPutsList((prevList) => {
        return [...prevList, round.puts];
      });
      setDateList((prevList) => {
        return [...prevList, round.dateCreated];
      });
    });
  };

  useEffect(() => {
    setDateList([]);
    setPutsList([]);
    sortData(putData);
  }, [putData]);

  const options = {
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        min: 0,
        max: 80
      }
    },
    hover: {
      intersect: false
    },
    plugins: {
      tooltip: {
        intersect: false
      }
    },
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2
  };

  const chartData = {
    labels: dateList,
    datasets: [
      {
        label: "Puts Per Round",
        data: putsList,
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

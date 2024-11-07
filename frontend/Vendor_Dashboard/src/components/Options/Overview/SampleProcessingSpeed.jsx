/* eslint-disable no-unused-vars */
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SampleProcessingSpeed = () => {
  const data = {
    labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"],
    datasets: [
      {
        label: "Processing Time (hours)",
        data: [4, 3.5, 5, 2, 4.5],
        fill: false,
        backgroundColor: "rgb(75, 192, 192)",
        borderColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  };

  return (
    <div className="sample-processing-speed mt-5">
      <h4 style={{ color: "black" }}>Sample Processing Speed</h4>
      <Line data={data} />
    </div>
  );
};

export default SampleProcessingSpeed;

import React from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const CpuUsageChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <p>No data available</p>;
  }

  // Sort data by timestamp
  const sortedData = [...data].sort((a, b) => new Date(a.Timestamp) - new Date(b.Timestamp));

  // Extract timestamps and CPU usage values
  const labels = sortedData.map((entry) =>
    new Date(entry.Timestamp).toLocaleTimeString("en-US", { hour: "numeric", hour12: true })
  );
  const values = sortedData.map((entry) => entry.Maximum);

  // Chart data
  const chartData = {
    labels,
    datasets: [
      {
        label: "Metric Data",
        data: values,
        borderColor: "rgb(253, 84, 121)", 
        backgroundColor: "rgba(155, 154, 154, 0.23)", 
        pointRadius: 3,
        pointBackgroundColor: "rgba(199, 192, 194, 0.21)",
        borderWidth: 2,
        tension: 0.3, 
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: { display: true, text: "Time" },
      },
      y: {
        title: { display: true, text: "Percentage" },
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        postion: top,
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default CpuUsageChart;

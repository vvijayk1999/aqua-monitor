import React, { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';

const WaterConsumptionChart = ({ data, chartRef }) => {
  const [chartData, setChartData] = useState({});
  const canvasRef = useRef(null);

  useEffect(() => {
    const processedData = processDataForChart(data);
    setChartData(processedData);
  }, [data]);

  const processDataForChart = (data) => {
    const labels = data.map((entry) => entry.time);
    const datasets = [];

    const uniqueDeviceIds = [...new Set(data.map((entry) => entry.device_id))];
    uniqueDeviceIds.forEach((deviceId) => {
      const deviceData = data.filter((entry) => entry.device_id === deviceId);
      const waterConsumption = deviceData.map((entry) => entry.waterConsumed);

      datasets.push({
        label: `Device ${deviceId}`,
        data: waterConsumption,
        fill: false,
        borderColor: getRandomColor(),
      });
    });

    return {
      labels,
      datasets,
    };
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  useEffect(() => {
    // Destroy the existing chart instance if it exists
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: chartData,
      options: {
        scales: {
          x: {
            type: 'time', // Use time scale for x-axis
            time: {
              unit: 'second', // Adjust the time unit as needed
            },
            title: {
              display: true,
              text: 'Time',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Water Consumption',
            },
          },
        },
      },
    });
  }, [chartData, chartRef]);

  return (
    <div style={{ width: "100%" }}>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default WaterConsumptionChart;

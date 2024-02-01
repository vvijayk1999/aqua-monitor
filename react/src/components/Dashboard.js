import styles from "./Dashboard.module.css";
import sleepingImg from "../ui/sleeping.png";

import React, { useEffect, useState, useRef } from "react";
import WaterLevelChart from "./WaterLevelChart";
import * as waterLevelApi from "../api/waterLevel";
import * as waterConsumptionApi from "../api/waterConsumption";
import WaterConsumptionChart from "./WaterConsumptionChart";

const Dashboard = () => {
  const [waterLevelData, setWaterLevelData] = useState(null);
  const [waterConsumptionData, setWaterConsumptionData] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState("5mins");
  const [timeWindow, setTimeWindow] = useState(30);

  const timeRanges = [
    { label: "Past 5 mins", value: "5mins", window: 30 },
    { label: "Past 15 mins", value: "15mins", window: 90 },
    { label: "Past 1 hour", value: "1hour", window: 360 },
    { label: "Past 6 hours", value: "6hours", window: 2160 },
    { label: "Past 24 hours", value: "24hours", window: 8640 },
  ];

  const waterLevelChartRef = useRef(null);
  const waterConsumptionChartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentTime = new Date();
        const fromTime = calculateFromTime(currentTime, selectedTimeRange);
        const toTime = currentTime.toISOString();

        const levelData = await waterLevelApi.getWaterLevelData({
          fromTime,
          toTime,
          timeWindow,
        });
        if (levelData && Array.isArray(levelData) && levelData.length > 0) {
          setWaterLevelData(levelData);
        } else {
          console.error("Invalid water level data:", levelData);
          setWaterLevelData(null);
        }

        const consumptionData = await waterConsumptionApi.getConsumptionData({
          fromTime,
          toTime,
          timeWindow,
        });
        if (
          consumptionData &&
          Array.isArray(consumptionData) &&
          consumptionData.length > 0
        ) {
          setWaterConsumptionData(consumptionData);
        } else {
          console.error("Invalid consumption data:", consumptionData);
          setWaterConsumptionData(null);
        }
      } catch (error) {
        console.error("Error fetching water data:", error);
        setWaterLevelData(null);
        setWaterConsumptionData(null);
      }
    };

    fetchData();
  }, [selectedTimeRange, timeWindow]);

  const calculateFromTime = (currentTime, range) => {
    const fromTime = new Date(currentTime);

    switch (range) {
      case "5mins":
        fromTime.setMinutes(currentTime.getMinutes() - 5);
        break;
      case "15mins":
        fromTime.setMinutes(currentTime.getMinutes() - 15);
        break;
      case "1hour":
        fromTime.setHours(currentTime.getHours() - 1);
        break;
      case "6hours":
        fromTime.setHours(currentTime.getHours() - 6);
        break;
      case "24hours":
        fromTime.setDate(currentTime.getDate() - 1);
        break;
      default:
        break;
    }

    return fromTime.toISOString();
  };

  return (
    <main>
      <div className={`${styles.filter} ${styles["margin-top-20"]}`}>
        <img src="./icons/filter.png" alt="" />
        <select
          value={selectedTimeRange}
          onChange={(e) => {
            setSelectedTimeRange(e.target.value);
            setTimeWindow(
              timeRanges.find((range) => range.value === e.target.value)
                ?.window || 1
            );
          }}
        >
          {timeRanges.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </div>
      <div className={styles["water-details"]}>
        <div
          className={`${styles["water-consumption"]} ${styles.card} ${styles["margin-top-20"]}`}
        >
          <h2>Water Consumption</h2>
          {waterLevelData == null && (
            <div
              className={`${styles["img-wrapper"]} ${styles["data-unavailable"]}`}
            >
              <img src={sleepingImg} alt="" />
            </div>
          )}
          {waterConsumptionData !== null && (
            <WaterConsumptionChart
              data={waterConsumptionData}
              chartRef={waterConsumptionChartRef}
            />
          )}
        </div>
        <div
          className={`${styles["water-consumption"]} ${styles.card} ${styles["margin-top-20"]}`}
        >
          <h2>Water Tank Level</h2>
          {waterLevelData == null && (
            <div
              className={`${styles["img-wrapper"]} ${styles["data-unavailable"]}`}
            >
              <img src={sleepingImg} alt="" />
            </div>
          )}
          {waterLevelData !== null && (
            <WaterLevelChart
              data={waterLevelData}
              chartRef={waterLevelChartRef}
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default Dashboard;

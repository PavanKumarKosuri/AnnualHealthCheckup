/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import "../../styles/styles.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const AnalyticsReports = () => {
  const [employeeParticipation, setEmployeeParticipation] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [campPerformance, setCampPerformance] = useState([]);
  const [reportMetrics, setReportMetrics] = useState([]);

  useEffect(() => {
    loadDummyData();
  }, []);

  const loadDummyData = () => {
    setEmployeeParticipation([
      { label: "Mumbai", count: 50 },
      { label: "Delhi", count: 40 },
      { label: "Bengaluru", count: 30 },
      { label: "Pune", count: 20 },
      { label: "Hyderabad", count: 25 },
    ]);

    setTestResults([
      { label: "Normal", count: 150 },
      { label: "Abnormal", count: 70 },
      { label: "Pending", count: 30 },
    ]);

    setCampPerformance([
      { date: "2024-08-01", count: 50 },
      { date: "2024-08-02", count: 45 },
      { date: "2024-08-03", count: 60 },
      { date: "2024-08-04", count: 55 },
      { date: "2024-08-05", count: 70 },
    ]);

    setReportMetrics([
      { label: "Reports Generated", count: 200 },
      { label: "Reports Shared", count: 150 },
      { label: "Reports Downloaded", count: 120 },
    ]);
  };

  return (
    <main className="main-container" style={{ color: "green" }}>
      <div className="main-title">
        <h3>Analytics & Reports</h3>
      </div>

      <div className="d-flex flex-wrap justify-content-around">
        <div className="analytics-section mt-4" style={{ maxWidth: "400px" }}>
          <h4>Employee Participation</h4>
          <Bar
            data={{
              labels: employeeParticipation.map((item) => item.label),
              datasets: [
                {
                  label: "Employees",
                  data: employeeParticipation.map((item) => item.count),
                  backgroundColor: "#42A5F5",
                  borderColor: "#1E88E5",
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
              },
            }}
            height={200}
          />
        </div>

        <div className="analytics-section mt-4" style={{ maxWidth: "400px" }}>
          <h4>Test Results Overview</h4>
          <Pie
            data={{
              labels: testResults.map((item) => item.label),
              datasets: [
                {
                  label: "Test Results",
                  data: testResults.map((item) => item.count),
                  backgroundColor: ["#66BB6A", "#FF7043", "#FFCA28"],
                  borderColor: "#FFF",
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
              },
            }}
            height={200}
          />
        </div>
      </div>

      <div className="d-flex flex-wrap justify-content-around mt-4">
        <div className="analytics-section mt-4" style={{ maxWidth: "400px" }}>
          <h4>Camp Performance</h4>
          <Line
            data={{
              labels: campPerformance.map((item) => item.date),
              datasets: [
                {
                  label: "Camps",
                  data: campPerformance.map((item) => item.count),
                  fill: false,
                  borderColor: "#29B6F6",
                  backgroundColor: "#29B6F6",
                  tension: 0.4,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
              },
            }}
            height={200}
          />
        </div>

        <div className="analytics-section mt-4" style={{ maxWidth: "400px" }}>
          <h4>Report Metrics</h4>
          <Bar
            data={{
              labels: reportMetrics.map((item) => item.label),
              datasets: [
                {
                  label: "Reports",
                  data: reportMetrics.map((item) => item.count),
                  backgroundColor: "#8D6E63",
                  borderColor: "#5D4037",
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
              },
            }}
            height={200}
          />
        </div>
      </div>
    </main>
  );
};

export default AnalyticsReports;

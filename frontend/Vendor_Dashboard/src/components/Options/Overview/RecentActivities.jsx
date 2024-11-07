/* eslint-disable no-unused-vars */
import React from "react";

const RecentActivities = () => {
  const recentActivities = [
    {
      activity: "Sample ID SMP001 marked as Completed",
      dateTime: "2024-08-28 10:00 AM",
      status: "Completed",
    },
    {
      activity: "Sample ID SMP002 marked as In Process",
      dateTime: "2024-08-28 09:30 AM",
      status: "In Process",
    },
    {
      activity: "Sample ID SMP003 received",
      dateTime: "2024-08-28 09:00 AM",
      status: "Received",
    },
    {
      activity: "Urgent task assigned to process SMP004",
      dateTime: "2024-08-28 08:45 AM",
      status: "Urgent",
    },
  ];

  return (
    <div className="recent-activities mt-5">
      <h4 style={{ color: "black" }}>Recent Activities</h4>
      <table className="table table-hover table-striped table-sm mt-3">
        <thead>
          <tr>
            <th>Activity</th>
            <th>Date/Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {recentActivities.map((activity, index) => (
            <tr key={index}>
              <td>{activity.activity}</td>
              <td>{activity.dateTime}</td>
              <td>{activity.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentActivities;

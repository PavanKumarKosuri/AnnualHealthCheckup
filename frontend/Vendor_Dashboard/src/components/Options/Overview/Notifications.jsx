/* eslint-disable no-unused-vars */
import React from "react";

const Notifications = () => {
  const notifications = [
    {
      type: "New Samples Received",
      message: "3 new samples have been logged into the system.",
      timestamp: "2024-08-28 10:00 AM",
    },
    {
      type: "Pending Reports",
      message: "You have 5 reports pending to be generated.",
      timestamp: "2024-08-28 09:30 AM",
    },
    {
      type: "System Alert",
      message: "System maintenance scheduled for 2024-08-29.",
      timestamp: "2024-08-28 08:00 AM",
    },
  ];

  return (
    <div className="notifications mt-5">
      <h4 style={{ color: "black" }}>Notifications</h4>
      <table className="table table-hover table-striped table-sm mt-3">
        <thead>
          <tr>
            <th>Type</th>
            <th>Message</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {notifications.map((notification, index) => (
            <tr key={index}>
              <td>{notification.type}</td>
              <td>{notification.message}</td>
              <td>{notification.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Notifications;

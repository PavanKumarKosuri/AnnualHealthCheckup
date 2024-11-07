/* eslint-disable no-unused-vars */
import React from "react";

const UpcomingSchedule = () => {
  const upcomingSchedule = [
    {
      description: "Sample Collection Appointment",
      date: "2024-08-29",
      time: "10:00 AM",
    },
    {
      description: "Report Submission Deadline",
      date: "2024-08-29",
      time: "05:00 PM",
    },
    {
      description: "Follow-up Appointment",
      date: "2024-08-30",
      time: "02:00 PM",
    },
  ];

  return (
    <div className="upcoming-schedule mt-5">
      <h4 style={{ color: "black" }}>Upcoming Schedule</h4>
      <table className="table table-hover table-striped table-sm mt-3">
        <thead>
          <tr>
            <th>Description</th>
            <th>Date</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {upcomingSchedule.map((appointment, index) => (
            <tr key={index}>
              <td>{appointment.description}</td>
              <td>{appointment.date}</td>
              <td>{appointment.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UpcomingSchedule;

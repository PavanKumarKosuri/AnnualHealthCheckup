/* eslint-disable no-unused-vars */
import React from "react";

const PendingTasks = () => {
  const pendingTasks = [
    {
      taskDescription: "Process Sample ID SMP005",
      assignedTo: "Technician A",
      dueDate: "2024-08-28",
      priority: "High",
    },
    {
      taskDescription: "Upload report for SMP002",
      assignedTo: "Technician B",
      dueDate: "2024-08-28",
      priority: "Medium",
    },
    {
      taskDescription: "Complete processing of SMP006",
      assignedTo: "Technician A",
      dueDate: "2024-08-29",
      priority: "Low",
    },
    {
      taskDescription: "Generate PDF report for SMP007",
      assignedTo: "Technician C",
      dueDate: "2024-08-28",
      priority: "Urgent",
    },
  ];

  return (
    <div className="pending-tasks mt-5">
      <h4 style={{ color: "black" }}>Pending Tasks</h4>
      <table className="table table-hover table-striped table-sm mt-3">
        <thead>
          <tr>
            <th>Task Description</th>
            <th>Assigned To</th>
            <th>Due Date</th>
            <th>Priority</th>
          </tr>
        </thead>
        <tbody>
          {pendingTasks.map((task, index) => (
            <tr key={index}>
              <td>{task.taskDescription}</td>
              <td>{task.assignedTo}</td>
              <td>{task.dueDate}</td>
              <td>{task.priority}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PendingTasks;

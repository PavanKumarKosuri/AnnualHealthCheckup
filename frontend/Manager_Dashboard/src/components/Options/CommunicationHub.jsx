/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";

const CommunicationHub = () => {
  const [selectedTool, setSelectedTool] = useState("Email");
  const [message, setMessage] = useState("");
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Load dummy logs on component mount
    setLogs(dummyLogs);
  }, []);

  const handleToolChange = (e) => {
    setSelectedTool(e.target.value);
  };

  const handleTemplateSelect = (template) => {
    setMessage(template);
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const logEntry = {
      id: logs.length + 1,
      tool: selectedTool,
      message,
      timestamp: new Date().toLocaleString(),
    };

    setLogs([...logs, logEntry]);
    setMessage("");
  };

  const templates = {
    Email: [
      "Dear [Name], your registration is successful.",
      "Please be reminded of the upcoming camp on [Date].",
      "New employee data to be added: [Employee Name], [Details]",
    ],
    SMS: [
      "Your report is ready. Click the link to download.",
      "Please visit the camp at your allocated time slot.",
      "Employee data update request: [Employee Name], [Details]",
    ],
    WhatsApp: [
      "Your appointment has been confirmed.",
      "Please find your report attached.",
      "Request to add new employee data: [Employee Name], [Details]",
    ],
  };

  const dummyLogs = [
    {
      id: 1,
      tool: "Email",
      message: "Mumbai camp has been successfully completed.",
      timestamp: "2024-08-28 10:30:00",
    },
    {
      id: 2,
      tool: "SMS",
      message: "XXX report is ready.",
      timestamp: "2024-08-28 11:00:00",
    },
    {
      id: 3,
      tool: "WhatsApp",
      message: "Request to add new employee data: Rohan Gupta, [Details].",
      timestamp: "2024-08-28 12:15:00",
    },
    {
      id: 4,
      tool: "Email",
      message: "New employee data to be added: Sakshi Mehta, [Details].",
      timestamp: "2024-08-28 13:45:00",
    },
  ];

  return (
    <div className="container mt-4">
      <h3>Communication Hub</h3>
      <div className="mb-3">
        <label htmlFor="toolSelect" className="form-label">
          Select Communication Tool
        </label>
        <select
          id="toolSelect"
          className="form-select"
          value={selectedTool}
          onChange={handleToolChange}
        >
          <option value="Email">Email</option>
          <option value="SMS">SMS</option>
          <option value="WhatsApp">WhatsApp</option>
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="templateSelect" className="form-label">
          Select a Template
        </label>
        <select
          id="templateSelect"
          className="form-select"
          onChange={(e) => handleTemplateSelect(e.target.value)}
        >
          <option value="">Select a Template</option>
          {templates[selectedTool].map((template, index) => (
            <option key={index} value={template}>
              {template}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="messageBox" className="form-label">
          Message
        </label>
        <textarea
          id="messageBox"
          className="form-control"
          rows="4"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Write your ${selectedTool.toLowerCase()} message here...`}
        ></textarea>
      </div>

      <button className="btn btn-primary" onClick={handleSendMessage}>
        Send {selectedTool}
      </button>

      <h4 className="mt-5">Communication Logs</h4>
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>#</th>
            <th>Tool</th>
            <th>Message</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs.length > 0 ? (
            logs.map((log) => (
              <tr key={log.id}>
                <td>{log.id}</td>
                <td>{log.tool}</td>
                <td>{log.message}</td>
                <td>{log.timestamp}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No communications sent yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CommunicationHub;

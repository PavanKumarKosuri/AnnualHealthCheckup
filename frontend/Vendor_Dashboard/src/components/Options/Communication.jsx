/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import api from "../../axiosConfig";
import "../../styles/styles.css";

const Communication = () => {
  const [message, setMessage] = useState("");
  const [recipients, setRecipients] = useState("employees");

  const handleSendMessage = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      const response = await api.post(
        "/api/vendor/communication",
        { message, recipients },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        alert("Message sent successfully!");
        setMessage("");
      } else {
        alert("Failed to send message!");
      }
    } catch (error) {
      console.error("Error sending message!", error);
      alert("Failed to send message!");
    }
  };

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>Communication</h3>
      </div>
      <div className="communication-form mt-4">
        <div className="mb-3">
          <label htmlFor="recipients" className="form-label" style={{color:"black"}}>
            Send To:
          </label>
          <select
            id="recipients"
            className="form-select"
            value={recipients}
            onChange={(e) => setRecipients(e.target.value)}
          >
            {/* <option value="employees">Employees</option>
            <option value="hr">HR Managers</option> */}
            <option value="phlebos">Phlebos</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="message" className="form-label" style={{color:"black"}}>
            Message:
          </label>
          <textarea
            id="message"
            className="form-control"
            rows="5"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
        </div>
        <button className="btn btn-outline-dark" onClick={handleSendMessage}>
          Send Message
        </button>
      </div>
    </main>
  );
};

export default Communication;

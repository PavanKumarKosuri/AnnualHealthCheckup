/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axiosConfig";

const VendorLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // const handleLogin = async () => {
  //   try {
  //     const response = await api.post(`/api/hr/login`, {
  //       email,
  //       password,
  //     });

  //     if (response.status === 200) {
  //       const { accessToken } = response.data;

  //       // Store the details securely in localStorage
  //       localStorage.setItem("auth-token", accessToken);
  //       localStorage.setItem("email", email);

  //       // Navigate to the vendor Dashboard without passing sensitive info via URL
  //       navigate(`/vendor-dashboard`);
  //     } else {
  //       displayMessage("Login failed. Please check your credentials.", "error");
  //     }
  //   } catch (error) {
  //     console.error("Error logging in:", error);
  //     displayMessage("Login failed. Please try again later.", "error");
  //   }
  // };
  const handleLogin = async () => {
    // Hardcoded credentials
    const hardcodedEmail = "vendor@gmail.com";
    const hardcodedPassword = "vendor123";

    if (email === hardcodedEmail && password === hardcodedPassword) {
      // Simulate a successful login
      const accessToken = "dummy-token";

      // Store the token securely in localStorage
      localStorage.setItem("auth-token", accessToken);
      localStorage.setItem("email", email);

      // Navigate to the Manager Dashboard without passing sensitive info via URL
      navigate(`/vendor-dashboard`);
    } else {
      displayMessage("Login failed. Please check your credentials.", "error");
    }
  };
  const displayMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 5000);
  };

  return (
    <div className="container d-flex justify-content-center align-items-center">
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <h2 className="mt-5 mb-4 text-center">Vendor Login</h2>
        {message && (
          <div
            className={`alert ${
              messageType === "success" ? "alert-success" : "alert-danger"
            }`}
            role="alert"
          >
            {message}
          </div>
        )}
        <div className="form-floating mb-3">
          <input
            type="email"
            className="form-control"
            id="floatingEmail"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="floatingEmail">Email</label>
        </div>
        <div className="form-floating mb-3">
          <input
            type="password"
            className="form-control"
            id="floatingPassword"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="floatingPassword">Password</label>
        </div>
        <button
          className="btn btn-primary w-100"
          type="button"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default VendorLogin;

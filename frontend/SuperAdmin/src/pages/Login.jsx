/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { BiLogIn } from "react-icons/bi";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineLockOpen } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import api from "../api/apiService";
import Header from "../components/common/Header.jsx";

const AdminPage = ({ onAdminLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await api.post(`/admin/login`, {
        username,
        password,
      });

      if (response.status === 200) {
        localStorage.setItem("accessToken", response.data.accessToken);
        onAdminLogin(true);
        navigate("/super-admin/dashboard");
      } else {
        setMessage("Login failed. Please check your credentials.");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setMessage("Invalid credentials. Please try again.");
      } else if (error.response && error.response.status === 403) {
        setMessage(
          "Access forbidden. You don't have permission to access this resource."
        );
      } else {
        setMessage("Login failed. Please try again later.");
      }
      setTimeout(() => setMessage(""), 5000);
    }
  };

  return (
    <div
      className="container"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <Header />
      <div
        className="body-container"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="form-signin px-5 py-5">
          <form>
            <div className="d-flex mx-3">
              <h1 className="h3 mb-2">Admin Login</h1>
              <BiLogIn
                className="mb-3"
                style={{ fontSize: "30px", marginTop: "5px" }}
              />
            </div>

            {message && (
              <div className="alert alert-danger" role="alert">
                {message}
              </div>
            )}

            <div className="form-floating">
              <input
                type="text"
                className="form-control"
                id="floatingInput"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <label htmlFor="floatingInput">
                <FaRegUser className="mx-2 mb-1" />
                <span>Username</span>
              </label>
            </div>
            <div className="form-floating mt-2">
              <input
                type="password"
                className="form-control"
                id="floatingPassword"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label htmlFor="floatingPassword">
                <MdOutlineLockOpen
                  className="mx-2 mb-1"
                  style={{ fontSize: "18px" }}
                />
                <span>Password</span>
              </label>
            </div>

            <button
              className="btn btn-outline-dark w-100 py-2 mt-3"
              type="button"
              onClick={handleLogin}
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;

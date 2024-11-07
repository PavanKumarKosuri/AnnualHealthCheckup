// vendor\src\pages\VendorDashboard.jsx
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Header2 from "../components/shared/Header2";
import Option from "../components/Option";
import Sidebar from "../components/Sidebar";
import "../styles/styles.css";
import { useNavigate } from "react-router-dom";

const VendorDashboard = () => {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Overview");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("auth-token");

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    setIsModalOpen(false);
    navigate("/");
  };

  const openLogoutModal = () => {
    setIsModalOpen(true);
  };

  const closeLogoutModal = () => {
    setIsModalOpen(false);
  };

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const handleMenuClick = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2" style={{ marginLeft: "-20px" }}>
          <Sidebar
            openSidebarToggle={openSidebarToggle}
            OpenSidebar={OpenSidebar}
            handleMenuClick={handleMenuClick}
            handleLogout={openLogoutModal}
          />
        </div>
        <div className="col-md-10">
          <Header2 OpenSidebar={OpenSidebar} />
          <Option selectedOption={selectedOption} />
        </div>
      </div>

      <div
        className={`modal fade ${isModalOpen ? "show" : ""}`}
        id="logoutModal"
        tabIndex="-1"
        aria-labelledby="logoutModalLabel"
        aria-hidden={!isModalOpen}
        style={{ display: isModalOpen ? "block" : "none" }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="logoutModalLabel">
                Confirm Logout
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={closeLogoutModal}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">Are you sure you want to logout?</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeLogoutModal}
              >
                No
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleLogout}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="modal-backdrop fade show"
          style={{ zIndex: 1040 }}
        ></div>
      )}
    </div>
  );
};

export default VendorDashboard;

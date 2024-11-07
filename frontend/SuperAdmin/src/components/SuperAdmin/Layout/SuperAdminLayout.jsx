/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../SideBar.jsx";
import SuperHeader from "../SuperHeader.jsx";
import { Container, Modal, Button } from "react-bootstrap";
import "../../SuperAdmin/SuperAdminCSS.css";
import { ToastContainer, toast } from "react-toastify";

const SuperAdminLayout = ({ onLogout }) => {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      toast.error("You are not logged in! Redirecting to login page...");
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    onLogout();
    setIsModalOpen(false);
    toast.success("Successfully logged out!");
    setTimeout(() => {
      navigate("/");
    }, 3000);
  };

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const openLogoutModal = () => {
    setIsModalOpen(true);
  };

  const closeLogoutModal = () => {
    setIsModalOpen(false);
  };

  const handleMenuClick = (menu) => {
  };

  return (
    <div style={{ display: "flex" }}>
      <ToastContainer autoClose={3000} position="top-right" />

      {/* Sidebar Section */}
      <div className="col-md-2" style={{ marginLeft: "-20px" }}>
        <Sidebar
          handleLogout={openLogoutModal}
          openSidebarToggle={openSidebarToggle}
          handleMenuClick={handleMenuClick}
          OpenSidebar={OpenSidebar}
        />
      </div>
      {/* Main Content Section */}
      <div
        style={{
          flex: 1,
          marginLeft: openSidebarToggle ? "220px" : "0px",
          transition: "margin-left 0.3s ease",
        }}
      >
        <SuperHeader OpenSidebar={OpenSidebar} />
        <Container fluid style={{ paddingTop: "10px" }}>
          <Outlet />
        </Container>
      </div>

      {/* Logout Modal */}
      <Modal show={isModalOpen} onHide={closeLogoutModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to logout?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeLogoutModal}>
            No
          </Button>
          <Button variant="danger" onClick={handleLogout}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SuperAdminLayout;

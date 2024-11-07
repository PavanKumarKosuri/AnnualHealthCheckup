import React from "react";
import { BsGrid1X2Fill, BsPeopleFill, BsFillGearFill } from "react-icons/bs";
import { FaUsers, FaBoxOpen, FaVials } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { TbReportAnalytics } from "react-icons/tb";
import { LuPanelLeftClose } from "react-icons/lu";
import checkMedLogo from "../../assets/images/checkmed_newlogo.png";
import { NavLink } from "react-router-dom";
import { FaUserNurse } from "react-icons/fa";
import PropTypes from "prop-types";

const AdminDashboardSidebar = ({
  openSidebarToggle,
  OpenSidebar,
  handleMenuClick,
  handleLogout,
}) => {
  return (
    <aside
      id="sidebar"
      className={openSidebarToggle ? "sidebar-responsive" : ""}
    >
      <div className="sidebar-title">
        <div className="sidebar-brand">
          <img
            src={checkMedLogo}
            style={{ width: "140px" }}
            alt="CheckMed Logo"
          />
        </div>
        <span className="icon close_icon" onClick={OpenSidebar}>
          <LuPanelLeftClose />
        </span>
      </div>

      <ul className="sidebar-list">
        <li
          className="sidebar-list-item"
          onClick={() => handleMenuClick("dashboard")}
        >
          <NavLink
            to="/super-admin/dashboard"
            className="d-flex align-items-center"
          >
            <BsGrid1X2Fill className="icon me-2" /> Dashboard
          </NavLink>
        </li>
        <li
          className="sidebar-list-item"
          onClick={() => handleMenuClick("clientManagement")}
        >
          <NavLink
            to="/super-admin/clients"
            className="d-flex align-items-center"
          >
            <FaUsers className="icon me-2" /> Clients
          </NavLink>
        </li>
        <li
          className="sidebar-list-item"
          onClick={() => handleMenuClick("packageSettings")}
        >
          <NavLink
            to="/super-admin/package-settings"
            className="d-flex align-items-center"
          >
            <FaBoxOpen className="icon me-2" /> Package Settings
          </NavLink>
        </li>
        <li
          className="sidebar-list-item"
          onClick={() => handleMenuClick("phlebotomistSettings")}
        >
          <NavLink
            to="/super-admin/phlebotomist-settings"
            className="d-flex align-items-center"
          >
            <FaUserNurse className="icon me-2" /> Phlebotomist Settings
          </NavLink>
        </li>
        <li
          className="sidebar-list-item"
          onClick={() => handleMenuClick("reports")}
        >
          <NavLink
            to="/super-admin/reports"
            className="d-flex align-items-center"
          >
            <TbReportAnalytics className="icon me-2" /> Records
          </NavLink>
        </li>
        <li
          className="sidebar-list-item"
          onClick={() => handleMenuClick("sampleManagement")}
        >
          <NavLink
            to="/super-admin/samples"
            className="d-flex align-items-center"
          >
            <FaVials className="icon me-2" /> Sample Management
          </NavLink>
        </li>
        <li
          className="sidebar-list-item"
          onClick={() => handleMenuClick("registrations")}
        >
          <NavLink
            to="/super-admin/registrations"
            className="d-flex align-items-center"
          >
            <BsPeopleFill className="icon me-2" style={{ marginTop: "-1px" }} />{" "}
            Registrations
          </NavLink>
        </li>
        <li
          className="sidebar-list-item"
          onClick={() => handleMenuClick("settings")}
        >
          <NavLink
            to="/super-admin/settings"
            className="d-flex align-items-center"
          >
            <BsFillGearFill className="icon me-2" /> Settings
          </NavLink>
        </li>
        <li className="sidebar-list-item" onClick={handleLogout}>
          <div className="d-flex align-items-center">
            <MdLogout className="icon me-2" style={{ marginTop: "-2px" }} />{" "}
            Logout
          </div>
        </li>
      </ul>
    </aside>
  );
};

AdminDashboardSidebar.propTypes = {
  openSidebarToggle: PropTypes.bool.isRequired,
  OpenSidebar: PropTypes.func.isRequired,
  handleMenuClick: PropTypes.func.isRequired,
  handleLogout: PropTypes.func.isRequired,
};

export default AdminDashboardSidebar;

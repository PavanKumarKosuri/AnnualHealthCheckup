/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { NavLink } from "react-router-dom";
import { BsFillGearFill, BsFillPersonLinesFill } from "react-icons/bs";
import { MdLogout, MdDashboard, MdAssignment, MdPerson } from "react-icons/md";
import { LuPanelLeftClose } from "react-icons/lu";
import { AiFillPieChart, AiOutlineMessage } from "react-icons/ai";
import { FaChartBar, FaQuestionCircle } from "react-icons/fa";
import checkMedLogo from "../assets/checkmed_newlogo.png";

const Sidebar = ({
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
        <li className="sidebar-list-item">
          <NavLink
            to="#"
            onClick={() => handleMenuClick("Overview")}
            activeClassName="active-link"
          >
            <MdDashboard className="icon" />
            Dashboard
          </NavLink>
        </li>
        <li className="sidebar-list-item">
          <NavLink
            to="#"
            onClick={() => handleMenuClick("HRManagement")}
            activeClassName="active-link"
          >
            <BsFillPersonLinesFill className="icon" />
            HR Management
          </NavLink>
        </li>
        <li className="sidebar-list-item">
          <NavLink
            to="#"
            onClick={() => handleMenuClick("EmployeeOverview")}
            activeClassName="active-link"
          >
            <MdPerson className="icon" />
            Employee Overview
          </NavLink>
        </li>
        <li className="sidebar-list-item">
          <NavLink
            to="#"
            onClick={() => handleMenuClick("CampManagement")}
            activeClassName="active-link"
          >
            <MdAssignment className="icon" />
            Camp Management
          </NavLink>
        </li>
        <li className="sidebar-list-item">
          <NavLink
            to="#"
            onClick={() => handleMenuClick("Reports")}
            activeClassName="active-link"
          >
            <AiFillPieChart className="icon" />
            Reports
          </NavLink>
        </li>
        <li className="sidebar-list-item">
          <NavLink
            to="#"
            onClick={() => handleMenuClick("CommunicationHub")}
            activeClassName="active-link"
          >
            <AiOutlineMessage className="icon" />
            Communication Hub
          </NavLink>
        </li>
        <li className="sidebar-list-item">
          <NavLink
            to="#"
            onClick={() => handleMenuClick("Settings")}
            activeClassName="active-link"
          >
            <BsFillGearFill className="icon" /> Settings
          </NavLink>
        </li>
        <li className="sidebar-list-item">
          <NavLink
            to="#"
            onClick={() => handleMenuClick("AnalyticsReports")}
            activeClassName="active-link"
          >
            <FaChartBar className="icon" /> Analytics & Reports
          </NavLink>
        </li>
        <li className="sidebar-list-item">
          <NavLink
            to="#"
            onClick={() => handleMenuClick("HelpAndSupport")}
            activeClassName="active-link"
          >
            <FaQuestionCircle className="icon" /> Help & Support
          </NavLink>
        </li>
        <li className="sidebar-list-item" onClick={handleLogout}>
          <div>
            <MdLogout className="icon" style={{ marginTop: "-2px" }} /> LogOut
          </div>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;

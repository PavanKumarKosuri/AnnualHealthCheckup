// vendor\src\components\Sidebar.jsx
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { NavLink } from "react-router-dom";
import { BsFillGearFill, BsFillFileEarmarkTextFill } from "react-icons/bs";
import { MdLogout, MdOutlineViewList } from "react-icons/md";
import { FaVials, FaClipboardList } from "react-icons/fa";
import { BiSupport } from "react-icons/bi";
import checkMedLogo from "../assets/checkmed_newlogo.png";
import { FaQuestionCircle } from "react-icons/fa";

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
          <MdOutlineViewList />
        </span>
      </div>
      <ul className="sidebar-list">
        <li className="sidebar-list-item">
          <NavLink
            to="#"
            onClick={() => handleMenuClick("Overview")}
            activeClassName="active-link"
          >
            <MdOutlineViewList className="icon" /> Overview
          </NavLink>
        </li>
        <li className="sidebar-list-item">
          <NavLink
            to="#"
            onClick={() => handleMenuClick("SampleManagement")}
            activeClassName="active-link"
          >
            <FaVials className="icon" /> Sample Management
          </NavLink>
        </li>
        <li className="sidebar-list-item">
          <NavLink
            to="#"
            onClick={() => handleMenuClick("ReportManagement")}
            activeClassName="active-link"
          >
            <BsFillFileEarmarkTextFill className="icon" /> Report Management
          </NavLink>
        </li>
        <li className="sidebar-list-item">
          <NavLink
            to="#"
            onClick={() => handleMenuClick("TestimonialManagement")} // New Option
            activeClassName="active-link"
          >
            <FaClipboardList className="icon" /> Testimonial Management
          </NavLink>
        </li>
        <li className="sidebar-list-item">
          <NavLink
            to="#"
            onClick={() => handleMenuClick("Communication")}
            activeClassName="active-link"
          >
            <BiSupport className="icon" /> Communication
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

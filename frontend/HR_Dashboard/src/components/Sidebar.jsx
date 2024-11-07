/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { NavLink } from "react-router-dom";
import { BsFillGearFill } from "react-icons/bs";
import { MdLogout } from "react-icons/md";
import { LuPanelLeftClose } from "react-icons/lu";
import { MdGridView } from "react-icons/md";
import { MdOutlinePersonOutline } from "react-icons/md";
import { LiaDownloadSolid } from "react-icons/lia";
import { FaRegComments } from "react-icons/fa";
import { FiHelpCircle } from "react-icons/fi";
import checkMedLogo from "../assets/checkmed_newlogo.png";
import { BiIdCard } from "react-icons/bi";

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
            <MdGridView className="icon" />
            Overview
          </NavLink>
        </li>
        <li className="sidebar-list-item">
          <NavLink
            to="#"
            onClick={() => handleMenuClick("Registrations")}
            activeClassName="active-link"
          >
            <BiIdCard className="icon" />
            Registrations
          </NavLink>
        </li>

        <li className="sidebar-list-item">
          <NavLink
            to="#"
            onClick={() => handleMenuClick("Employees")}
            activeClassName="active-link"
          >
            <MdOutlinePersonOutline className="icon" />
            Employees
          </NavLink>
        </li>
        {/* <li className="sidebar-list-item">
          <NavLink
            to="#"
            onClick={() => handleMenuClick("ReportsDownload")}
            activeClassName="active-link"
          >
            <LiaDownloadSolid className="icon" />
            ReportsDownload
          </NavLink>
        </li>
        <li className="sidebar-list-item">
          <NavLink
            to="#"
            onClick={() => handleMenuClick("CommunicationHub")}
            activeClassName="active-link"
          >
            <FaRegComments className="icon" />
            Communication Hub
          </NavLink>
        </li> */}
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
            onClick={() => handleMenuClick("HelpSupport")}
            activeClassName="active-link"
          >
            <FiHelpCircle className="icon" /> Help & Support
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

/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { BsJustify } from "react-icons/bs";
import { MdOutlineMailOutline } from "react-icons/md";
import { IoIosCall } from "react-icons/io";
import { RiNotification4Line } from "react-icons/ri";
import notificationsData from "../../notifications.json"; // Adjust the path if necessary

const LtHeader = ({ OpenSidebar }) => {
  const [notifications, setNotifications] = useState([]);
  const [newNotifications, setNewNotifications] = useState(0);

  useEffect(() => {
    // Fetch notifications from the JSON file or local storage
    const storedNotifications =
      JSON.parse(localStorage.getItem("notifications")) || notificationsData;

    setNotifications(storedNotifications);

    // Calculate the number of new notifications
    const newCount = storedNotifications.filter(
      (notification) => !notification.viewed
    ).length;
    setNewNotifications(newCount);

    const popoverTriggerList = document.querySelectorAll(
      '[data-bs-toggle="popover"]'
    );
    popoverTriggerList.forEach((popoverTriggerEl) => {
      new window.bootstrap.Popover(popoverTriggerEl);
    });
  }, []);

  const handleNotificationClick = (id) => {
    const updatedNotifications = notifications.map((notification) =>
      notification.id === id ? { ...notification, viewed: true } : notification
    );
    setNotifications(updatedNotifications);

    // Save the updated notifications to local storage
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));

    // Update the new notifications count
    const newCount = updatedNotifications.filter(
      (notification) => !notification.viewed
    ).length;
    setNewNotifications(newCount);
  };

  return (
    <header className="header d-flex justify-content-between align-items-center p-2 bg-white border-bottom">
      <div className="menu-icon">
        <BsJustify className="icon" onClick={OpenSidebar} />
      </div>
      <div className="header-left d-flex align-items-center">
        <div className="contact-info me-3">
          <div>
            <MdOutlineMailOutline style={{ marginRight: "5px" }} />
            support@checkmed.in
          </div>
          <div>
            <IoIosCall style={{ marginRight: "5px" }} />
            +91 9914256267
          </div>
        </div>
      </div>
      <div className="header-right d-flex align-items-center ms-auto">
        <div className="dropdown">
          <button
            className="btn btn-link position-relative p-0"
            type="button"
            id="notificationDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style={{ color: "black" }}
          >
            <RiNotification4Line style={{ fontSize: "24px" }} />
            {newNotifications > 0 && (
              <span
                className="badge bg-danger rounded-pill position-absolute top-0 start-75 translate-middle"
                style={{ fontSize: "0.6rem" }}
              >
                {newNotifications}
              </span>
            )}
          </button>
          <ul
            className="dropdown-menu dropdown-menu-end"
            aria-labelledby="notificationDropdown"
          >
            {notifications.map((notification) => (
              <li key={notification.id}>
                <span
                  className={`dropdown-item ${
                    !notification.viewed ? "fw-bold" : ""
                  }`}
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  {notification.message}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default LtHeader;

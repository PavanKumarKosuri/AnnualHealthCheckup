/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import FAQ from "./FAQ";
import ContactSupport from "./ContactSupport";
import Documentation from "./Documentation";
import ChatSupport from "./ChatSupport";

const HelpAndSupport = () => {
  const [selectedTab, setSelectedTab] = useState("FAQ");

  const renderContent = () => {
    switch (selectedTab) {
      case "FAQ":
        return <FAQ />;
      case "ContactSupport":
        return <ContactSupport />;
      case "Documentation":
        return <Documentation />;
      // case "ChatSupport":
      //   return <ChatSupport />;
      default:
        return <FAQ />;
    }
  };

  return (
    <div className="container mt-4">
      <h3>Help & Support</h3>
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button
            className={`nav-link ${selectedTab === "FAQ" ? "active" : ""}`}
            onClick={() => setSelectedTab("FAQ")}
          >
            FAQ
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${
              selectedTab === "ContactSupport" ? "active" : ""
            }`}
            onClick={() => setSelectedTab("ContactSupport")}
          >
            Contact Support
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${
              selectedTab === "Documentation" ? "active" : ""
            }`}
            onClick={() => setSelectedTab("Documentation")}
          >
            Documentation
          </button>
        </li>
        <li className="nav-item">
          {/* <button
            className={`nav-link ${
              selectedTab === "ChatSupport" ? "active" : ""
            }`}
            onClick={() => setSelectedTab("ChatSupport")}
          >
            Chat Support
          </button> */}
        </li>
      </ul>
      <div className="mt-3">{renderContent()}</div>
    </div>
  );
};

export default HelpAndSupport;

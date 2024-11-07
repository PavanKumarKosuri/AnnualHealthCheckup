/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import Overview from "./Options/Overview";
import Employees from "./Options/Employees";
import Settings from "./Options/Settings";
import ReportsDownload from "./Options/ReportsDownload";
import Registrations from "./Options/Registrations";
import CommunicationHub from "./Options/CommunicationHub";
import HelpSupport from "./Options/HelpSupport/HelpSupport";

const Option = ({ selectedOption, clientId, hrId }) => {
  const renderComponent = () => {
    switch (selectedOption) {
      case "Overview":
        return <Overview clientId={clientId} hrId={hrId} />;
      case "Employees":
        return <Employees clientId={clientId} hrId={hrId} />;
      case "ReportsDownload":
        return <ReportsDownload clientId={clientId} hrId={hrId} />;
      case "CommunicationHub":
        return <CommunicationHub />;
      case "HelpSupport":
        return <HelpSupport />;
      case "Settings":
        return <Settings />;
      case "Registrations":
        return <Registrations />;
      default:
        return <Overview clientId={clientId} hrId={hrId} />;
    }
  };

  return <>{renderComponent()}</>;
};

export default Option;

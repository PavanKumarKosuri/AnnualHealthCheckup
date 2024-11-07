/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import Overview from "./Options/Overview";
import HRManagement from "./Options/HRManagement";
import EmployeeOverview from "./Options/EmployeeOverview";
import CampManagement from "./Options/CampManagement";
import Reports from "./Options/Reports";
import CommunicationHub from "./Options/CommunicationHub";
import Settings from "./Options/Settings";
import AnalyticsReports from "./Options/AnalyticsReports";
import HelpAndSupport from "./Options/HelpSupport/HelpAndSupport";

const Option = ({ selectedOption, city, companyName, uniqueKey }) => {
  const renderComponent = () => {
    switch (selectedOption) {
      case "Overview":
        return <Overview city={city} companyName={companyName} />;
      case "HRManagement":
        return <HRManagement />;
      case "EmployeeOverview":
        return <EmployeeOverview city={city} companyName={companyName} />;
      case "CampManagement":
        return <CampManagement />;
      case "Reports":
        return <Reports />;
      case "CommunicationHub":
        return <CommunicationHub />;
      case "Settings":
        return <Settings />;
      case "AnalyticsReports":
        return <AnalyticsReports />;
      case "HelpAndSupport":
        return <HelpAndSupport />;
      default:
        return <Overview city={city} companyName={companyName} />;
    }
  };

  return <>{renderComponent()}</>;
};

export default Option;

// vendor\src\components\Option.jsx
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import Overview from "./Options/Overview/Overview.jsx";
import SampleManagement from "./Options/SampleManagement.jsx";
import ReportManagement from "./Options/ReportManagement";
import Communication from "./Options/Communication";
import Settings from "./Options/Settings";
import HelpAndSupport from "./Options/HelpSupport/HelpAndSupport.jsx";
import TestimonialManagement from "./Options/TestimonialManagement";

const Option = ({ selectedOption }) => {
  const renderComponent = () => {
    switch (selectedOption) {
      case "Overview":
        return <Overview />;
      case "SampleManagement":
        return <SampleManagement />;
      case "ReportManagement":
        return <ReportManagement />;
      case "TestimonialManagement":
        return <TestimonialManagement />;
      case "Communication":
        return <Communication />;
      case "Settings":
        return <Settings />;
      case "HelpAndSupport":
        return <HelpAndSupport />;
      default:
        return <Overview />;
    }
  };

  return <>{renderComponent()}</>;
};

export default Option;

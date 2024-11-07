/* eslint-disable no-unused-vars */
import React from "react";
import { BsFillArchiveFill, BsFillBellFill } from "react-icons/bs";
import { FaTasks } from "react-icons/fa";
import { MdPending } from "react-icons/md";
import "../../../styles/styles.css";
import RecentActivities from "./RecentActivities";
import PendingTasks from "./PendingTasks";
import Notifications from "./Notifications";
import SampleProcessingSpeed from "./SampleProcessingSpeed";
import UpcomingSchedule from "./UpcomingSchedule";
import QuickActions from "./QuickActions";
import { useState } from "react";

const Overview = () => {
  const [overviewData, setOverviewData] = useState({
    totalSamples: 120,
    samplesProcessed: 90,
    pendingReports: 30,
    urgentTasks: 5,
  });

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>Vendor Dashboard Overview</h3>
      </div>
      <div className="main-cards row">
        <div className="col-12 col-sm-6 col-md-3 mb-3">
          <div className="card">
            <div className="card-inner">
              <h4>Total Samples</h4>
              <BsFillArchiveFill className="card_icon" />
            </div>
            <h1>{overviewData.totalSamples}</h1>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-3 mb-3">
          <div className="card">
            <div className="card-inner">
              <h4>Samples Processed</h4>
              <FaTasks className="card_icon" />
            </div>
            <h1>{overviewData.samplesProcessed}</h1>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-3 mb-3">
          <div className="card">
            <div className="card-inner">
              <h4>Pending Reports</h4>
              <MdPending className="card_icon" />
            </div>
            <h1>{overviewData.pendingReports}</h1>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-3 mb-3">
          <div className="card">
            <div className="card-inner">
              <h4>Urgent Tasks</h4>
              <BsFillBellFill className="card_icon" />
            </div>
            <h1>{overviewData.urgentTasks}</h1>
          </div>
        </div>
      </div>
      <RecentActivities />
      <PendingTasks />
      <Notifications />
      <SampleProcessingSpeed />
      <UpcomingSchedule />
      <QuickActions />
    </main>
  );
};

export default Overview;

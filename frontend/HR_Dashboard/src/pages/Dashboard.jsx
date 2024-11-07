import { useState, useEffect } from "react";
import Header2 from "../components/shared/Header2";
import Option from "../components/Option";
import Sidebar from "../components/Sidebar";
import "../styles/styles.css";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Overview");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  // Fetch client_id and hr_id from localStorage
  const clientId = localStorage.getItem("client_id");
  const hrId = localStorage.getItem("hr_id");
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!token || !clientId || !hrId) {
      navigate("/");
    }
  }, [token, clientId, hrId, navigate]);

  const handleLogout = () => {
    // Remove all relevant data from localStorage on logout
    localStorage.removeItem("accessToken");
    localStorage.removeItem("client_id");
    localStorage.removeItem("hr_id");
    setIsModalOpen(false);
    navigate("/");
  };

  const openLogoutModal = () => {
    setIsModalOpen(true);
  };

  const closeLogoutModal = () => {
    setIsModalOpen(false);
  };

  const toggleSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const handleMenuClick = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2" style={{ marginLeft: "-20px" }}>
          <Sidebar
            openSidebarToggle={openSidebarToggle}
            OpenSidebar={toggleSidebar}
            handleMenuClick={handleMenuClick}
            handleLogout={openLogoutModal}
          />
        </div>
        <div className="col-md-10">
          <Header2 OpenSidebar={toggleSidebar} />
          <Option
            selectedOption={selectedOption}
            clientId={clientId} // Pass clientId and hrId to Option component
            hrId={hrId}
          />
        </div>
      </div>

      <div
        className={`modal fade ${isModalOpen ? "show" : ""}`}
        id="logoutModal"
        tabIndex="-1"
        aria-labelledby="logoutModalLabel"
        aria-hidden={!isModalOpen}
        style={{ display: isModalOpen ? "block" : "none" }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="logoutModalLabel">
                Confirm Logout
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={closeLogoutModal}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">Are you sure you want to logout?</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeLogoutModal}
              >
                No
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleLogout}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="modal-backdrop fade show"
          style={{ zIndex: 1040 }}
        ></div>
      )}
    </div>
  );
};

export default Dashboard;

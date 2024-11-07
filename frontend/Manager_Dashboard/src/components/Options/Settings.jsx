/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import api from "../../axiosConfig";

const Settings = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
    contactEmail: "",
    contactPhone: "",
    notifyByEmail: true,
    notifyBySMS: true,
    notifyByWhatsApp: true,
    emailIntegration: "",
    smsIntegration: "",
    whatsappIntegration: "",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmitChangePassword = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmNewPassword) {
      setMessage("New password and confirm new password must match!");
      setMessageType("error");
      setTimeout(() => setMessage(""), 4000);
      return;
    }
    try {
      const token = localStorage.getItem("auth-token");
      const email = localStorage.getItem("email");

      const response = await api.post(
        `/api/hr/change-password`,
        {
          email,
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setMessage("Password changed successfully");
        setMessageType("success");
        setFormData({
          oldPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      } else {
        setMessage("Failed to change password");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setMessage("Failed to change password");
      setMessageType("error");
    }
    setTimeout(() => setMessage(""), 4000);
  };

  const handleSubmitProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("auth-token");
      const response = await api.put(
        `/api/hr/update-profile`,
        {
          contactEmail: formData.contactEmail,
          contactPhone: formData.contactPhone,
          notifyByEmail: formData.notifyByEmail,
          notifyBySMS: formData.notifyBySMS,
          notifyByWhatsApp: formData.notifyByWhatsApp,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setMessage("Profile updated successfully");
        setMessageType("success");
      } else {
        setMessage("Failed to update profile");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Failed to update profile");
      setMessageType("error");
    }
    setTimeout(() => setMessage(""), 4000);
  };

  const handleSubmitIntegrationUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("auth-token");
      const response = await api.put(
        `/api/hr/update-integration`,
        {
          emailIntegration: formData.emailIntegration,
          smsIntegration: formData.smsIntegration,
          whatsappIntegration: formData.whatsappIntegration,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setMessage("Integration settings updated successfully");
        setMessageType("success");
      } else {
        setMessage("Failed to update integration settings");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error updating integration settings:", error);
      setMessage("Failed to update integration settings");
      setMessageType("error");
    }
    setTimeout(() => setMessage(""), 4000);
  };

  return (
    <div className="container mx-2" style={{ maxWidth: "500px" }}>
      <h3 className="main-title mt-3">Settings</h3>

      <section className="mt-4">
        <h4>Change Password</h4>
        <form onSubmit={handleSubmitChangePassword}>
          <div className="mb-3">
            <label htmlFor="oldPassword" className="form-label">
              Old Password
            </label>
            <input
              type="password"
              className="form-control"
              id="oldPassword"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="newPassword" className="form-label">
              New Password
            </label>
            <input
              type="password"
              className="form-control"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="confirmNewPassword" className="form-label">
              Confirm New Password
            </label>
            <input
              type="password"
              className="form-control"
              id="confirmNewPassword"
              name="confirmNewPassword"
              value={formData.confirmNewPassword}
              onChange={handleChange}
              required
            />
          </div>
          {message && (
            <div
              className={`alert ${
                messageType === "success" ? "alert-success" : "alert-danger"
              }`}
            >
              {message}
            </div>
          )}
          <button type="submit" className="btn btn-outline-dark">
            Change Password
          </button>
        </form>
      </section>

      <section className="mt-4">
        <h4>Profile Settings</h4>
        <form onSubmit={handleSubmitProfileUpdate}>
          <div className="mb-3">
            <label htmlFor="contactEmail" className="form-label">
              Contact Email
            </label>
            <input
              type="email"
              className="form-control"
              id="contactEmail"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="contactPhone" className="form-label">
              Contact Phone
            </label>
            <input
              type="text"
              className="form-control"
              id="contactPhone"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="notifyByEmail"
              name="notifyByEmail"
              checked={formData.notifyByEmail}
              onChange={handleChange}
            />
            <label htmlFor="notifyByEmail" className="form-check-label">
              Notify by Email
            </label>
          </div>
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="notifyBySMS"
              name="notifyBySMS"
              checked={formData.notifyBySMS}
              onChange={handleChange}
            />
            <label htmlFor="notifyBySMS" className="form-check-label">
              Notify by SMS
            </label>
          </div>
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="notifyByWhatsApp"
              name="notifyByWhatsApp"
              checked={formData.notifyByWhatsApp}
              onChange={handleChange}
            />
            <label htmlFor="notifyByWhatsApp" className="form-check-label">
              Notify by WhatsApp
            </label>
          </div>
          <button type="submit" className="btn btn-outline-dark">
            Update Profile
          </button>
        </form>
      </section>

      {/* <section className="mt-4">
        <h4>Integration Settings</h4>
        <form onSubmit={handleSubmitIntegrationUpdate}>
          <div className="mb-3">
            <label htmlFor="emailIntegration" className="form-label">
              Email Integration
            </label>
            <input
              type="text"
              className="form-control"
              id="emailIntegration"
              name="emailIntegration"
              value={formData.emailIntegration}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="smsIntegration" className="form-label">
              SMS Integration
            </label>
            <input
              type="text"
              className="form-control"
              id="smsIntegration"
              name="smsIntegration"
              value={formData.smsIntegration}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="whatsappIntegration" className="form-label">
              WhatsApp Integration
            </label>
            <input
              type="text"
              className="form-control"
              id="whatsappIntegration"
              name="whatsappIntegration"
              value={formData.whatsappIntegration}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-outline-dark">
            Update Integrations
          </button>
        </form>
      </section> */}
    </div>
  );
};

export default Settings;

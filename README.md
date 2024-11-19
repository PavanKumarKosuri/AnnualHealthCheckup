---

# 🏥 Annual Health Checkup Camp Module

This repository contains the **Annual Health Checkup Camp Module**, designed to streamline health checkup processes in corporate environments. The solution facilitates seamless workflows for employees, HR personnel, phlebotomists, managers, and vendors through various dashboards. It includes features like registration, sample collection, and analytics for efficient management.

---

## **📋 Table of Contents**

1. [📖 Introduction](#-introduction)
2. [🌐 Deployed Links](#-deployed-links)
3. [🛠️ Technologies Used](#️-technologies-used)
4. [✨ Key Features](#-key-features)
5. [🔄 Process Flow](#-process-flow)
6. [📊 Dashboards Overview](#-dashboards-overview)
7. [⚙️ Setup Instructions](#️-setup-instructions)
8. [📜 License](#-license)

---

## **📖 Introduction**

The **Annual Health Checkup Camp Module** is a corporate-centric platform aimed at organizing health checkup camps. It includes a series of workflows and dashboards tailored to meet the needs of:
- 👩‍💼 **Employees**: Registration, package selection, and scheduling.
- 🧑‍💻 **HR**: Uploading employee data and generating registration links.
- 🧑‍🔬 **Phlebotomists**: Managing sample collection processes.
- 🛠️ **Admins**: Overseeing all camp activities and analytics.
- 🏢 **Vendors and Managers**: Monitoring operations and ensuring smooth execution.

---

You’re right; the links can be better presented to make the README visually appealing and user-friendly. We can enhance them with proper formatting, additional context, and tooltips or descriptions. Here's how we can restructure the **Deployed Links** section:

---

## **🌐 Deployed Links**

### **Backend**
🔗 **[Backend API](https://annualhealthcheckup.onrender.com)**  
_The backend server for the Annual Health Checkup Module is deployed on Render._

---

### **Frontend Portals**

1. 👨‍💻 **[Employee Registration Portal](https://ahcuserreg.vercel.app/#/home-page/1/CLT-85B8CAEA)**  
   _A dedicated portal where employees can register for health checkups using their unique registration links._

2. 🛡️ **[Super Admin Dashboard](https://ahc-pi.vercel.app/#/)**  
   _Centralized dashboard for managing all aspects of the health checkup camps, including employees, phlebotomists, and reports._

3. 🏢 **[HR Dashboard](https://ahchrdashboard.vercel.app/#/)**  
   _A portal for HR personnel to upload employee data, generate registration links, and track participation._

4. 🧑‍🔬 **[Phlebotomist Dashboard](https://ahcphlebo.vercel.app/#/)**  
   _A dashboard for phlebotomists to manage sample collection and view their assigned tasks._

5. 📋 **[Manager Dashboard](https://ahcmanager.vercel.app/#/)**  
   _A portal for managers to oversee camp operations and monitor employee participation._

6. 🤝 **[Vendor Dashboard](https://ahcvendor.vercel.app/#/)**  
   _A dashboard for vendors to track and manage their responsibilities during health camps._

---

## **🛠️ Technologies Used**

- **Backend**: Node.js (Deployed on Render) ⚙️
- **Frontend**: React.js + Vite (Deployed on Vercel) ⚡
- **Database**: MySQL (Hosted on AWS RDS) 💾
- **Miscellaneous**: 
  - 🛡️ **Helmet.js**: For enhanced security.
  - 📦 **Compression**: To optimize server responses.
  - 🔒 **Rate Limiting**: To prevent abuse.
  - ☁️ **AWS Services**: For scalable database management.

---

## **✨ Key Features**

1. 👩‍💼 **HR Registration**:
   - Upload employee data via Excel files.
   - Generate unique QR codes and registration links for employees.
2. 👨‍💻 **Employee Registration**:
   - Mobile OTP verification.
   - Eligibility validation based on HR-uploaded data.
   - Selection of health packages and booking time slots.
3. 🧑‍🔬 **Phlebotomist Dashboard**:
   - OTP-based sample collection process.
   - Real-time tracking of sample collection status.
4. 🛡️ **Super Admin Dashboard**:
   - Manage packages, reports, and registrations.
   - Analytics on registrations and sample collection.
5. 🤝 **Vendor and Manager Dashboards**:
   - Monitor and manage camp activities.
   - Oversee vendor and employee operations.

---

## **🔄 Process Flow**

### **1️⃣ HR Registration and Setup**
- 🧑‍💼 HR uploads employee details via the provided portal.
- 🖨️ The system generates a unique QR code and registration link for employee use.

### **2️⃣ Employee Registration**
- 📱 Employees register via the link or QR code shared by HR.
- 🔒 OTP verification ensures secure access.
- ✅ Eligibility is validated against HR-uploaded data.

### **3️⃣ Phlebotomist Sample Collection**
- 📄 Employees visit the camp and provide their booking ID.
- 🧪 Phlebotomists collect samples and verify completion via OTP.

### **4️⃣ Dashboard Analytics**
- 📊 Super Admins, Managers, and Vendors can view real-time analytics and monitor camp progress.

---

## **📊 Dashboards Overview**

### **1. Super Admin Dashboard** 🛡️
- Manage packages, phlebotomists, and vendors.
- Access analytics and reports.

### **2. HR Dashboard** 👩‍💼
- Upload employee data.
- Generate QR codes and registration links.

### **3. Employee Dashboard** 👨‍💻
- Secure registration and package selection.
- Receive booking ID and time slot.

### **4. Phlebotomist Dashboard** 🧑‍🔬
- OTP-based sample collection.
- Track completed and pending collections.

### **5. Vendor and Manager Dashboards** 📋
- Oversee and manage operations at the camp.

---

## **📜 License**
This project is licensed under the [MIT License](LICENSE).

---

### **🎉 Thank You for Visiting!**
We hope this module simplifies your health camp management. Feel free to explore and contribute!


---

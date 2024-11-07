import React from "react";
import ReactDOM from "react-dom/client"; // Import from react-dom/client, not react-dom
import App from "./App";
import { ClientProvider } from "./contexts/ClientContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap/js/dist/dropdown";

// Create the root container once
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the application
root.render(
  <React.StrictMode>
    <ClientProvider>
      <App />
    </ClientProvider>
  </React.StrictMode>
);

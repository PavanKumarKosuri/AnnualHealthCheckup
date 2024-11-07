// src/contexts/ClientContext.jsx

/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../api/apiService";

// Create the Context
export const ClientContext = createContext();

// Create the Provider Component
export const ClientProvider = ({ children }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/clients");
        setClients(response.data);
      } catch (err) {
        console.error("Error fetching clients:", err);
        if (err.response && err.response.status !== 401) {
          toast.error("Failed to fetch clients.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  // CRUD Operations

  // Create
  const addClient = async (newClient) => {
    try {
      const response = await api.post("/clients", newClient);
      setClients((prevClients) => [...prevClients, response.data]);
      toast.success("Client added successfully!");
    } catch (err) {
      console.error("Error adding client:", err);
      toast.error("Failed to add client.");
    }
  };

  // Read
  const getClientById = (id) => {
    return clients.find((client) => client.id === parseInt(id));
  };

  // Update
  const updateClient = async (updatedClient) => {
    try {
      await api.put(`/clients/${updatedClient.id}`, updatedClient);
      setClients((prevClients) =>
        prevClients.map((client) =>
          client.id === updatedClient.id ? updatedClient : client
        )
      );
      toast.success("Client updated successfully!");
    } catch (err) {
      console.error("Error updating client:", err);
      toast.error("Failed to update client.");
    }
  };

  // Delete
  const deleteClient = async (id) => {
    try {
      await api.delete(`/clients/${id}`);
      setClients((prevClients) =>
        prevClients.filter((client) => client.id !== id)
      );
      toast.success("Client deleted successfully!");
    } catch (err) {
      console.error("Error deleting client:", err);
      toast.error("Failed to delete client.");
    }
  };

  return (
    <ClientContext.Provider
      value={{
        clients,
        addClient,
        getClientById,
        updateClient,
        deleteClient,
        loading,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};

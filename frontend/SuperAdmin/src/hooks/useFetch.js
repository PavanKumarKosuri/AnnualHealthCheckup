// src/hooks/useFetch.js

import { useState, useEffect } from "react";
import api from "../api/apiService";

const useFetch = (endpoint, params = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await api.get(endpoint, { params });
      setData(response.data);
      setError(null);
    } catch (err) {
      console.error(`Error fetching data from ${endpoint}:`, err);
      setError(err.response?.data?.error || "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, JSON.stringify(params)]); // Re-fetch if endpoint or params change

  return { data, loading, error, refetch: fetchData };
};

export default useFetch;

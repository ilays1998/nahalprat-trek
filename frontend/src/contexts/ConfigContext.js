// src/contexts/ConfigContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import config from "../config"; // your static config (contains API_BASE_URL etc.)

const ConfigContext = createContext();

export const useConfig = () => {
  const ctx = useContext(ConfigContext);
  if (!ctx) throw new Error("useConfig must be used within a ConfigProvider");
  return ctx;
};

export const ConfigProvider = ({ children }) => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = config.API_BASE_URL;

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/packages`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setPackages(data);
      } catch (err) {
        console.error("Failed to fetch packages:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, [API_BASE_URL]);

  const value = {
    loading,
    error,
    packages,
    getPackage: (name) => packages.find((p) => p.name === name),
  };

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
};

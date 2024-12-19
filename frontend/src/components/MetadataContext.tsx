import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

interface Metadata {
  categories: string[];
  albums: string[];
}

interface MetadataContextType {
  metadata: Metadata | null;
  refreshMetadata: () => void;
}

const MetadataContext = createContext<MetadataContextType | null>(null);

export const MetadataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [metadata, setMetadata] = useState<Metadata | null>(null);

  // Fetch metadata function
  const fetchMetadata = async () => {
    try {
      const response = await axios.get<{ categories: string[]; albums: string[] }>(
        "http://127.0.0.1:5000/catalog/metadata"
      );
      setMetadata(response.data);
    } catch (error) {
      console.error("Failed to load metadata:", error);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchMetadata();
  }, []);

  // Expose the fetch function as a "refresh" action
  const refreshMetadata = () => {
    fetchMetadata();
  };

  return (
    <MetadataContext.Provider value={{ metadata, refreshMetadata }}>
      {children}
    </MetadataContext.Provider>
  );
};

export const useMetadata = () => {
  const context = useContext(MetadataContext);
  if (!context) {
    throw new Error("useMetadata must be used within a MetadataProvider");
  }
  return context;
};
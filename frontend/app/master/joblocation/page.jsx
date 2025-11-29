"use client";

import JobLocationForm from "./JobLocationForm";
import JobLocationList from "./JobLocationList";
import { useState, useEffect } from "react";

export default function JobLocationPage() {
  const [locations, setLocations] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch categories from backend
  const loadLocations = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`http://localhost:5000/api/job-locations`);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to load locations");
      }
      const data = await res.json();
      setLocations(data);
    } catch (err) {
    //   console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLocations();
  }, []);

  return (
    <div className="p-8 bg-[#E2F4FA] min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Job Location</h1>

      <JobLocationForm
        editItem={editItem}
        setEditItem={setEditItem}
        reload={loadLocations}
      />

      {loading && <p className="mt-4">Loading ...</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}

      <JobLocationList
        locations={locations}
        setEditItem={setEditItem}
        reload={loadLocations}
      />
    </div>
  );
}

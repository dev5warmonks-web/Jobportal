"use client";

import ApplicationsForm from "./ApplicationsForm";
import ApplicationsList from "./ApplicationsList";
import { useState, useEffect } from "react";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch applications from backend
  const loadApplications = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`https://api.mindssparsh.com/api/applications`);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to load applications");
      }
      const data = await res.json();
      setApplications(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  return (
    <div className="p-8 bg-[#E2F4FA] min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Applications</h1>

      <ApplicationsForm
        editItem={editItem}
        setEditItem={setEditItem}
        reload={loadApplications}
      />

      {loading && <p className="mt-4">Loading applications...</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}

      <ApplicationsList
        applications={applications}
        setEditItem={setEditItem}
        reload={loadApplications}
      />
    </div>
  );
}

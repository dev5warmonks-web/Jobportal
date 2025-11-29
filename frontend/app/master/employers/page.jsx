"use client";

import EmployersForm from "./EmployersForm";
import EmployersList from "./EmployersList";
import { useState, useEffect } from "react";

export default function EmployersPage() {
  const [employers, setEmployers] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch employers from backend
  const loadEmployers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`http://localhost:5000/api/users?user_role=employer`);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to load employers");
      }
      const data = await res.json();
      setEmployers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployers();
  }, []);

  return (
    <div className="p-8 bg-[#E2F4FA] min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Employers</h1>

      <EmployersForm
        editItem={editItem}
        setEditItem={setEditItem}
        reload={loadEmployers}
      />

      {loading && <p className="mt-4">Loading employers...</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}

      <EmployersList
        employers={employers}
        setEditItem={setEditItem}
        reload={loadEmployers}
      />
    </div>
  );
}

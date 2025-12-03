"use client";

import EmployersForm from "./EmployersForm";
import EmployersList from "./EmployersList";
import { useState, useEffect } from "react";

export default function EmployersPage() {
  const [employers, setEmployers] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState("employer"); // default role

  // Fetch users by role name
  const loadUsersByRole = async (roleName) => {
    if (!roleName) return;
    setLoading(true);
    setError("");
    try {
      console.log("Loading users with role:", roleName);
      const res = await fetch(
        `https://api.mindssparsh.com/api/users/role-name/${roleName}`
      );
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to load users");
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
    loadUsersByRole(role);
  }, [role]);

  return (
    <div className="p-8 bg-[#E2F4FA] min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-black">
        {role ? role.charAt(0).toUpperCase() + role.slice(1) + "s" : "Users"}
      </h1>

      <EmployersForm
        editItem={editItem}
        setEditItem={setEditItem}
        reload={() => loadUsersByRole(role)}
      />

      {loading && <p className="mt-4">Loading {role}s...</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}

      <EmployersList
        employers={employers}
        setEditItem={setEditItem}
        reload={() => loadUsersByRole(role)}
      />
    </div>
  );
}

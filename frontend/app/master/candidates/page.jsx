"use client";

import CandidatesForm from "./CandidatesForm";
import CandidatesList from "./CandidatesList";
import { useState, useEffect } from "react";

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState("candidate"); // default role

  // Fetch candidates from backend
  const loadCandidates = async (roleName) => {
    if (!roleName) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`https://api.mindssparsh.com/api/users/role-name/${roleName}`);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to load candidates");
      }
      const data = await res.json();
      console.log(data);
      setCandidates(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCandidates(role);
  }, [role]);

  return (
    <div className="p-8 bg-[#E2F4FA] min-h-screen">
      <h1 className="text-2xl font-bold mb-6">
        {role ? role.charAt(0).toUpperCase() + role.slice(1) + "s" : "Users"}
      </h1>

      <CandidatesForm
        editItem={editItem}
        setEditItem={setEditItem}
        reload={() => loadCandidates(role)}
      />

      {loading && <p className="mt-4">Loading candidates...</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}

      <CandidatesList
        candidates={candidates}
        setEditItem={setEditItem}
        reload={() => loadCandidates(role)}
      />
    </div>
  );
}

"use client";

import SkillsForm from "./SkillsForm";
import SkillsList from "./SkillsList";
import { useState, useEffect } from "react";
import { BASE_URL } from "../../config/apiConfig";

export default function IndustryPage() {
  const [skills, setskills] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch categories from backend
  const loadSkills = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${BASE_URL}/api/skills`);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to load");
      }
      const data = await res.json();
      setskills(data);
    } catch (err) {
    //   console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  return (
    <div className="p-8 bg-[#d6f2fb] min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-black">Key Skills</h1>

      <SkillsForm
        editItem={editItem}
        setEditItem={setEditItem}
        reload={loadSkills}
      />

      {loading && <p className="mt-4">Loading skills list...</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}

      <SkillsList
        skills={skills}
        setEditItem={setEditItem}
        reload={loadSkills}
      />
    </div>
  );
}

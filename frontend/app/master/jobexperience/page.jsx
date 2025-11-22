"use client";

import JobExperienceForm from "./JobExperienceForm";
import JobExperienceList from "./JobExperienceList";
import { useState, useEffect } from "react";

export default function JobExperiencePage() {
  const [experience, setCategories] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch categories from backend
  const loadExperience = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`http://localhost:5000/api/jobcategory`);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to load categories");
      }
      const data = await res.json();
      setCategories(data);
    } catch (err) {
    //   console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExperience();
  }, []);

  return (
    <div className="p-8 bg-[#E2F4FA] min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Job Experience</h1>

      <JobExperienceForm
        editItem={editItem}
        setEditItem={setEditItem}
        reload={loadExperience}
      />

      {loading && <p className="mt-4">Loading ...</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}

      <JobExperienceList
        experience={experience}
        setEditItem={setEditItem}
        reload={loadExperience}
      />
    </div>
  );
}

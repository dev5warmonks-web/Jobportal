"use client";

import EducationForm from "./EducationForm";
import EducationList from "./EducationList";
import { useState, useEffect } from "react";

export default function EducationPage() {
  const [education, seteducation] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch categories from backend
  const loadEducation = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`http://localhost:5000/api/education`);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to load");
      }
      const data = await res.json();
      seteducation(data);
    } catch (err) {
    //   console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEducation();
  }, []);

  return (
    <div className="p-8 bg-[#E2F4FA] min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-black">Highest Education</h1>

      <EducationForm
        editItem={editItem}
        setEditItem={setEditItem}
        reload={loadEducation}
      />

      {loading && <p className="mt-4">Loading education list...</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}

      <EducationList
        education={education}
        setEditItem={setEditItem}
        reload={loadEducation}
      />
    </div>
  );
}

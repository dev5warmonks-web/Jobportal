"use client";

import EducationForm from "./EducationForm";
import EducationList from "./EducationList";
import { useState, useEffect } from "react";
import { BASE_URL } from "../../config/apiConfig";

export default function EducationPage() {
  const [education, seteducation] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all data from backend
  const loadEducation = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${BASE_URL}/api/education`);
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
    <div className="p-8 bg-[#d6f2fb] min-h-screen">
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

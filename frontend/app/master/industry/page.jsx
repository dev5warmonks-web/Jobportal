"use client";

import IndustryForm from "./IndustryForm";
import IndustryList from "./IndustryList";
import { useState, useEffect } from "react";
import { BASE_URL } from "../../config/apiConfig";

export default function IndustryPage() {
  const [industry, setindustry] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch categories from backend
  const loadIndustry = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${BASE_URL}/api/industry`);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to load");
      }
      const data = await res.json();
      setindustry(data);
    } catch (err) {
    //   console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIndustry();
  }, []);

  return (
    <div className="p-8 bg-[#d6f2fb] min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-black">Preferred Industry</h1>

      <IndustryForm
        editItem={editItem}
        setEditItem={setEditItem}
        reload={loadIndustry}
      />

      {loading && <p className="mt-4">Loading industry list...</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}

      <IndustryList
        industry={industry}
        setEditItem={setEditItem}
        reload={loadIndustry}
      />
    </div>
  );
}

"use client";

import JobCategoryForm from "./JobCategoryForm";
import JobCategoryList from "./JobCategoryList";
import { useState, useEffect } from "react";

export default function JobCategoryPage() {
  const [categories, setCategories] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch categories from backend
  const loadCategories = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`http://localhost:5000/api/job-categories`);
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
    loadCategories();
  }, []);

  return (
    <div className="p-8 bg-[#E2F4FA] min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Job Categories</h1>

      <JobCategoryForm
        editItem={editItem}
        setEditItem={setEditItem}
        reload={loadCategories}
      />

      {loading && <p className="mt-4">Loading categories...</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}

      <JobCategoryList
        categories={categories}
        setEditItem={setEditItem}
        reload={loadCategories}
      />
    </div>
  );
}

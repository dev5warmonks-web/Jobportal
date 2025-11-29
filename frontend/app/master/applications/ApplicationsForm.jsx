"use client";

import { useState } from "react";

export default function ApplicationsForm({ editItem, setEditItem, reload }) {
  const [formData, setFormData] = useState(editItem || { status: "", notes: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editItem ? "PUT" : "POST";
      const url = editItem
        ? `http://localhost:5000/api/applications/${editItem._id}`
        : `http://localhost:5000/api/applications`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save application");
      setFormData({ status: "", notes: "" });
      setEditItem(null);
      reload();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-6">
      <input
        type="text"
        name="status"
        placeholder="Status (e.g., pending, approved, rejected)"
        value={formData.status}
        onChange={handleChange}
        className="w-full p-2 border mb-3 rounded"
        required
      />
      <textarea
        name="notes"
        placeholder="Notes"
        value={formData.notes}
        onChange={handleChange}
        className="w-full p-2 border mb-3 rounded"
        rows="4"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        {editItem ? "Update" : "Add"} Application
      </button>
      {editItem && (
        <button
          type="button"
          onClick={() => {
            setEditItem(null);
            setFormData({ status: "", notes: "" });
          }}
          className="ml-2 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Cancel
        </button>
      )}
    </form>
  );
}

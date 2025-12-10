"use client";

// import { useState } from "react";
import { useState, useEffect } from "react";
import { BASE_URL } from "../../config/apiConfig";

export default function CandidatesForm({ editItem, setEditItem, reload }) {
  const [formData, setFormData] = useState(editItem || { name: "", email: "", skills: "" });

  useEffect(() => {
    if (editItem) {
      setFormData({
        name: editItem.firstName || "",
        email: editItem.email || "",
        skills: Array.isArray(editItem.skills)
          ? editItem.skills.join(", ")
          : editItem.skills || "",
      });
    }
  }, [editItem]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      firstName: formData.name,
      lastName: "",
      email: formData.email,
      skills: formData.skills.split(",").map((s) => s.trim()),
      user_role: "candidate",
    };
    try {
      const method = editItem ? "PUT" : "POST";
      const url = editItem
        ? `${BASE_URL}/api/candidates/${editItem._id}`
        : `${BASE_URL}/api/candidates`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save candidate");
      setFormData({ name: "", email: "", skills: "" });
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
        name="name"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleChange}
        className="w-full p-2 border mb-3 rounded"
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="w-full p-2 border mb-3 rounded"
        required
      />
      <textarea
        name="skills"
        placeholder="Skills (comma-separated)"
        value={formData.skills}
        onChange={handleChange}
        className="w-full p-2 border mb-3 rounded"
        rows="4"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        {editItem ? "Update" : "Add"} Candidate
      </button>
      {editItem && (
        <button
          type="button"
          onClick={() => {
            setEditItem(null);
            setFormData({ name: "", email: "", skills: "" });
          }}
          className="ml-2 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Cancel
        </button>
      )}
    </form>
  );
}

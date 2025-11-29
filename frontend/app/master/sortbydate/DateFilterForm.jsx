'use client';

import { useState, useEffect, useRef } from "react";

export default function DateFilterForm({ editItem, setEditItem, reload }) {
  const [form, setForm] = useState({
    sortByDate: "",
    is_active: true,
  });

  const inputRef = useRef(null);

  useEffect(() => {
    if (editItem) {
      setForm({
        sortByDate: editItem.sortByDate || "",
        is_active: editItem.is_active ?? true,
      });
      // Focus the input when editing
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } else {
      setForm({ sortByDate: "", is_active: true });
    }
  }, [editItem]);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editItem ? "PUT" : "POST";

    const url = editItem
      ? `http://localhost:5000/api/sort-by-dates/${editItem._id}`
      : `http://localhost:5000/api/sort-by-dates`;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Something went wrong");
      }

      await res.json();

      alert(editItem ? "Updated Successfully" : "Added Successfully");

      setForm({ sortByDate: "", is_active: true });
      setEditItem(null);
      reload();
    } catch (err) {
      // alert("Error: " + err.message);
      alert("Data Exist");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded shadow mx-auto"
    >
      <h2 className="text-xl font-bold mb-4">
        {editItem ? "Edit Sort By Date" : "Add Sort By Date"}
      </h2>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <label className="block mb-1 font-medium">Sort By Date</label>
          <input
            type="text"
            name="sortByDate"
            value={form.sortByDate}
            onChange={handleChange}
            ref={inputRef}
            className="w-full p-2 rounded bg-[#CCE9F2] border"
            required
          />
        </div>

        <div className="flex items-center gap-2 mt-4 md:mt-7">
          <input
            type="checkbox"
            name="is_active"
            checked={form.is_active}
            onChange={handleChange}
            className="w-5 h-5"
          />
          <label className="font-medium">Active</label>
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition"
      >
        {editItem ? "Update" : "Save"}
      </button>
    </form>
  );
}

"use client";

import { useState, useEffect } from "react";

export default function EmployersForm({ editItem, setEditItem, reload }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    companyName: "",
    mobile: "",
    password: "",
    logo: null,
    isFeatured: false,
  });

  useEffect(() => {
    if (editItem) {
      setFormData({
        firstName: editItem.firstName || "",
        lastName: editItem.lastName || "",
        email: editItem.email || "",
        companyName: editItem.companyName || "",
        mobile: editItem.mobile || "",
        password: "", // Don't show password on edit
        logo: null, // Reset logo input on edit
        isFeatured: editItem.isFeatured || false,
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        companyName: "",
        mobile: "",
        password: "",
        logo: null,
        isFeatured: false,
      });
    }
  }, [editItem]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editItem ? "PUT" : "POST";
      const url = editItem
        ? `http://localhost:5000/api/users/${editItem._id}`
        : `http://localhost:5000/api/users`;

      const data = new FormData();
      console.log(formData);
      data.append("firstName", formData.firstName);
      data.append("lastName", formData.lastName);
      data.append("email", formData.email);
      data.append("companyName", formData.companyName);
      data.append("mobile", formData.mobile);
      // data.append("isFeatured", formData.isFeatured);
      data.append("isFeatured", formData.isFeatured ? "true" : "false");
      if (formData.password) {
        data.append("password", formData.password);
      }
      if (formData.logo) {
        data.append("logo", formData.logo);
      }
console.log(url)
      const res = await fetch(url, {
        method,
        // headers: { "Content-Type": "application/json" }, // Remove Content-Type for FormData
        body: data,
      });

      if (!res.ok) throw new Error("Failed to save employer");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        companyName: "",
        mobile: "",
        password: "",
        logo: null,
        isFeatured: false,
      });
      setEditItem(null);
      reload();
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="text-xl font-bold mb-4">
        {editItem ? "Edit Employer" : "Add New Employer"}
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="w-full p-2 border mt-3 rounded"
        required
      />

      <input
        type="text"
        name="companyName"
        placeholder="Company Name"
        value={formData.companyName}
        onChange={handleChange}
        className="w-full p-2 border mt-3 rounded"
        required
      />

      <input
        type="text"
        name="mobile"
        placeholder="Mobile Phone"
        value={formData.mobile}
        onChange={handleChange}
        className="w-full p-2 border mt-3 rounded"
      />

      <input
        type="password"
        name="password"
        placeholder={editItem ? "Leave blank to keep current password" : "Password"}
        value={formData.password}
        onChange={handleChange}
        className="w-full p-2 border mt-3 rounded"
        required={!editItem}
      />

      <div className="mt-3">
        <label className="block text-sm font-medium text-gray-700">Company Logo</label>
        <input
          type="file"
          name="logo"
          onChange={handleChange}
          className="w-full p-2 border mt-1 rounded"
          accept="image/*"
        />
      </div>

      <div className="mt-3 flex items-center">
        <input
          type="checkbox"
          name="isFeatured"
          checked={formData.isFeatured}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label className="ml-2 block text-sm text-gray-900">Featured Employer</label>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editItem ? "Update" : "Add"} Employer
        </button>
        {editItem && (
          <button
            type="button"
            onClick={() => {
              setEditItem(null);
              setFormData({
                firstName: "",
                lastName: "",
                email: "",
                companyName: "",
                mobile: "",
                password: "",
                logo: null,
                isFeatured: false,
              });
            }}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

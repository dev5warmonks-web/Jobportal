"use client";

import { useState, useEffect } from "react";
import { getUserRole } from "../../api/api";
const API_URL = "https://api.mindssparsh.com/api/users";

export default function EmployersList({ setEditItem, reload }) {
  const [employers, setEmployers] = useState([]);
  const [roles, setRoles] = useState([]);
  // const [employerRoleId, setEmployerRoleId] = useState(null);
  // const [employerRoleName, setEmployerRoleName] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

 // -----------------------------
  // Load Roles (Admin, Employer, Candidate)
  // -----------------------------
  useEffect(() => {
    async function loadRoles() {
      try {
        const allRoles = await getUserRole();
        setRoles(allRoles);

        // Find employer role ID
        const employerRole = allRoles.find(
          r => r.name?.toLowerCase() === "employer"
        );
        alert(employerRole.name);
        if (!employerRole) throw new Error("Employer role not found");
        const employerRoleId = employerRole._id;
        // if (employerRole) {
        //   setEmployerRoleId(employerRole._id);
        //   setEmployerRoleName(employerRole.name);
        // }
      } catch (err) {
        console.error("Failed to fetch roles:", err);
      }
    }

    loadRoles();
  }, []);
 // -----------------------------
  // Load Employers (after role ID loads)
  // -----------------------------
  // useEffect(() => {
  //   if (employerRoleId) {
  //     console.log("Loading employers with role ID:", employerRoleId);
  //     loadEmployers(employerRoleId);
  //   }
  // }, [employerRoleId, reload]);

  const loadEmployers = async (roleId) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}?user_role=${employerRoleId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch employers");
      }
      const data = await response.json();
      setEmployers(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching employers:", err);
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employer?")) {
      try {
        const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (response.ok) {
          setEmployers(employers.filter((emp) => emp._id !== id));
        } else {
          alert("Failed to delete employer");
        }
      } catch (error) {
        console.error("Error deleting employer:", error);
        alert("An error occurred while deleting the employer");
      }
    }
  };

  const handleFeaturedChange = async (employer) => {
    try {
      const updatedStatus = !employer.isFeatured;
      const formData = new FormData();
      formData.append("isFeatured", updatedStatus);

      const response = await fetch(`${API_URL}/${employer._id}`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        setEmployers(
          employers.map((emp) =>
            emp._id === employer._id ? { ...emp, isFeatured: updatedStatus } : emp
          )
        );
      } else {
        alert("Failed to update featured status");
      }
    } catch (error) {
      console.error("Error updating featured status:", error);
      alert("An error occurred while updating featured status");
    }
  };

  const handleEdit = (employer) => {
    if (setEditItem) {
      setEditItem(employer);
      // Scroll to top so user sees the form
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Helper: Convert role ID → role name
  // const getRoleName = (roleId) => {
  //   const role = roles.find((r) => r._id === roleId);
  //   return role?.name || "Unknown";
  

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="flex justify-between items-center p-6 border-b">
        <h2 className="text-2xl font-bold">Employers List</h2>
      </div>

      {loading && <p className="p-6 text-center">Loading employers...</p>}
      {error && <p className="p-6 text-center text-red-600">{error}</p>}

      {!loading && employers.length === 0 && (
        <p className="p-6 text-center text-gray-600">No employers found</p>
      )}

      {!loading && employers.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-xl shadow">
            <thead className="bg-[#CCE9F2] text-left">
              <tr>
                <th className="py-3 px-4">Sl No</th>
                <th className="py-3 px-4">Logo</th>
                <th className="py-3 px-4">First Name</th>
                <th className="py-3 px-4">Last Name</th>
                <th className="py-3 px-4">Company Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Mobile</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employers.map((employer, index) => (
                // employer.role === "employer" && (
                  <tr key={employer._id} className="border-t hover:bg-gray-50">
                    {/* <td className="py-3 px-4 text-sm">{employer._id.substring(0, 8)}...</td> */}
                    {/* Serial number instead of ID */}
                    <td className="py-3 px-4 text-sm">{index + 1}</td>
                    <td className="py-3 px-4">
                      {employer.logo ? (
                        <img
                          src={`https://api.mindssparsh.com/${employer.logo}`}
                          alt="Logo"
                          className="w-10 h-10 object-cover rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-500">
                          N/A
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">{employer.firstName}</td>
                    <td className="py-3 px-4">{employer.lastName}</td>
                    <td className="py-3 px-4">{employer.companyName || "—"}</td>
                    <td className="py-3 px-4">{employer.email}</td>
                    <td className="py-3 px-4">{employer.mobile || "—"}</td>
                    <td className="py-3 px-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={employer.isFeatured || false}
                          onChange={() => handleFeaturedChange(employer)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        {/* Edit */}
                        <button
                          onClick={() => handleEdit(employer)}
                          className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow"
                          title="Edit"
                        >
                          ✏️
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(employer._id)}
                          className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full shadow"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                // )
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

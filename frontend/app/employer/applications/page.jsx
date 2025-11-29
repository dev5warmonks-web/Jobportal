"use client";

import { useState, useEffect } from "react";
const API_URL = "http://localhost:5000/api/applications";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      } else {
        console.error("Failed to fetch applications");
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Update local state
        setApplications(applications.map(app =>
          app._id === id ? { ...app, status: newStatus } : app
        ));
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("An error occurred while updating status");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      try {
        const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (response.ok) {
          setApplications(applications.filter((app) => app._id !== id));
        } else {
          alert("Failed to delete application");
        }
      } catch (error) {
        console.error("Error deleting application:", error);
        alert("An error occurred while deleting the application");
      }
    }
  };

  if (loading) {
    return (
      <div className="mx-auto bg-[#E2F4FA] min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading applications...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto bg-[#E2F4FA] min-h-screen">
      <div className="p-8 bg-[#d6f2fb] min-h-screen font-sans">
        <div className="flex justify-between p-5">
          <h2 className="text-2xl font-semibold mb-6">Job Applications</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-xl shadow mr-[20px]">
            <thead className="bg-[#e8faff] text-left">
              <tr>
                <th className="py-3 px-4">Application ID</th>
                <th className="py-3 px-4">Candidate Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Mobile</th>
                <th className="py-3 px-4">Job Title</th>
                <th className="py-3 px-4">Company</th>
                <th className="py-3 px-4">Applied Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-8 px-4 text-center text-gray-500">
                    No applications found
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app._id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm">{app._id.slice(-6)}</td>
                    <td className="py-3 px-4">
                      {app.userId?.firstName} {app.userId?.lastName}
                    </td>
                    <td className="py-3 px-4">{app.userId?.email}</td>
                    <td className="py-3 px-4">{app.userId?.mobile || 'N/A'}</td>
                    <td className="py-3 px-4 font-medium">{app.jobId?.title}</td>
                    <td className="py-3 px-4">{app.jobId?.company}</td>
                    <td className="py-3 px-4">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusUpdate(app._id, e.target.value)}
                        className={`px-2 py-1 rounded-full text-xs font-medium ${app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          app.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                            app.status === 'accepted' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                          }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        {/* View Details */}
                        <button
                          onClick={() => {
                            alert(`Application Details:\n\nCandidate: ${app.userId?.firstName} ${app.userId?.lastName}\nEmail: ${app.userId?.email}\nJob: ${app.jobId?.title}\nStatus: ${app.status}\nApplied: ${new Date(app.appliedAt).toLocaleString()}`);
                          }}
                          className="p-1.5 bg-black hover:bg-gray-900 text-white rounded-full shadow"
                          title="View Details"
                        >
                          👁️
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(app._id)}
                          className="p-1.5 bg-black hover:bg-red-700 text-white rounded-full shadow"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Total Applications</p>
            <p className="text-2xl font-bold">{applications.length}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Pending</p>
            <p className="text-2xl font-bold text-yellow-800">
              {applications.filter(app => app.status === 'pending').length}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Accepted</p>
            <p className="text-2xl font-bold text-green-800">
              {applications.filter(app => app.status === 'accepted').length}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Rejected</p>
            <p className="text-2xl font-bold text-red-800">
              {applications.filter(app => app.status === 'rejected').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

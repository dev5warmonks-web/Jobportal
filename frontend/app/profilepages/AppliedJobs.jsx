"use client";
import { useState, useEffect } from "react";

export default function AppliedJobs() {
  const BACKEND_BASE = "https://api.mindssparsh.com";
  const [applications, setApplications] = useState([]);
  const [allEmployers, setAllEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Employers 
  useEffect(() => {
    const fetchEmployers = async () => {
      try {
        const res = await fetch(`${BACKEND_BASE}/api/users/role-name/employer`);
        const data = await res.json();
        setAllEmployers(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchEmployers();
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser || storedUser === "undefined") {
      setError("You must be logged in to view applications.");
      setLoading(false);
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    const userId = parsedUser._id;

    const fetchApplications = async () => {
      try {
        const response = await fetch(`${BACKEND_BASE}/api/applications/user/${userId}`);

        if (response.ok) {
          const data = await response.json();
          setApplications(data);
        } else {
          setError("Failed to load applications.");
        }
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError("Failed to load applications.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getLogoForJob = (userId) => {
    const user = allEmployers.find((u) => u._id === userId);
    if (user?.logo) {
      return `${BACKEND_BASE}/uploads/${user.logo}`;
    }
    return "/images/oracle.jpg";
  };

  if (loading) {
    return <div className="text-center p-4">Loading applications...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-[#E2F4FA] p-4 md:p-8">
      <div className="max-w-5xl mx-auto">

        {applications.length === 0 ? (
          <p className="text-gray-600 text-center">
            You haven't applied for any jobs yet.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {applications.map((app) => (
              <div
                key={app._id}
                className="w-full p-[12px] bg-[#E2F4FA] border border-gray-300 rounded-lg shadow-md flex"
              >
                <img
                  src={getLogoForJob(app.jobId?.userid)}
                  alt={app.jobId?.company || "Logo"}
                  className="w-[60px] h-[60px] object-cover rounded-md"
                />

                <div className="ml-4 flex flex-col md:flex-row justify-between text-black w-full">
                  <div>
                    <h4 className="font-semibold text-[18px] leading-[26px] font-['Poppins']">
                      {app.jobId?.title || "Job Title Not Available"}
                    </h4>
                    <p className="text-gray-600 text-[12px] leading-[26px]">
                      <span className="font-bold">
                        {app.jobId?.company || "Company"}
                      </span>
                      {" — "}
                      {[
                        Array.isArray(app.jobId?.location)
                          ? app.jobId.location.join(", ")
                          : app.jobId?.location,
                        app.jobId?.salary,
                        app.jobId?.jobtype,
                      ].filter(Boolean).join(", ")}
                    </p>
                  </div>

                  <div className="md:text-right mt-2 md:mt-0">
                    <p className="text-[12px] leading-[22px]">
                      <span>
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </span>
                    </p>
                    <div className="flex gap-[16px] mt-1 md:justify-end">
                      <span
                        className={`text-[12px] leading-[22px] text-white rounded-full px-[16px] py-[8px] capitalize 
                        ${
                          app.status === "accepted"
                            ? "bg-green-500"
                            : app.status === "rejected"
                            ? "bg-red-500"
                            : "bg-blue-500"
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

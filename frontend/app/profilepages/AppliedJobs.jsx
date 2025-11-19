"use client";

export default function AppliedJobs() {
  // Example placeholder data for demonstration
  const jobs = [
    { id: 1, title: "Frontend Developer", company: "Tech Corp", status: "Applied" },
    { id: 2, title: "Backend Engineer", company: "Dev Solutions", status: "Interview Scheduled" },
    { id: 3, title: "Full Stack Developer", company: "Web Innovators", status: "Applied" },
  ];

  return (
    <div className="min-h-screen bg-[#E2F4FA] p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* <h2 className="text-2xl md:text-3xl font-bold mb-6">Applied Jobs</h2> */}

        {jobs.length === 0 ? (
          <p className="text-gray-600 text-center">You haven't applied for any jobs yet.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold">{job.title}</h3>
                <p className="text-gray-600">{job.company}</p>
                <p className="mt-2 text-sm font-medium text-blue-600">{job.status}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

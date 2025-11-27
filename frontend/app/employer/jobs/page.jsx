"use client";

import { useState , useEffect} from "react";
import { getJobs } from "../../api";
  const API_URL = "http://localhost:5000/api/jobs";

export const deleteJobs = async (id) => {
  alert('df');
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
};
export default function BasicDetails() {

  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    getJobs().then(setJobs);
  }, []);


// const handleDelete = async (id) => {
// await fetch(`/api/jobs/${id}`, { method: "DELETE" });
// loadJobs();
// };

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    subscriptionEmail: "",
  });
  const [isSubscribed, setIsSubscribed] = useState(false); // track subscription

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.subscriptionEmail) {
      setIsSubscribed(true);
    }
    console.log("Form Submitted:", form);
  };

  return (
    <div className="mx-auto bg-[#E2F4FA] h-screen">
<div class="p-8 bg-[#d6f2fb] min-h-screen font-sans">
  <div class="flex justify-between p-5">
  <h2 class="text-2xl font-semibold mb-6">Job Applications</h2>
  <a href="/employer/jobs/addnew" class="bg-white text-black py-2 px-4 rounded-full hover:opacity-80 font-bold">Post New</a>
  </div>
  <div class="overflow-x-auto ">
    <table class="w-full bg-white rounded-xl shadow mr-[20px]">
      <thead class="bg-[#e8faff] text-left">
        <tr>
          <th class="py-3 px-4">Job Id</th>
          <th class="py-3 px-4">Title</th>
          <th class="py-3 px-4">Company</th>
          <th class="py-3 px-4">Location</th>
          <th class="py-3 px-4">Salary</th>
          <th class="py-3 px-4">Type</th>
          <th class="py-3 px-4">Status</th>
          <th class="py-3 px-4 text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        
      {jobs.map((job) => (
<tr key={job._id} className="border-t">
<td className="py-3 px-4">{job._id}</td>
<td className="py-3 px-4">{job.title}</td>
<td className="py-3 px-4">{job.company}</td>
<td className="py-3 px-4">{job.location}</td>
<td className="py-3 px-4">{job.salary}</td>
<td className="py-3 px-4">{job.type}</td>
<td className="py-3 px-4">{job.status}</td>
<td className="py-3 px-4 text-center space-x-3">

<div className="flex items-center space-x-2">
  {/* View */}
  <button
    className="p-1.5 bg-black hover:bg-gray-900 text-white rounded-full shadow"
    title="View"
  >
    👁️
  </button>

  {/* Edit */}
  <a href={`/employer/jobs/edit-job/${job._id}`}
    className="p-1.5 bg-black hover:bg-gray-900 text-white rounded-full shadow"
    title="Edit"
  >
    ✏️
  </a>

  {/* Delete */}
  <button onClick={() => deleteJobs(job._id)}
    className="p-1.5 bg-black hover:bg-red-700 text-white rounded-full shadow"
    title="Delete"
  >
    🗑️
  </button>
</div>


</td>
</tr>
))}
      </tbody>
    </table>
  </div>
</div>

      
    </div>
  );
}

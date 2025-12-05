"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getJob, updateJob } from "../../../../api";

export default function EditJob() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [job, setJob] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    site: "",
    skills: [],
    jobtype: "",
    jobcategory: "",
    experience: "",
    description: "",
    mails: ""
  });

  const [selected, setSelected] = useState([]);
  const [open, setOpen] = useState(false);
  const [salaryOptions, setSalaryOptions] = useState([]);

  useEffect(() => {
    fetch("https://api.mindssparsh.com/api/expected-ctc")
      .then(res => res.json())
      .then(data => setSalaryOptions(data))
      .catch(err => console.error("Error loading salary options", err));
  }, []);

  const skillsOptions = [
    "JavaScript", "React", "Node.js", "Tailwind", "MongoDB", "Laravel"
  ];

  const toggleSkill = (skill) => {
    setSelected(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  useEffect(() => {
    if (!id) return;
    getJob(id).then((data) => {
      console.log("Fetched job data:", data); // Debugging
      setJob(data);
      if (Array.isArray(data.skills)) {
        setSelected(data.skills);
      } else if (typeof data.skills === 'string') {
        // Handle case where skills might be saved as a comma-separated string
        setSelected(data.skills.split(',').map(s => s.trim()));
      } else {
        setSelected([]);
      }
    });
  }, [id]);

  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    const updatedJob = { ...job, skills: selected };
    await updateJob(id, updatedJob);
    alert("Job Updated Successfully!");
    router.push("/employer/jobs");
  };

  return (
    <div className="mx-auto bg-[#E2F4FA] min-h-screen">
      <form onSubmit={submit} className="p-6 space-y-5">
        <h2 className="text-xl font-bold mb-4">Edit Job</h2>

        <div className="flex gap-3">
          <div className="w-1/2">
            <label className="block mb-1">Title</label>
            <input value={job.title} onChange={handleChange} name="title"
              className="w-full border rounded bg-[#CCE9F2] px-3 py-2" />
          </div>

          <div className="w-1/2">
            <label className="block mb-1">Company</label>
            <input value={job.company} onChange={handleChange} name="company"
              className="w-full border rounded bg-[#CCE9F2] px-3 py-2" />
          </div>
        </div>

        <div className="flex gap-3">
          <div className="w-1/2">
            <label className="block mb-1">Salary</label>
            <select
              name="salary"
              value={job.salary}
              onChange={handleChange}
              className="w-full border rounded bg-[#CCE9F2] px-3 py-2"
            >
              <option value="">Select Salary</option>
              {salaryOptions.map((opt) => (
                <option key={opt._id} value={`${opt.minCTC} - ${opt.maxCTC}`}>
                  {opt.minCTC} - {opt.maxCTC}
                </option>
              ))}
            </select>
          </div>

          <div className="w-1/2">
            <label className="block mb-1">Onsite/Remote</label>
            <select name="site" value={job.site} onChange={handleChange}
              className="w-full border rounded bg-[#CCE9F2] px-3 py-2">
              <option value="onsite">Onsite</option>
              <option value="remote">Remote</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="w-1/2">
            <label className="block mb-1">Location</label>
            <input value={job.location} onChange={handleChange} name="location"
              className="w-full border rounded bg-[#CCE9F2] px-3 py-2" />
          </div>

          <div className="w-1/2">
            <label className="block mb-1">Job Type</label>
            <select name="jobtype" value={job.jobtype} onChange={handleChange}
              className="w-full border rounded bg-[#CCE9F2] px-3 py-2">
              <option value="fulltime">Full Time</option>
              <option value="parttime">Part Time</option>
              <option value="remote">Remote</option>
              <option value="contract">Contract</option>
              <option value="freelance">Freelance</option>
              <option value="internship">Internship</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="w-1/2">
            <label className="block mb-1">Job Category</label>
            <select name="jobcategory" value={job.jobcategory} onChange={handleChange}
              className="w-full border rounded bg-[#CCE9F2] px-3 py-2">
              <option value="ui">UI Designer</option>
              <option value="ux">UX Designer</option>
              <option value="laravel">Laravel Developer</option>
            </select>
          </div>

          <div className="w-1/2">
            <label className="block mb-1">Experience</label>
            <select name="experience" value={job.experience} onChange={handleChange}
              className="w-full border rounded bg-[#CCE9F2] px-3 py-2">
              <option value="0-1">0-1</option>
              <option value="1-2">1-2</option>
              <option value="2-3">2-3</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="w-1/2">
            <label className="block mb-1">Mails</label>
            <input name="mails" value={job.mails} onChange={handleChange}
              className="w-full border rounded bg-[#CCE9F2] px-3 py-2" />
          </div>

          <div className="w-1/2">
            <label className="block mb-1">Skills</label>
            <div className="relative">
              <div className="min-h-[45px] w-full border rounded bg-[#CCE9F2] px-2 py-1 flex flex-wrap gap-1 cursor-pointer"
                onClick={() => setOpen(!open)}>
                {selected.length === 0 &&
                  <span className="text-gray-500">Select skills</span>}
                {selected.map(skill => (
                  <span
                    key={skill}
                    className="flex items-center bg-black text-white text-xs px-2 py-1 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSkill(skill);
                    }}
                  >
                    {skill}
                    <span className="ml-1 text-[10px]">✕</span>
                  </span>
                ))}
              </div>
              {open && (
                <ul className="absolute bg-white shadow rounded w-full z-10 max-h-40 overflow-auto">
                  {skillsOptions.map(skill => (
                    <li key={skill}
                      className="px-3 py-2 cursor-pointer hover:bg-gray-200"
                      onClick={() => toggleSkill(skill)}>
                      {skill}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block mb-1">Description</label>
          <textarea name="description" rows="6" value={job.description}
            onChange={handleChange}
            className="w-full border rounded bg-[#CCE9F2] px-3 py-2" />
        </div>

        <button type="submit"
          className="bg-black text-white px-5 py-2 rounded-full">
          Update Job
        </button>
      </form>
    </div>
  );
}

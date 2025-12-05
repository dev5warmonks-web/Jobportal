"use client";
import { useState } from "react";
import { addJob } from "../../../api";


export default function BasicDetails() {

  const [job, setJob] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: "",
    site: "",
    skills: [],
    jobtype: "",
    jobcategory: "",
    experience: "",
    mails: ""

  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();

    const storedUser = localStorage.getItem("user");
    const userId = storedUser ? JSON.parse(storedUser)._id : null;

    if (!userId) {
      alert("User not logged in!");
      return;
    }

    const finalJob = {
      ...job,
      skills: selected,
      userid: userId,
    };

    // await addJob({ ...job, skills: selected });
    await addJob(finalJob);
    alert("Job posted!");
    setJob({
      title: "",
      company: "",
      location: "",
      salary: "",
      description: "",
      site: "onsite",
      skills: [],
      jobtype: "fulltime",
      jobcategory: "ui",
      experience: "0-1",
      mails: ""
    });
    setSelected([]);
  };

  const skillsOptions = [
    "JavaScript", "React", "Node.js",
    "Tailwind", "MongoDB", "Laravel"
  ];

  const [selected, setSelected] = useState([]);
  const [open, setOpen] = useState(false);

  const toggleSkill = (skill) => {
    if (selected.includes(skill)) {
      setSelected(selected.filter((s) => s !== skill));
    } else {
      setSelected([...selected, skill]);
    }
  };

  return (
    <div className="mx-auto bg-[#E2F4FA] h-screen">
      <form onSubmit={submit} className="p-6 space-y-5">

        <div className="flex gap-3">
          <div className="w-1/2">
            <label className="block font-medium mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={job.title}
              onChange={handleChange}
              className="w-full border rounded bg-[#CCE9F2] px-3 py-2"
              required
            />
          </div>

          <div className="w-1/2">
            <label className="block font-medium mb-1">Company</label>
            <input
              type="text"
              name="company"
              value={job.company}
              onChange={handleChange}
              className="w-full border rounded bg-[#CCE9F2] px-3 py-2"
              required
            />
          </div>
        </div>

        <div className="flex flex wrap gap-3">
          <div className="w-1/2">
            <label className="block font-medium mb-1">Salary</label>
            <input
              type="text"
              name="salary"
              value={job.salary}
              onChange={handleChange}
              className="w-full border rounded bg-[#CCE9F2] px-3 py-2"
              required
            />
          </div>

          <div className="w-1/2">
            <label className="block font-medium mb-1">Onsite/Remote</label>
            <select
              name="site" className="w-full border rounded bg-[#CCE9F2] px-3 py-2"
              value={job.site} onChange={(e) =>
                setJob({ ...job, site: e.target.value })
              }>
              <option value="onsite">Onsite</option>
              <option value="remote">Remote</option>
            </select>
          </div>
        </div>
        <div className="flex flex wrap gap-3">

          <div className="w-1/2">
            <label className="block font-medium mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={job.location}
              onChange={handleChange}
              className="w-full border rounded bg-[#CCE9F2] px-3 py-2"
              required
            />
          </div>

          <div className="w-1/2">
            <label className="block font-medium mb-1">Job Type</label>
            <select
              name="jobtype" className="w-full border rounded bg-[#CCE9F2] px-3 py-2"
              value={job.jobtype} onChange={(e) =>
                setJob({ ...job, jobtype: e.target.value })
              }>
              <option value="fulltime">Full Time</option>
              <option value="parttime">Part Time</option>
              <option value="remote">Remote</option>
              <option value="contract">Contract</option>
              <option value="freelance">Freelance</option>
              <option value="internship">Internship</option>
            </select>
          </div>
        </div>
        <div className="flex flex wrap gap-3">

          <div className="w-1/2">
            <label className="block font-medium mb-1">Mails</label>
            <input
              type="text"
              name="mails"
              value={job.mails}
              onChange={handleChange}
              className="w-full border rounded bg-[#CCE9F2] px-3 py-2"
              required
            />
          </div>

          <div className="w-1/2">
            <label className="block font-medium mb-1">Skills</label>
            <div className="relative">
              <div
                className="min-h-[45px] w-full border rounded bg-[#CCE9F2] px-2 py-1 flex flex-wrap gap-1 cursor-pointer"
                onClick={() => setOpen(!open)}
              >
                {selected.length === 0 && (
                  <span className="text-gray-500">Select skills</span>
                )}

                {selected.map((skill) => (
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
                <ul className="absolute left-0 right-0 mt-1 bg-white shadow-md rounded max-h-40 overflow-y-auto z-10 border">
                  {skillsOptions.map((skill) => (
                    <li
                      key={skill}
                      className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-200 ${selected.includes(skill) ? "bg-gray-300" : ""
                        }`}
                      onClick={() => toggleSkill(skill)}
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex wrap gap-3">

          <div className="w-1/2">
            <label className="block font-medium mb-1">Job Category</label>
            <select
              name="jobcategory" className="w-full border rounded bg-[#CCE9F2] px-3 py-2"
              value={job.jobcategory} onChange={(e) =>
                setJob({ ...job, jobcategory: e.target.value })
              }>
              <option value="ui">UI Designer</option>
              <option value="ux">UX Designer</option>
              <option value="laravel">Laravel Developer</option>
            </select>
          </div>

          <div className="w-1/2">
            <label className="block font-medium mb-1">Experience</label>
            <select
              name="experience" className="w-full border rounded bg-[#CCE9F2] px-3 py-2"
              value={job.experience} onChange={(e) =>
                setJob({ ...job, experience: e.target.value })
              }>
              <option value="0-1">0-1</option>
              <option value="1-2">1-2</option>
              <option value="2-3">2-3</option>
            </select>
          </div>
        </div>
        <div className="w-full">
          <label className="block font-medium mb-1">Description</label>
          <textarea
            rows="8"
            name="description"
            value={job.description}
            onChange={handleChange}
            className="w-full border rounded bg-[#CCE9F2] px-3 py-2"
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-black text-white px-5 py-2 rounded-full"
        >
          Save changes
        </button>
      </form>
    </div>
  );
}

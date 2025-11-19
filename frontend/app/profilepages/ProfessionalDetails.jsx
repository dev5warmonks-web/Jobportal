"use client";
import { useState } from "react";  

export default function ProfessionalDetails() {

  const [form, setForm] = useState({
    experiencelevel: "",
    highesteducation: "",
    currentcompany: "",
    preferredindustry: "",
    preferredjobtype: "",
    keySkills: [],
  });

  const skillsOptions = [
    "JavaScript",
    "React",
    "Node.js",
    "Python",
    "Java",
    "SQL",
  ];

  const handleSelectSkill = (skill) => {
    if (!form.keySkills.includes(skill)) {
      setForm({ ...form, keySkills: [...form.keySkills, skill] });
    }
  };

  const handleRemoveSkill = (skill) => {
    setForm({
      ...form,
      keySkills: form.keySkills.filter((s) => s !== skill),
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", form);
  };

  return (
    <div className="mx-auto bg-[#E2F4FA] h-screen">

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <div className="flex gap-3">
          {/* Your experience level */}
          <div className="w-1/2">
            <label className="block font-medium mb-1">Your experience level</label>
            <select
            name="experienceLevel"
            value={form.experiencelevel}
            onChange={handleChange}
            className="w-full border rounded bg-[#CCE9F2] px-3 py-2"
            required
            >
            <option value="">Select</option>
            <option value="Fresher">Fresher</option>
            <option value="Experienced">Experienced</option>
            </select>
          </div>

          {/* Highest education achieved */}
          <div className="w-1/2">
            <label className="block font-medium mb-1">Highest education achieved</label>
            <select
            name="highestEducation"
            value={form.highesteducation}
            onChange={handleChange}
            className="w-full border rounded bg-[#CCE9F2] px-3 py-2"
            required
            >
            <option value="">Select</option>
            <option value="degree">Bachelor's Degree</option>
            <option value="pg">PG</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          {/* Current company/employer */}
          <div className="w-1/2">
            <label className="block font-medium mb-1">Current company/employer</label>
            <input
              type="text"
              name="currentCompany"
              value={form.currentcompany}
              onChange={handleChange}
              className="w-full border rounded bg-[#CCE9F2] px-3 py-2"
              required
            />
          </div>

          {/* Preferred industry */}
          <div className="w-1/2">
            <label className="block font-medium mb-1">Preferred industry</label>
            <select
            name="preferredIndustry"
            value={form.preferredindustry}
            onChange={handleChange}
            className="w-full border rounded bg-[#CCE9F2] px-3 py-2"
            required
            >
            <option value="">Select</option>
            <option value="finance">Finance</option>
            <option value="it">IT</option>
            <option value="marketing">Marketing</option>
            </select>
          </div>
        </div>

        {/* Job type you prefer */}
        <div>
        <label className="block font-medium mb-1">Job type you prefer</label>
        <select
        name="preferredJobType"
        value={form.preferredjobtype}
        onChange={handleChange}
        className="w-full border rounded bg-[#CCE9F2] px-3 py-2"
        required
        >
        <option value="">Select</option>
        <option value="fulltime">Full-Time</option>
        <option value="parttime">Part-time</option>
        <option value="freelance">Freelance</option>
        </select>
        </div>

        {/* Key skills and expertise */}
        <div>
        <label className="block font-medium mb-1">Key skills and expertise</label>

        {/* Selected skills */}
        <div className="flex flex-wrap gap-2 mb-2">
            {form.keySkills.map((skill) => (
            <span
                key={skill}
                className="flex items-center bg-black text-white px-2 py-1 rounded-full cursor-pointer"
            >
                {skill}
                {/* Down arrow icon */}
                <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3 h-3 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </span>
            ))}
        </div>

        {/* Dropdown to select skills */}
        <select
            onChange={(e) => {
            handleSelectSkill(e.target.value);
            e.target.value = ""; // reset dropdown after selection
            }}
            className="w-full border rounded bg-[#CCE9F2] px-3 py-2"
        >
            <option value="">Select skill</option>
            {skillsOptions.map((skill) => (
            <option key={skill} value={skill}>
                {skill}
            </option>
            ))}
        </select>
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

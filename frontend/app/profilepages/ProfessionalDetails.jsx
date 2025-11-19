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

  const skillsOptions = ["JavaScript", "React", "Node.js", "Python", "Java", "SQL"];

  const handleSelectSkill = (skill) => {
    if (!form.keySkills.includes(skill)) {
      setForm({ ...form, keySkills: [...form.keySkills, skill] });
    }
  };

  const handleRemoveSkill = (skill) => {
    setForm({ ...form, keySkills: form.keySkills.filter((s) => s !== skill) });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", form);
  };

  return (
    <div className="mx-auto bg-[#E2F4FA] min-h-screen p-4 md:p-8">
      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
        {/* Experience & Education */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block font-medium mb-1">Your experience level</label>
            <select
              name="experiencelevel"
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

          <div className="flex-1">
            <label className="block font-medium mb-1">Highest education achieved</label>
            <select
              name="highesteducation"
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

        {/* Current Company & Preferred Industry */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block font-medium mb-1">Current company/employer</label>
            <input
              type="text"
              name="currentcompany"
              value={form.currentcompany}
              onChange={handleChange}
              className="w-full border rounded bg-[#CCE9F2] px-3 py-2"
              required
            />
          </div>

          <div className="flex-1">
            <label className="block font-medium mb-1">Preferred industry</label>
            <select
              name="preferredindustry"
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

        {/* Preferred Job Type */}
        <div>
          <label className="block font-medium mb-1">Job type you prefer</label>
          <select
            name="preferredjobtype"
            value={form.preferredjobtype}
            onChange={handleChange}
            className="w-full border rounded bg-[#CCE9F2] px-3 py-2"
            required
          >
            <option value="">Select</option>
            <option value="fulltime">Full-Time</option>
            <option value="parttime">Part-Time</option>
            <option value="freelance">Freelance</option>
          </select>
        </div>

        {/* Key Skills */}
        <div>
          <label className="block font-medium mb-1">Key skills and expertise</label>

          {/* Selected Skills */}
          <div className="flex flex-wrap gap-2 mb-2">
            {form.keySkills.map((skill) => (
              <span
                key={skill}
                className="flex items-center bg-black text-white px-2 py-1 rounded-full cursor-pointer"
                onClick={() => handleRemoveSkill(skill)}
              >
                {skill}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3 h-3 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </span>
            ))}
          </div>

          {/* Skills Dropdown */}
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

        {/* Submit Button */}
        <div className="flex">
          <button
            type="submit"
            className="bg-black text-white px-5 py-2 rounded-full hover:bg-gray-800 transition-colors"
          >
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
}

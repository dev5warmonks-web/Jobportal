"use client";
import { useState, useEffect, useRef } from "react";
import { BASE_URL } from "../config/apiConfig";

export default function ProfessionalDetails() {
  const [userId, setUserId] = useState(null); // store logged in user id
  const dropdownRef = useRef(null);

  const [form, setForm] = useState({
    experiencelevel: "",
    highesteducation: "",
    currentcompany: "",
    preferredindustry: "",
    preferredjobtype: "",
    keySkills: [],
  });

  const [professionalId, setProfessionalId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [experienceOptions, setExperienceOptions] = useState([]);
  const [educationOptions, setEducationOptions] = useState([]);
  const [industryOptions, setIndustryOptions] = useState([]);
  const [selected, setSelected] = useState([]);
  const [open, setOpen] = useState(false);
  const [skillsOptions, setSkillsOptions] = useState([]);

  // Fetch experience options
  useEffect(() => {
    fetch(`${BASE_URL}/api/job-experiences`)
      .then((res) => res.json())
      .then((data) => setExperienceOptions(data))
      .catch((err) => console.error("Failed to fetch experience:", err));
  }, []);

  // Fetch education options
  useEffect(() => {
    fetch(`${BASE_URL}/api/education`)
      .then((res) => res.json())
      .then((data) => setEducationOptions(data))
      .catch((err) => console.error("Failed to fetch education details:", err));
  }, []);

  // Fetch industry options
  useEffect(() => {
    fetch(`${BASE_URL}/api/industry`)
      .then((res) => res.json())
      .then((data) => setIndustryOptions(data))
      .catch((err) => console.error("Failed to fetch industry:", err));
  }, []);

  // Fetch key skills options
  useEffect(() => {
    fetch(`${BASE_URL}/api/skills`)
      .then(res => res.json())
      .then(data => {
        setSkillsOptions(data);
      })
      .catch(err => console.error("Failed to fetch key skills:", err));
  }, []);

  // Fetch existing professional details
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser || storedUser === "undefined") return;

    const parsedUser = JSON.parse(storedUser);
    setUserId(parsedUser._id);

    const fetchProfessionalData = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/professional/user/${parsedUser._id}`
        );

        if (response.ok) {
          const data = await response.json();
          setForm({
            experiencelevel: data.experienceLevel || "",
            highesteducation: data.highestEducation || "",
            currentcompany: data.currentCompany || "",
            preferredindustry: data.preferredIndustry || "",
            preferredjobtype: data.preferredJobType || "",
            keySkills: data.keySkills || [],
          });
          setSelected(data.keySkills || []);
          setProfessionalId(data._id);
        } else if (response.status === 404) {
          console.log("No professional details found");
        }
      } catch (error) {
        console.error("Error fetching professional data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionalData();
  }, []); // removed session dependency

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  // const skillsOptions = ["JavaScript", "React", "Node.js", "Python", "Java", "SQL"];

  // const handleSelectSkill = (skill) => {
  //   if (!form.keySkills.includes(skill)) {
  //     setForm({ ...form, keySkills: [...form.keySkills, skill] });
  //   }
  // };

  // const handleRemoveSkill = (skill) => {
  //   setForm({ ...form, keySkills: form.keySkills.filter((s) => s !== skill) });
  // };
  const toggleSkill = (skill) => {
    setSelected(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)   // Remove
        : [...prev, skill]               // Add
    );
  };
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("You must be logged in to save professional details");
      return;
    }

    const body = {
      userId,
      experienceLevel: form.experiencelevel,
      highestEducation: form.highesteducation,
      currentCompany: form.currentcompany,
      preferredIndustry: form.preferredindustry,
      preferredJobType: form.preferredjobtype,
      // keySkills: form.keySkills,
      keySkills: selected,
    };

    try {
      let res;

      if (userId) {
        res = await fetch(
          `${BASE_URL}/api/professional/${userId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }
        );
      } else {
        res = await fetch(`${BASE_URL}/api/professional`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      const data = await res.json();

      if (res.ok) {
        setProfessionalId(data._id);
        alert("Professional details saved successfully!");
      } else {
        alert(data.message || "Failed to save professional details");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save professional details");
    }
  };

  if (loading) {
    return (
      <div className="mx-auto bg-[#E2F4FA] min-h-screen p-4 md:p-8 flex items-center justify-center">
        <p className="text-lg">Loading professional details...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto bg-[#E2F4FA] min-h-screen p-4 md:p-8">
      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      
        <div className="flex flex-col md:flex-row gap-4 text-black">
          <div className="flex-1">
            <label className="block font-medium mb-1">Your experience level </label>
            <select
              name="experiencelevel"
              value={form.experiencelevel}
              onChange={handleChange}
              className="w-full border rounded bg-[#CCE9F2] px-3 py-2"
              required
            >
              <option value="">Select</option>
              {experienceOptions.map((exp) => (
                <option key={exp._id} value={exp.jobExperience}>
                  {exp.jobExperience}
                </option>
              ))}
              <option value="Test">Test</option>
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
              {educationOptions.map((edu) => (
                <option key={edu._id} value={edu.education}>
                  {edu.education}
                </option>
              ))}
              {/* <option value="">Select</option>
              <option value="degree">Bachelor's Degree</option>
              <option value="pg">PG</option> */}
            </select>
          </div>
        </div>
        {/* Current Company & Preferred Industry */}
        <div className="flex flex-col md:flex-row gap-4 text-black">
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
              {industryOptions.map((ind) => (
                <option key={ind._id} value={ind.industry}>
                  {ind.industry}
                </option>
              ))}
              {/* <option value="">Select</option>
              <option value="finance">Finance</option>
              <option value="it">IT</option>
              <option value="marketing">Marketing</option> */}
            </select>
          </div>
        </div>
        {/* Preferred Job Type */}
        <div className="text-black">
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
      {/* ... */}
        {/* Key Skills */}
        {/* <div className="text-black">
          <label className="block font-medium mb-1">Key skills and expertise</label>
          
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
            ))}
          </div>
          
          <select
            onChange={(e) => {
              handleSelectSkill(e.target.value);
              e.target.value = "";
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
        </div> */}

        <div className="text-black">
          <label className="block mb-1">Skills</label>
          <div className="relative" ref={dropdownRef}>
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
                  className="bg-black text-white text-xs px-2 py-1 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSkill(skill);
                  }}
                >
                  {skill} ✕
                </span>
              ))}
            </div>

            {open && (
              <ul className="absolute bg-white shadow rounded w-full z-10 max-h-40 overflow-auto">
                {skillsOptions.map((skill) => (
                  <li
                    key={skill._id} // use _id if your API returns objects
                    className="px-3 py-2 cursor-pointer hover:bg-gray-200"
                    onClick={() => toggleSkill(skill.skills)} // adjust if API returns object
                  >
                    {skill.skills}
                  </li>
                ))}
              </ul>
            )}
          </div>
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

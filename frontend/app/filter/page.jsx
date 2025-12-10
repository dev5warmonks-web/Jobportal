"use client";
import { useEffect, useState, Suspense } from "react";
import { useSession } from 'next-auth/react';
import { getJobs } from "../api";
import Modal from "../components/Modal/page";
import { BASE_URL } from "../config/apiConfig";

import { useSearchParams } from 'next/navigation';

import DualRangeSlider from "../components/DualRangeSlider";

function FilterPageContent() {
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [experiences, setExperiences] = useState([]);

    // Filter States
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedJobTypes, setSelectedJobTypes] = useState([]);
    const [selectedExperience, setSelectedExperience] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [salaryRange, setSalaryRange] = useState({ min: 0, max: 200000 });

    const [open, setOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const { data: session } = useSession();
    const [applying, setApplying] = useState(false);
    const [applicationMessage, setApplicationMessage] = useState('');

    const searchParams = useSearchParams();
    const categoryParams = searchParams.getAll('category');

    const BACKEND_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || `${BASE_URL}`;

    useEffect(() => {
        // Fetch Jobs
        getJobs().then(data => {
            setJobs(data);
            setFilteredJobs(data);
        });

        // Fetch Categories
        fetch(`${BACKEND_BASE}/api/job-categories`)
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.error("Failed to fetch categories", err));

        // Fetch Experiences
        fetch(`${BACKEND_BASE}/api/job-experiences`)
            .then(res => res.json())
            .then(data => setExperiences(data))
            .catch(err => console.error("Failed to fetch experiences", err));
    }, []);

    const searchParam = searchParams.get('search');

    // Handle URL Query Param for Category
    useEffect(() => {
        if (categoryParams.length > 0) {
            setSelectedCategories(categoryParams);
        }
    }, [searchParams]);

    // Handle URL Query Param for Search
    useEffect(() => {
        if (searchParam) {
            setSearchQuery(searchParam);
        }
    }, [searchParam]);

    const parseSalary = (salaryStr) => {
        if (!salaryStr) return null;
        // Remove commas, spaces
        const clean = salaryStr.replace(/,/g, '').toUpperCase();
        const parts = clean.split('-').map(p => p.trim());

        const parseVal = (val) => {
            let num = parseFloat(val);
            if (val.includes('K')) num *= 1000;
            if (val.includes('LPA')) num *= 100000;
            return num;
        }

        if (parts.length === 2) {
            return { min: parseVal(parts[0]), max: parseVal(parts[1]) };
        }
        // If single value, treat as min? or exact? Let's assume exact.
        const val = parseVal(parts[0]);
        return { min: val, max: val };
    };

    // Filter Logic
    useEffect(() => {
        let result = jobs;

        // Search Filter
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            result = result.filter(job =>
                job.title?.toLowerCase().includes(lowerQuery) ||
                job.company?.toLowerCase().includes(lowerQuery) ||
                job.skills?.some(skill => skill.toLowerCase().includes(lowerQuery))
            );
        }

        // Category Filter
        if (selectedCategories.length > 0) {
            result = result.filter(job => selectedCategories.includes(job.jobcategory));
        }

        // Skill Filter (from URL)
        const skillParams = searchParams.getAll('skill');
        if (skillParams.length > 0) {
            result = result.filter(job =>
                job.skills?.some(skill => skillParams.some(p => p.toLowerCase() === skill.toLowerCase()))
            );
        }

        // Company Filter (from URL)
        const companyParams = searchParams.getAll('company');
        if (companyParams.length > 0) {
            result = result.filter(job =>
                companyParams.some(c => c.toLowerCase() === job.company?.toLowerCase())
            );
        }

        // Job Type Filter
        if (selectedJobTypes.length > 0) {
            result = result.filter(job => selectedJobTypes.includes(job.jobtype));
        }

        // Experience Filter
        if (selectedExperience.length > 0) {
            result = result.filter(job => selectedExperience.includes(job.experience));
        }

        // Salary Filter
        result = result.filter(job => {
            if (!job.salary) return true; // Include jobs with no salary specified? Or exclude? Let's include.
            const jobSalary = parseSalary(job.salary);
            if (!jobSalary || isNaN(jobSalary.min)) return true;

            // Overlap logic: max(jobMin, filterMin) <= min(jobMax, filterMax)
            const overlap = Math.max(jobSalary.min, salaryRange.min) <= Math.min(jobSalary.max, salaryRange.max);
            return overlap;
        });

        setFilteredJobs(result);
    }, [jobs, searchQuery, selectedCategories, selectedJobTypes, selectedExperience, salaryRange, searchParams]);

    const handleCategoryChange = (category) => {
        setSelectedCategories(prev =>
            prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
        );
    };

    const handleJobTypeChange = (type) => {
        setSelectedJobTypes(prev =>
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
    };

    const handleExperienceChange = (exp) => {
        setSelectedExperience(prev =>
            prev.includes(exp) ? prev.filter(e => e !== exp) : [...prev, exp]
        );
    };

    const handleApply = async () => {
        if (!session?.user) {
            alert("Please login to apply");
            return;
        }

        setApplying(true);
        setApplicationMessage('');

        try {
            const storedUser = sessionStorage.getItem("user");
            let userId = session?.user?.id;
            if (storedUser && storedUser !== "undefined") {
                const parsed = JSON.parse(storedUser);
                userId = parsed._id;
            }

            if (!userId) {
                setApplicationMessage("Please login to apply");
                setApplying(false);
                return;
            }

            const response = await fetch(`${BACKEND_BASE}/api/applications`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    jobId: selectedJob._id
                })
            });

            const data = await response.json();

            if (response.ok) {
                setApplicationMessage('Application submitted successfully!');
                setTimeout(() => {
                    setOpen(false);
                    setApplicationMessage('');
                }, 2000);
            } else {
                setApplicationMessage(data.message || 'Failed to submit application');
            }
        } catch (error) {
            console.error('Application error:', error);
            setApplicationMessage('An error occurred. Please try again.');
        } finally {
            setApplying(false);
        }
    };

    return (
        <div className="min-h-screen pt-[100px] pb-10 px-4 md:px-10">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">

                {/* Sidebar Filters */}


                {/* Job List */}
                <main className="w-full lg:w-3/4">
                    <div className="mb-6 flex justify-between items-center">
                        <h1 className="text-2xl font-bold">
                            {filteredJobs.length} <span className="text-gray-500 text-lg font-normal">Jobs Found</span>
                        </h1>

                        {/* Sort By (Optional UI) */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">Sort by:</span>
                            <select className="text-sm font-semibold bg-transparent outline-none cursor-pointer">
                                <option>Latest</option>
                                <option>Oldest</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {filteredJobs.length > 0 ? (
                            filteredJobs.map(job => (
                                <div key={job._id}
                                    onClick={() => {
                                        setSelectedJob(job);
                                        setOpen(true);
                                    }}
                                    className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer flex flex-col md:flex-row gap-4"
                                >
                                    <img
                                        src="/images/oracle.jpg"
                                        alt="Company Logo"
                                        className="w-12 h-12 object-cover rounded-md"
                                    />

                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-lg">{job.title}</h3>
                                                <p className="text-sm text-gray-500">{job.company} • {job.location}</p>
                                            </div>
                                            <span className="bg-gray-100 text-xs px-3 py-1 rounded-full font-medium">
                                                {job.jobtype}
                                            </span>
                                        </div>

                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {job.skills?.slice(0, 4).map((skill, idx) => (
                                                <span key={idx} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">
                                                    {skill}
                                                </span>
                                            ))}
                                            {job.skills?.length > 4 && (
                                                <span className="text-xs text-gray-400 px-2 py-1">+{job.skills.length - 4} more</span>
                                            )}
                                        </div>

                                        <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
                                            <div className="flex gap-4">
                                                <span>{job.experience}</span>
                                                <span>{job.salary}</span>
                                            </div>
                                            <span>Posted recently</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20 bg-white rounded-lg">
                                <p className="text-gray-500">No jobs found matching your criteria.</p>
                                <button
                                    onClick={() => {
                                        setSelectedCategories([]);
                                        setSelectedJobTypes([]);
                                        setSelectedExperience([]);
                                        setSearchQuery("");
                                        setSalaryRange({ min: 0, max: 200000 });
                                    }}
                                    className="mt-4 text-blue-600 font-medium hover:underline"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </main>
                <aside className="w-full lg:w-1/4 bg-white p-6 rounded-lg shadow-sm h-fit">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">Filters</h2>
                        <button
                            onClick={() => {
                                setSelectedCategories([]);
                                setSelectedJobTypes([]);
                                setSelectedExperience([]);
                                setSearchQuery("");
                                setSalaryRange({ min: 0, max: 200000 });
                            }}
                            className="text-sm text-gray-500 hover:text-black"
                        >
                            Clear all
                        </button>
                    </div>

                    {/* Search */}
                    <div className="mb-6">
                        <h3 className="font-semibold mb-3">Search</h3>
                        <input
                            type="text"
                            placeholder="Search by title, company..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm outline-none focus:border-black"
                        />

                        {/* Job Categories */}
                        <h3 className="font-semibold mb-3 mt-6">Job Categories</h3>
                        <div className="space-y-2 mb-6 max-h-48 overflow-y-auto">
                            {categories.map((cat) => (
                                <label key={cat._id} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.includes(cat.jobCategory)}
                                        onChange={() => handleCategoryChange(cat.jobCategory)}
                                        className="w-4 h-4 accent-black"
                                    />
                                    <span className="text-sm text-gray-600">{cat.jobCategory}</span>
                                </label>
                            ))}
                        </div>

                        <h3 className="font-semibold mb-3">Job Type</h3>
                        <div className="space-y-2">
                            {[
                                { label: "Full Time", value: "fulltime" },
                                { label: "Part Time", value: "parttime" },
                                { label: "Remote", value: "remote" },
                                { label: "Contract", value: "contract" },
                                { label: "Freelance", value: "freelance" },
                                { label: "Internship", value: "internship" }
                            ].map(type => (
                                <label key={type.value} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedJobTypes.includes(type.value)}
                                        onChange={() => handleJobTypeChange(type.value)}
                                        className="w-4 h-4 accent-black"
                                    />
                                    <span className="text-sm text-gray-600">{type.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Experience Level */}
                    <div className="mb-6">
                        <h3 className="font-semibold mb-3">Experience Level</h3>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {experiences.map((exp) => (
                                <label key={exp._id} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedExperience.includes(exp.jobExperience)}
                                        onChange={() => handleExperienceChange(exp.jobExperience)}
                                        className="w-4 h-4 accent-black"
                                    />
                                    <span className="text-sm text-gray-600">{exp.jobExperience}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Salary Range */}
                    <div className="mb-6">
                        <h3 className="font-semibold mb-3">Salary Range</h3>
                        <DualRangeSlider
                            min={0}
                            max={200000}
                            onChange={({ min, max }) => setSalaryRange({ min, max })}
                        />
                        {/* <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>{salaryRange.min.toLocaleString()}</span>
                            <span>{salaryRange.max.toLocaleString()}</span>
                        </div> */}
                    </div>

                </aside>
            </div>

            {/* Job Details Modal */}
            <Modal open={open} storedUser={null} onClose={() => setOpen(false)}>
                {selectedJob && (
                    <>
                        <div className="flex flex-col md:flex-row mb-[20px]">
                            <img
                                src="/images/oracle.jpg" className="w-[87px]"
                                alt="Job" />
                            <div className="md:ml-4 mt-[10px]">
                                <h4 className="font-semibold text-[18px] leading-[26px] font-['Poppins']">
                                    {selectedJob.title}
                                </h4>
                                <p className="text-gray-600 text-[12px] leading-[26px]">
                                    <span className="font-bold"> {selectedJob.company} </span>
                                </p>
                                <div className="flex flex-wrap gap-[16px] mt-1">
                                    <span className="bg-[#E2F4FA] text-[12px] leading-[22px] text-black rounded-full px-[16px] py-[8px]">
                                        {selectedJob.jobtype}
                                    </span>
                                    <span className="bg-[#E2F4FA] text-[12px] leading-[22px] text-black rounded-full px-[16px] py-[8px]">
                                        {selectedJob.salary}
                                    </span>
                                    <span className="bg-[#E2F4FA] text-[12px] leading-[22px] text-black rounded-full px-[16px] py-[8px]">
                                        {selectedJob.experience}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="prose max-w-none">
                            <p className="font-bold">Description</p>
                            <p className="mb-4 text-sm text-gray-600 whitespace-pre-line">
                                {selectedJob.description}
                            </p>

                            <p className="font-bold">Skills</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {selectedJob.skills?.map(skill => (
                                    <span key={skill} className="bg-gray-100 text-xs px-3 py-1 rounded-full">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {applicationMessage && (
                            <div className={`mb-4 p-3 rounded-lg text-center ${applicationMessage.includes('success')
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                                }`}>
                                {applicationMessage}
                            </div>
                        )}

                        <div className="flex gap-3 justify-end mt-6">
                            <button
                                onClick={() => {
                                    setOpen(false);
                                    setApplicationMessage('');
                                }}
                                className="px-4 py-2 rounded-full border hover:bg-gray-50"
                                disabled={applying}
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleApply}
                                className="px-4 py-2 rounded-full bg-black text-white disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-gray-800"
                                disabled={applying}
                            >
                                {applying ? 'Applying...' : 'Apply Now'}
                            </button>
                        </div>
                    </>
                )}
            </Modal>
        </div>
    );
}

export default function FilterPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <FilterPageContent />
        </Suspense>
    );
}



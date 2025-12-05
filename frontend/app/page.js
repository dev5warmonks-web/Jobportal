"use client";
import { useEffect, useState } from "react";
import { useSession } from 'next-auth/react';
import { getJobs } from "./api";
import Modal from "./components/Modal/page";
import LoginPopup from "./components/LoginPopup";
import RegisterPopup from "./components/RegisterPopup";
import EmployerRegisterPopup from "./components/EmployerRegisterPopup";
import OtpPopup from "./components/OtpPopup";
import TagsSlider from "./components/TagsSlider";


export default function Home() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    getJobs().then(setJobs);
  }, []);

  const [open, setOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const { data: session } = useSession();

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const [searchInput, setSearchInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [applying, setApplying] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState('');
  const [featuredEmployers, setFeaturedEmployers] = useState([]);

  const BACKEND_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.mindssparsh.com';

  // const [showLogin, setShowLogin] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [registerType, setRegisterType] = useState(null); // 'candidate' | 'employer' | null

  const [otpData, setOtpData] = useState(null);
  const [allEmployers, setAllEmployers] = useState([]);
  const [totalApplications, setTotalApplications] = useState(0);

  useEffect(() => {
  if (open && selectedJob) {
    console.log("Modal opened for job:", selectedJob);
    console.log("Company:", selectedJob.company);
  }
}, [open, selectedJob]);

// useEffect(() => {
//   if (selectedJob?._id) {
//     const fetchApplications = async () => {
//       try {
//         const count = await getTotalApplications(selectedJob._id);
//         setTotalApplications(count);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchApplications();
//   }
// }, [selectedJob]);


useEffect(() => {
  const fetchFeaturedEmployers = async () => {
    try {
      const res = await fetch(`${BACKEND_BASE}/api/users/role-name/employer`);
      if (!res.ok) throw new Error('Failed to fetch employers');
      const data = await res.json();
      console.log('Fetched employers:', data);
      setAllEmployers(data);
      const featured = data.filter(user => user.isFeatured);
      setFeaturedEmployers(featured);
    } catch (err) {
      console.error(err);
    }
  };

  fetchFeaturedEmployers();
}, []);


const getLogoForJob = (userId) => {
  const user = allEmployers.find(u => u._id === userId);
  if (user?.logo) {
    return `${BACKEND_BASE}/uploads/${user.logo}`;
  }
  return "/images/oracle.jpg"; // fallback logo
};

const getTimeSincePosting = (createdAt) => {
  const now = new Date();
  const postedDate = new Date(createdAt);
  const diffMs = now - postedDate; // difference in milliseconds

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 24) {
    return `${diffHours} hr${diffHours !== 1 ? 's' : ''} ago`;
  } else {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  }
};

// const getTotalApplications = async (jobId) => {
//   console.log(jobId);
//   try {
//     const res = await fetch(`${BACKEND_BASE}/api/applications/count/${jobId}`);
//     if (!res.ok) throw new Error("Failed to fetch applications count");
//     const data = await res.json();
//     return data.totalApplications || 0;
//   } catch (err) {
//     console.error(err);
//     return 0;
//   }
// };



  const tags = [
    "UI Designer", "UI Developer", "Frontend Developer", "Full Stack", "Mobile App Developer",
    "UI Designer", "Cloud Engineer", "Data Scientist", "ML Engineer", "SOC Analyst", "Security Engineer",
    "UX Designer", "Product Designer", "Manual Tester", "QA Engineer", "IT Support", "Network Engineer",
    "Systems Admin", "AI Engineer", "AR/VR Developer"
  ];

  // const handleOtpScreen = (data) => {
  //   setOtpData(data); // store the data for OTP verification
  //   setRegisterType('otp'); // you can conditionally render OTP popup
  //   setShowLogin(false); // close login if open
  // };

  const handleOtpScreen = (data, type) => {
    setOtpData(data);
    setRegisterType(type === 'employer' ? 'otp-employer' : 'otp-candidate');
    setShowLogin(false);
  };

  const handleRegister = (type) => {
    console.log("User type selected:", type);
    setRegisterType(type); // set the type
    setShowLogin(false);   // close login popup
  };

  const handleBackToLogin = () => {
    setShowLogin(true);
    setRegisterType(null);
  };

  const [loggedUser, setLoggedUser] = useState(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      setLoggedUser(JSON.parse(storedUser));
    }
  }, []);   // runs only once

  useEffect(() => {
    if (loggedUser?.email) {
      setNewsletterEmail(loggedUser.email);
      // check subscription
      fetch(`${BACKEND_BASE}/api/subscriptions?email=${encodeURIComponent(loggedUser.email)}`)
        .then((r) => r.json())
        .then((data) => {
          if (data?.exists) setSubscribed(true);
        })
        .catch((e) => console.error('check subscription error', e));
    }
  }, [loggedUser]);

  const handleSearchInput = (value) => {
    setSearchInput(value);
    if (value.trim() === '') {
      setSuggestions([]);
      return;
    }

    const filtered = jobs.filter((job) => {
      const searchLower = value.toLowerCase();
      return (
        job.title?.toLowerCase().includes(searchLower) ||
        job.company?.toLowerCase().includes(searchLower) ||
        (Array.isArray(job.skills) &&
          job.skills.some((skill) => skill.toLowerCase().includes(searchLower)))
      );
    });

    setSuggestions(filtered.slice(0, 6)); // Show max 6 suggestions
  };

  const handleSuggestionClick = (job) => {
    setSearchInput(job.title);
    setSuggestions([]);
    setSelectedJob(job);
    setOpen(true);
  };

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");

    if (!storedUser || storedUser === "undefined") return;

    const parsedUser = JSON.parse(storedUser);

  }, [session]);

  const handleApply = async () => {

    console.log(loggedUser);
    setApplying(true);
    setApplicationMessage('');

    try {
      const response = await fetch(`${BACKEND_BASE}/api/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: loggedUser._id,
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
    <main className="">

      {/* Login Popup */}
      {showLogin && (
        <LoginPopup
          onClose={() => setShowLogin(false)}
          onRegister={handleRegister} // Pass type: candidate or employer
        // login={login}
        />
      )}

      {/* Registration Popup */}
      {registerType === 'candidate' && !otpData && (
        <RegisterPopup
          onClose={() => setRegisterType(null)}
          onOtpScreen={handleOtpScreen}
          onLogin={handleBackToLogin}
        />
      )}

      {registerType === 'employer' && !otpData && (
        <EmployerRegisterPopup
          onClose={() => setRegisterType(null)}
          onOtpScreen={handleOtpScreen}
          onLogin={handleBackToLogin}
        />
      )}

      {/* OTP for Candidate */}
      {registerType === 'otp-candidate' && otpData && (
        <OtpPopup
          onClose={() => { setRegisterType(null); setOtpData(null); }}
          otpData={otpData}
          onLogin={handleBackToLogin}
        />
      )}

      {/* OTP for Employer */}
      {registerType === 'otp-employer' && otpData && (
        <OtpPopup
          onClose={() => { setRegisterType(null); setOtpData(null); }}
          otpData={otpData}
          onLogin={handleBackToLogin}
        />
      )}


      {/* HERO SECTION */}
      <section className="p-[10px] md:p-[50px] mt-[30px] items-center relative">
        <h1 className="text-center text-[30px] md:text-[40px] font-bold mb-[16px]">
          Find your next tech job now!
        </h1>
        <div className="w-full max-w-3xl mx-auto relative">

          {/* Search Bar */}
          <div className="
    relative bg-[#E2F4FA] border border-[#272727] 
    rounded-full h-[54px] flex items-center
    pl-6 pr-[110px]
  ">
            <input
              type="text"
              placeholder="Search by job title, skills, or company"
              value={searchInput}
              onChange={(e) => handleSearchInput(e.target.value)}
              className="
        w-full bg-transparent outline-none 
        text-black placeholder:text-gray-500 
        text-sm sm:text-base
      "
            />

            <button
              className="
        absolute right-2 top-1/2 -translate-y-1/2
        bg-black text-white px-4 sm:px-6 
        h-[40px] sm:h-[44px]
        text-sm sm:text-[18px] rounded-full
      "
            >
              Find your job
            </button>
          </div>

          {/* Suggestions INSIDE same container */}
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 
                    bg-white border border-[#272727] 
                    rounded-lg shadow-lg mt-2 
                    z-[9999]">
              {suggestions.map((job) => (
                <div
                  key={job._id}
                  onClick={() => handleSuggestionClick(job)}
                  className="p-3 hover:bg-[#E2F4FA] cursor-pointer border-b last:border-b-0"
                >
                  <p className="font-semibold text-black">{job.title}</p>
                  <p className="text-sm text-gray-600">
                    {job.company} · {job.location}
                  </p>
                </div>
              ))}
            </div>
          )}

        </div>

        <TagsSlider />
      </section>

      {/* LATEST JOBS */}
      <section className="p-[10px] md:p-[50px] ">
        <h3 className="text-[35px] md:text-[45px] leading-[35px] md:leading-[35px] mt-[15px] font-bold mb-[16px] ">
          Latest Jobs
        </h3>

        <div className="flex flex-col items-start lg:flex-row gap-[30px]">
          {/* Jobs List */}
          <div className="lg:w-4/5 grid grid-cols-1 md:grid-cols-2 gap-[30px]">


            {jobs.map(job => (
              <div key={job._id}
                onClick={() => {
                  setSelectedJob(job);
                  setOpen(true);
                }}

                className="w-full p-[12px] bg-[#E2F4FA] border border-gray-300 rounded-lg shadow-md flex"
              >
                {/* <img
                  src="/images/oracle.jpg"
                  alt="Job"
                  className="w-[60px] h-[60px] object-cover rounded-md"
                /> */}
                <img
                  src={getLogoForJob(job.userid)}
                  alt={job.company}
                  className="w-[60px] h-[60px] object-cover rounded-md"
                />

                <div className="ml-4 flex flex-col md:flex-row">
                  <div className="w-full md:w-auto">
                    <h4 className="font-semibold text-[18px] leading-[26px] font-['Poppins']">
                      {job.title}
                    </h4>
                    <p className="text-gray-600 text-[12px] leading-[26px]">
                      <span className="font-bold"> {job.company} </span>
                      {[
          job.location,
          job.salary,
          job.type,
          job.category,
        ].filter(Boolean).join(", ")}
                      {/* {job.location}, {job.salary}, {job.type}, {job.category} */}
                    </p>
                  </div>

                  <div className="w-full md:w-auto ml-0 md:ml-4">
                    <p className="text-[12px] leading-[22px]">
                      <span>{job.location}</span> · <span>5hr</span>
                    </p>
                    <div className="flex  flex-wrap gap-[8px] mt-1">
                      {Array.isArray(job.skills) && job.skills.map((skill) => (

                        <span
                          key={skill}
                          className="bg-black text-[10px] leading-[20px] text-white rounded-full px-[10px] py-[5px]"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSkill(skill);
                          }}
                        >
                          {skill} ✕
                        </span>
                      ))}

                    </div>
                  </div>
                </div>
              </div>
            ))}

          </div>

          {/* RIGHT SIDEBAR */}
          <div className="lg:w-1/5 p-4 border border-gray-300 rounded-lg  shadow-md bg-[#E2F4FA]">
            <h4 className="text-lg font-semibold mb-2">Support our community</h4>
            <p className="text-gray-600 mb-4">
              Help us grow and provide more opportunities for talented
              professionals.
            </p>
            <button className="bg-black text-white rounded-full px-[16px] py-[8px]">
              Become a Sponsor
            </button>
          </div>
        </div>
      </section>

      {/* FEATURED COMPANIES */}
      <section className="p-[10px] md:p-[50px] ">
        <h3 className="text-[35px] md:text-[45px] leading-[35px] md:leading-[35px] mt-[15px] font-bold mb-[16px]">
          Featured Companies
        </h3>

        {/* <div className="flex flex-wrap items-center justify-center gap-1 md:gap-6">
          {[
            "alliance.png",
            "ustglobal.png",
            "alamy.png",
            "qburst.jpg",
            "google.jpg",
            "amstor.png",
            "github.png",
          ].map((img, i) => (
            <div key={i} className="bg-[#E2F4FA] md:p-2">
              <img
                src={`/images/${img}`}
                className="w-[160px] h-[80px] object-contain"
              />
            </div>
          ))}
        </div> */}

        <div className="flex flex-wrap items-center justify-center gap-1 md:gap-6">
          {featuredEmployers.map((employer) => (
            <div key={employer._id} className="bg-[#E2F4FA] md:p-2">
              <img
                src={`${BACKEND_BASE}/uploads/${employer.logo}`}
                alt={employer.companyName || 'Company Logo'}
                className="w-[160px] h-[80px] object-contain"
              />
            </div>
          ))}
        </div>

        {/* Stats Section */}
      </section>

      {/* NEWSLETTER */}
      <section className="w-full py-12">
        <div className="bg-[#E2F4FA] md:mx-[50px] p-[10px] md:p-[50px] py-[70px] text-center">

          <div className="flex flex-wrap justify-center md:justify-between items-center gap-6 text-xl font-semibold">
            <p>100+ <span className="font-medium text-gray-700">Recruiters</span></p>
            <p>25000+ <span className="font-medium text-gray-700">Candidates</span></p>
            <p>25000+ <span className="font-medium text-gray-700">Candidates</span></p>
            <p>500+ <span className="font-medium text-gray-700">Job posts</span></p>
          </div>

          <div className="mt-8  mx-auto flex flex-col md:flex-row">
            <p className="text-gray-600 mb-4 md:w-1/2">
              Subscribe to our newsletter and never miss an opportunity. Get the newest job listings and industry updates straight to your inbox.
            </p>

            <div className=" md:w-1/2
  relative 
  bg-[#E2F4FA] border border-[#272727] 
  rounded-full h-[54px] 
  flex items-center
  pl-6 pr-[110px]">
              <input
                type="text"
                placeholder="Enter Your Email Address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="
      w-full bg-transparent outline-none 
      text-black placeholder:text-gray-500 
      text-sm sm:text-base
    "
              />

              <button
                onClick={async () => {
                  try {
                    const res = await fetch(`${BACKEND_BASE}/api/subscriptions`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email: newsletterEmail, userId: session?.user?.id }),
                    });
                    if (res.ok) {
                      setSubscribed(true);
                    } else {
                      console.error('subscribe failed');
                    }
                  } catch (err) {
                    console.error(err);
                  }
                }}
                className="
      absolute right-2 top-1/2 -translate-y-1/2
      bg-black text-white 
      px-4 sm:px-6 
      h-[40px] sm:h-[44px]
      text-sm sm:text-[18px]
      rounded-full 
      whitespace-nowrap
    "
              >
                Suscribe Now
              </button>
            </div>

          </div>

        </div>
      </section>


      <Modal open={open} storedUser={loggedUser} onClose={() => setOpen(false)} >
        <div className="flex flex-col md:flex-row mb-[20px]">
          {/* <img
            src="/images/oracle.jpg" className="w-[87px]"
            alt="Job" /> */}
            <img
              src={getLogoForJob(selectedJob?.userid)}
              alt={selectedJob?.company || "Employer Logo"}
              className="w-[60px] h-[60px] object-cover rounded-md"
            />
          <div className="md:ml-4 mt-[10px]">
            <h4 className="font-semibold text-[18px] leading-[26px] font-['Poppins']">
              {selectedJob?.title}
            </h4>
            <p className="text-gray-600 text-[12px] leading-[26px]">
              <span className="font-bold"> {selectedJob?.company} </span>
            </p>
            <div className="flex flex-wrap gap-[16px] mt-1">
              {selectedJob?.jobtype && (
              <span className="bg-[#E2F4FA] text-[12px] leading-[22px] text-black rounded-full px-[16px] py-[8px]">
                {selectedJob?.jobtype}
              </span>
              )}
              {selectedJob?.salary && (
              <span className="bg-[#E2F4FA] text-[12px] leading-[22px] text-black rounded-full px-[16px] py-[8px]">
                {selectedJob?.salary}
              </span>
              )}
              <span className="bg-[#E2F4FA] text-[12px] leading-[22px] text-black rounded-full px-[16px] py-[8px]">
                {getTimeSincePosting(selectedJob?.createdAt)}
              </span>
              <span className="bg-[#E2F4FA] text-[12px] leading-[22px] text-black rounded-full px-[16px] py-[8px]">
                101 Views
              </span>
              <span className="bg-[#E2F4FA] text-[12px] leading-[22px] text-black rounded-full px-[16px] py-[8px]">
                12 applications
                {/* {totalApplications} application{totalApplications !== 1 ? "s" : ""} */}
              </span>
            </div>
          </div>
        </div>
        <p className="font-bold">About company</p>
        <p className="mb-4">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
          industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled
          it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages,
          and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
        </p>
        <p className="font-bold">Brief</p>
        <p className="mb-4">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
          industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled
          it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages,
          and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
        </p>
        <ul className="mt-2 space-y-1 text-[#525252]">
          <li className="flex items-center gap-[8px]"><span className="w-[9px] h-[9px] bg-black rounded-full mt-1"></span>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</li>
          <li className="flex items-center gap-[8px]"><span className="w-[9px] h-[9px] bg-black rounded-full mt-1"></span>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</li>
          <li className="flex items-center gap-[8px]"><span className="w-[9px] h-[9px] bg-black rounded-full mt-1"></span>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</li>
          <li className="flex items-center gap-[8px]"><span className="w-[9px] h-[9px] bg-black rounded-full mt-1"></span>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</li>
          <li className="flex items-center gap-[8px]"><span className="w-[9px] h-[9px] bg-black rounded-full mt-1"></span>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</li>
          <li className="flex items-center gap-[8px]"><span className="w-[9px] h-[9px] bg-black rounded-full mt-1"></span>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</li>
        </ul>
        {applicationMessage && (
          <div className={`mb-4 p-3 rounded-lg text-center ${applicationMessage.includes('success')
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
            }`}>
            {applicationMessage}
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <button
            onClick={() => {
              setOpen(false);
              setApplicationMessage('');
            }}
            className="px-4 py-2 rounded-full border"
            disabled={applying}
          >
            Cancel
          </button>

          <button
            onClick={handleApply}
            className="px-4 py-2 rounded-full bg-black text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={applying}
          >
            {applying ? 'Applying...' : 'Apply Now'}
          </button>
        </div>
      </Modal>
    </main>
  );
}
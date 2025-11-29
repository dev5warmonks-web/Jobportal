"use client";
import { useEffect, useState } from "react";
import { useSession } from 'next-auth/react';
import { getJobs } from "./api";
import Modal from "./components/Modal/page";
import LoginPopup from "./components/LoginPopup";
import RegisterPopup from "./components/RegisterPopup";
import EmployerRegisterPopup from "./components/EmployerRegisterPopup";
import OtpPopup from "./components/OtpPopup";


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

  const BACKEND_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

  // const [showLogin, setShowLogin] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [registerType, setRegisterType] = useState(null); // 'candidate' | 'employer' | null

  const [otpData, setOtpData] = useState(null);

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

  useEffect(() => {
    if (session?.user?.email) {
      setNewsletterEmail(session.user.email);
      // check subscription
      fetch(`${BACKEND_BASE}/api/subscriptions?email=${encodeURIComponent(session.user.email)}`)
        .then((r) => r.json())
        .then((data) => {
          if (data?.exists) setSubscribed(true);
        })
        .catch((e) => console.error('check subscription error', e));
    }
  }, [session]);

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

  const handleApply = async () => {
    // Check if user is logged in
    if (!session?.user?.id) {
      alert('Please log in to apply for jobs');
      setShowLogin(true);
      return;
    }

    // Check if job is selected
    if (!selectedJob?._id) {
      alert('No job selected');
      return;
    }

    setApplying(true);
    setApplicationMessage('');

    try {
      const response = await fetch(`${BACKEND_BASE}/api/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.user.token}`
        },
        body: JSON.stringify({
          userId: session.user.id,
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
      <section className="p-[10px] md:p-[50px] items-center bg-[#F5F9FB]">
        <h1 className="text-center text-[30px] md:text-[40px] font-bold mb-[16px]">
          Find your next tech job now!
        </h1>

        {/* Search Bar */}
        <div className="w-full max-w-3xl mx-auto relative">
          <div className="flex items-center gap-3 bg-[#E2F4FA] border border-[#272727] rounded-full pl-[25px] pr-[5px] h-[54px]">
            <input
              type="text"
              placeholder="Search by job title, skills, or company"
              value={searchInput}
              onChange={(e) => handleSearchInput(e.target.value)}
              className="flex-1 bg-transparent outline-none text-black placeholder:text-gray-500"
            />

            <button className="bg-black text-white px-[20px] h-[44px] text-[12px] md:text-[18px] leading-[20px] md:leading-[26px] rounded-full">
              Find your job
            </button>
          </div>

          {/* Suggestions Dropdown */}
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border border-[#272727] rounded-lg shadow-lg mt-2 z-50 max-w-3xl mx-auto">
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
                  {Array.isArray(job.skills) && job.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {job.skills.slice(0, 3).map((skill) => (
                        <span key={skill} className="text-xs bg-black text-white rounded-full px-2 py-1">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Job Categories (Responsive) */}
        <div className="flex flex-wrap md:grid grid-cols-5 md:gap-[40px] pt-[20px] md:pt-[40px] md:px-[176px] md:justify-center">

          <div className="w-1/2 md:w-auto mt-[10px]" >
            <h5 className="font-bold text-[16px]">Job Category</h5>
            <ul className="mt-2 space-y-1 text-[#525252] text-[16px] leading-[22px]">
              <li className="flex items-center gap-[8px] text-[16px] leading-[22px]"><span className="w-[9px] h-[9px] bg-black rounded-full mt-1"></span>UI Designer</li>
              <li className="flex items-center md:gap-[8px]"><span className="w-[9px] h-[9px] bg-black rounded-full mt-1"></span>UI Developer</li>
              <li className="flex items-center gap-[8px]"><span className="w-[9px] h-[9px] bg-black rounded-full mt-1"></span>JavaScript Developer</li>
              <li className="flex items-center gap-[8px]"><span className="w-[9px] h-[9px] bg-black rounded-full mt-1"></span>Python Developer</li>
              <li className="flex items-center gap-[8px]"><span className="w-[9px] h-[9px] bg-black rounded-full mt-1"></span>UX Designer</li>
              <li className="flex items-center gap-[8px]"><span className="w-[9px] h-[9px] bg-black rounded-full mt-1"></span>Web Designer</li>
            </ul>
          </div>
          <div className="w-1/2 md:w-auto mt-[10px]">
            <h5 className="font-bold text-[16px]">Experience</h5>
            <ul className="mt-2 space-y-1 text-[#525252]">
              <li className="flex items-center gap-[8px]"><span className="w-[9px] h-[9px] bg-black rounded-full mt-1"></span>Fresher</li>
              <li className="flex items-center gap-[8px]"><span className="w-[9px] h-[9px] bg-black rounded-full mt-1"></span>0-1 Years</li>
              <li className="flex items-center gap-[8px]"><span className="w-[9px] h-[9px] bg-black rounded-full mt-1"></span>1-3 Years</li>
              <li className="flex items-center gap-[8px]"><span className="w-[9px] h-[9px] bg-black rounded-full mt-1"></span>3-5 Years</li>
              <li className="flex items-center gap-[8px]"><span className="w-[9px] h-[9px] bg-black rounded-full mt-1"></span>6-7 Years</li>
              <li className="flex items-center gap-[8px]"><span className="w-[9px] h-[9px] bg-black rounded-full mt-1"></span>8 Years</li>
            </ul>
          </div>
          <div className="w-1/2 md:w-auto mt-[10px]">
            <h5 className="font-bold text-[16px]">Expected CTC</h5>
            <ul className="mt-2 space-y-1 text-[#525252]">
              <li className="flex items-center gap-[8px]"><span className="w-[9px] h-[9px] bg-black rounded-full mt-1"></span>15K</li>
              <li className="flex items-center gap-[8px]"><span className="w-[9px] h-[9px] bg-black rounded-full mt-1"></span>15K-25K</li>
              <li className="flex items-center gap-[8px]"><span className="w-[9px] h-[9px] bg-black rounded-full mt-1"></span>25K-50K</li>
              <li className="flex items-center gap-[8px]"><span className="w-[9px] h-[9px] bg-black rounded-full mt-1"></span>50K-75K</li>
              <li className="flex items-center gap-[8px]"><span className="w-[9px] h-[9px] bg-black rounded-full mt-1"></span>75K-100K</li>
              <li className="flex items-center gap-[8px]"><span className="w-[9px] h-[9px] bg-black rounded-full mt-1"></span>100K+</li>
            </ul>
          </div>
          <div className="w-1/2 md:w-auto mt-[10px]">
            <h5 className="font-bold text-[16px]">Sort by date</h5>
            <ul className="mt-2 space-y-1 text-[#525252]">
              <li className="flex items-center gap-[8px]"><span className="w-[9px] h-[9px] bg-black rounded-full mt-1"></span>UI Designer</li>
              <li className="flex items-center gap-[8px]"><span className="w-[9px] h-[9px] bg-black rounded-full mt-1"></span>UI Developer</li>
              <li className="flex items-center gap-[8px]"><span className="w-[9px] h-[9px] bg-black rounded-full mt-1"></span>JavaScript Developer</li>
              <li className="flex items-center gap-[8px]"><span className="w-[9px] h-[9px] bg-black rounded-full mt-1"></span>Python Developer</li>
              <li className="flex items-center gap-[8px]"><span className="w-[9px] h-[9px] bg-black rounded-full mt-1"></span>UX Designer</li>
              <li className="flex items-center gap-[8px]"><span className="w-[9px] h-[9px] bg-black rounded-full mt-1"></span>Web Designer</li>
            </ul>
          </div>
          <div className="w-1/2 md:w-auto mt-[10px]">
            <h5 className="font-bold text-[16px]">Job Category</h5>
            <ul className="mt-2 space-y-1 text-[#525252]">
              <li className="flex items-center gap-[8px]"><span className="w-[9px] h-[9px] bg-black rounded-full mt-1"></span>1 day</li>
              <li className="flex items-center gap-[8px]"><span className="w-[9px] h-[9px] bg-black rounded-full mt-1"></span>UI Developer</li>
              <li className="flex items-center gap-[8px]"><span className="w-[9px] h-[9px] bg-black rounded-full mt-1"></span>JavaScript Developer</li>
              <li className="flex items-center gap-[8px]"><span className="w-[9px] h-[9px] bg-black rounded-full mt-1"></span>Python Developer</li>
              <li className="flex items-center gap-[8px]"><span className="w-[9px] h-[9px] bg-black rounded-full mt-1"></span>UX Designer</li>
              <li className="flex items-center gap-[8px]"><span className="w-[9px] h-[9px] bg-black rounded-full mt-1"></span>Web Designer</li>
            </ul>
          </div>


        </div>
      </section>

      {/* LATEST JOBS */}
      <section className="p-[10px] md:p-[50px] ">
        <h3 className="text-[35px] md:text-[45px] leading-[35px] md:leading-[35px] mt-[15px] font-bold mb-[16px] ">
          Latest Jobs
        </h3>

        <div className="flex flex-col lg:flex-row gap-[30px]">
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
                <img
                  src="/images/oracle.jpg"
                  alt="Job"
                  className="w-[60px] h-[60px] object-cover rounded-md"
                />

                <div className="ml-4 flex flex-col md:flex-row">
                  <div className="w-full md:w-auto">
                    <h4 className="font-semibold text-[18px] leading-[26px] font-['Poppins']">
                      {job.title}
                    </h4>
                    <p className="text-gray-600 text-[12px] leading-[26px]">
                      <span className="font-bold"> {job.company} </span>
                      {job.location}, {job.salary}, {job.type}, {job.category}
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
          <div className="lg:w-1/5 p-4 border border-gray-300 rounded-lg h-auto shadow-md bg-[#E2F4FA]">
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

        <div className="flex flex-wrap items-center justify-center gap-1 md:gap-6">
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
            <p className="text-gray-600 mb-4">
              Subscribe to our newsletter and never miss an opportunity. Get the newest job listings and industry updates straight to your inbox.
            </p>

            <div className="w-full max-w-3xl mx-auto flex items-center gap-3 bg-[#E2F4FA] border border-[#272727] rounded-full pl-[25px] pr-[5px] h-[54px]">
              {subscribed ? (
                <div className="flex-1 text-black font-medium">Suscribed</div>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="Enter your email address"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-black placeholder:text-gray-500"
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
                    className={`${newsletterEmail ? "bg-black disabled" : "bg-black"} bg-black text-white px-[20px] h-[44px] text-[15px] md:text-[18px] leading-[20px] md:leading-[26px] rounded-full`}
                  >
                    Suscribe Now
                  </button>
                </>
              )}
            </div>
          </div>

        </div>
      </section>


      <Modal open={open} onClose={() => setOpen(false)} >
        <div className="flex flex-col md:flex-row mb-[20px]">
          <img
            src="/images/oracle.jpg" className="w-[87px]"
            alt="Job" />
          <div className="md:ml-4 mt-[10px]">
            <h4 className="font-semibold text-[18px] leading-[26px] font-['Poppins']">
              {selectedJob?.title}
            </h4>
            <p className="text-gray-600 text-[12px] leading-[26px]">
              <span className="font-bold"> {selectedJob?.company} </span>
            </p>
            <div className="flex flex-wrap gap-[16px] mt-1">
              <span className="bg-[#E2F4FA] text-[12px] leading-[22px] text-black rounded-full px-[16px] py-[8px]">
                Full-time
              </span>
              <span className="bg-[#E2F4FA] text-[12px] leading-[22px] text-black rounded-full px-[16px] py-[8px]">
                25-55k
              </span>
              <span className="bg-[#E2F4FA] text-[12px] leading-[22px] text-black rounded-full px-[16px] py-[8px]">
                6hr ago
              </span>
              <span className="bg-[#E2F4FA] text-[12px] leading-[22px] text-black rounded-full px-[16px] py-[8px]">
                101 Views
              </span>
              <span className="bg-[#E2F4FA] text-[12px] leading-[22px] text-black rounded-full px-[16px] py-[8px]">
                12 applications
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

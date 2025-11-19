"use client";
import { useEffect, useState } from "react";
import { getJobs } from "./api";

export default function Home() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    getJobs().then(setJobs);
  }, []);

  return (
    <main className="">
      {/* HERO SECTION */}
      <section className="p-[10px] md:p-[50px] items-center bg-[#F5F9FB]">
        <h1 className="text-center text-[30px] md:text-[40px] font-bold mb-[16px]">
          Find your next tech job now!
        </h1>

        {/* Search Bar */}
        <div className="w-full max-w-3xl mx-auto flex items-center gap-3 bg-[#E2F4FA] border border-[#272727] rounded-full pl-[25px] pr-[5px] h-[54px]">
          <input
            type="text"
            placeholder="Search by job title, skills, or company"
            className="flex-1 bg-transparent outline-none text-black placeholder:text-gray-500"
          />

          <button className="bg-black text-white px-[20px] h-[44px] text-[12px] md:text-[18px] leading-[20px] md:leading-[26px] rounded-full">
            Find your job
          </button>
        </div>

        {/* Job Categories (Responsive) */}
        <div className="flex flex-wrap  md:gap-[40px] pt-[20px] md:pt-[40px] md:px-[40px] md:justify-center">
         
            <div className="w-1/2 md:w-auto mt-[10px]" >
              <h5 className="font-bold text-[16px]">Job Category</h5>
              <ul className="mt-2 space-y-1 text-[#525252]">
                <li className="flex items-center gap-[8px]"><span className="w-[9px] h-[9px] bg-black rounded-full mt-1"></span>UI Designer</li>
                 <li className="flex items-center md:gap-[8px]"><span className="w-[9px] h-[9px] bg-black rounded-full mt-1"></span>UI Developer</li>
                <li className="flex items-center gap-[8px]"><span className="w-[9px] h-[9px] bg-black rounded-full mt-1"></span>JavaScript Developer</li>
                <li className="flex items-center gap-[8px]"><span className="w-[9px] h-[9px] bg-black rounded-full mt-1"></span>Python Developer</li>
                <li className="flex items-center gap-[8px]"><span className="w-[9px] h-[9px] bg-black rounded-full mt-1"></span>UX Designer</li>
                <li className="flex items-center gap-[8px]"><span className="w-[9px] h-[9px] bg-black rounded-full mt-1"></span>Web Designer</li>
              </ul>
            </div>
                     <div className="w-1/2 md:w-auto mt-[10px]">
              <h5 className="font-bold text-[16px]">Job Category</h5>
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
                <li className="flex items-center gap-[8px]"><span className="w-[9px] h-[9px] bg-black rounded-full mt-1"></span>UI Designer</li>
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
        <h3 className="text-[45px] leading-[35px] font-bold mb-[16px]">
          Latest Jobs
        </h3>

        <div className="flex flex-col lg:flex-row">
          {/* Jobs List */}
          <div className="lg:w-4/5 border border-gray-300 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 gap-[30px]">

            {/* Job Cards */}
            {[1, 2, 3, 4].map((_, i) => (
              <div
                key={i}
                className="w-full p-[12px] bg-[#E2F4FA] border border-gray-300 rounded-lg shadow-md flex"
              >
                <img
                  src="/images/oracle.jpg"
                  alt="Job"
                  className="w-[60px] h-[60px] object-cover rounded-md"
                />

                <div className="ml-4 flex flex-col md:flex-row justify-between">
                  <div>
                    <h4 className="font-semibold text-[18px] leading-[26px] font-['Poppins']">
                      Senior project manager - Python
                    </h4>
                    <p className="text-gray-600 text-[12px] leading-[26px]">
                      <span className="font-bold">Accenture </span>
                      Chennai, 25K-50K, Design, Full time
                    </p>
                  </div>

                  <div>
                    <p className="text-[12px] leading-[22px]">
                      <span>Chennai</span> · <span>5hr</span>
                    </p>
                    <div className="flex gap-[16px] mt-1">
                      <span className="bg-black text-[12px] leading-[22px] text-white rounded-full px-[16px] py-[8px]">
                        Python
                      </span>
                      <span className="bg-black text-[12px] leading-[22px] text-white rounded-full px-[16px] py-[8px]">
                        AWS
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {jobs.map(job => ( 
                       <div
               
                className="w-full p-[12px] bg-[#E2F4FA] border border-gray-300 rounded-lg shadow-md flex"
              >
                <img
                  src="/images/oracle.jpg"
                  alt="Job"
                  className="w-[60px] h-[60px] object-cover rounded-md"
                />

                <div className="ml-4 flex flex-col md:flex-row justify-between">
                  <div>
                    <h4 className="font-semibold text-[18px] leading-[26px] font-['Poppins']">
                      {job.title}
                    </h4>
                    <p className="text-gray-600 text-[12px] leading-[26px]">
                      <span className="font-bold"> {job.company} </span>
                      Chennai, 25K-50K, Design, Full time
                    </p>
                  </div>

                  <div>
                    <p className="text-[12px] leading-[22px]">
                      <span>Chennai</span> · <span>5hr</span>
                    </p>
                    <div className="flex gap-[16px] mt-1">
                      <span className="bg-black text-[12px] leading-[22px] text-white rounded-full px-[16px] py-[8px]">
                        Python
                      </span>
                      <span className="bg-black text-[12px] leading-[22px] text-white rounded-full px-[16px] py-[8px]">
                        AWS
                      </span>
                    </div>
                  </div>
                </div>
              </div>
               ))}
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="lg:w-1/5 p-4 border border-gray-300 rounded-lg shadow-md bg-[#E2F4FA]">
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
        <h3 className="text-[45px] leading-[35px] font-bold mb-[16px]">
          Featured Companies
        </h3>

        <div className="flex flex-wrap gap-1 md:gap-6">
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
          <input
            type="text"
            placeholder="Search by job title, skills, or company"
            className="flex-1 bg-transparent outline-none text-black placeholder:text-gray-500"
          />

          <button className="bg-black text-white px-[20px] h-[44px] text-[18px] leading-[26px] rounded-full">
            Find your job
          </button>
        </div>
          </div>

        </div>
      </section>
    </main>
  );
}

"use client";
import { useEffect, useState } from "react";
import { getJobs } from "./api"; 
import Modal from "./components/Modal/page";


export default function Home() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    getJobs().then(setJobs);
  }, []);

  const [open, setOpen] = useState(false);
const [selectedJob, setSelectedJob] = useState(null);


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
                       <div   key={job._id}
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

                <div className="ml-4 flex flex-col md:flex-row justify-between">
                  <div className="w-full md:w-1/2">
                    <h4 className="font-semibold text-[18px] leading-[26px] font-['Poppins']">
                      {job.title}
                    </h4>
                    <p className="text-gray-600 text-[12px] leading-[26px]">
                      <span className="font-bold"> {job.company} </span>
                      {job.location}, {job.salary}, {job.type}, {job.category}
                    </p>
                  </div>

                  <div className="w-full md:w-1/2">
                    <p className="text-[12px] leading-[22px]">
                      <span>{job.location}</span> · <span>5hr</span>
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
    

      <Modal open={open} onClose={() => setOpen(false)} >
        <div className="flex flex-col md:flex-row mb-[20px]">
          <img
            src="/images/oracle.jpg" className="w-[87px]"
            alt="Job"/>
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
        <div className="flex gap-3 justify-end">
          <button
            onClick={() => setOpen(false)}
            className="px-4 py-2 rounded-full border"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              // your action
              setOpen(false);
            }}
            className="px-4 py-2 rounded-full bg-black text-white"
          >
            Apply Now
          </button>
        </div>
      </Modal>
    </main>
  );
}

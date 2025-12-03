"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const menu = [
    { name: "Jobs", path: "/master/jobs" },
    { name: "Applications", path: "/master/applications" },
    { name: "Employers", path: "/master/employers" },
    { name: "Candidates", path: "/master/candidates" },
    { name: "Job Category", path: "/master/jobcategory" },
    { name: "Job Location", path: "/master/joblocation" },
    { name: "Expected CTC", path: "/master/ctcmaster" },
    { name: "Experience", path: "/master/jobexperience" },
    { name: "Sort By Date", path: "/master/sortbydate" },
    { name: "Education", path: "/master/education" },
    { name: "Industry", path: "/master/industry" },
    { name: "Skills", path: "/master/skills" },
  ];

  return (
    <div className="bg-[#E2F4FA] p-4 md:p-6 md:min-h-screen w-full md:w-64">

      {/* Tabs - mobile horizontal / desktop vertical */}
      <div className="flex md:flex-col flex-row md:space-y-3 space-x-3 md:space-x-0 overflow-x-auto">

        {menu.map((item) => {
          const isActive = pathname === item.path;

          return (
            <Link key={item.path} href={item.path}>
              <div
                className={`flex items-center justify-between px-4 py-3 gap-2 
                  rounded-full cursor-pointer transition-all border min-w-[150px]
                  ${
                    isActive
                      ? "bg-[#CCE9F2] border-[#A8D6E3] font-bold"
                      : "hover:bg-[#D6EFF6] border-transparent"
                  }
                `}
              >
                {/* Tab Text */}
                <span
                  className={`${
                    isActive ? "font-bold" : "font-normal"
                  } text-sm text-black md:text-base`}
                >
                  {item.name}
                </span>

                {/* Arrow circle */}
                <div
                  className={`w-7 h-7 flex items-center justify-center rounded-full p-2
                    ${isActive ? "bg-[#CCE9F2] border border-black" : "bg-[#E2F4FA]"}
                  `}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-4 h-4 text-black"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          );
        })}

      </div>

    </div>
  );
}

"use client";
import { useState } from "react";
import BasicDetails from "./BasicDetails";
import ProfessionalDetails from "./ProfessionalDetails";
import AppliedJobs from "./appliedjobs";
import Topbar from "../components/topbar/page";
import { SessionProvider } from "next-auth/react";


export default function profilepage() {
  const [activeTab, setActiveTab] = useState("basic");

  const tabs = [
    { id: "basic", name: "Basic Details" },
    { id: "professional", name: "Professional Details" },
    { id: "applied", name: "Applied Jobs" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "basic":
        return <BasicDetails />;
      case "professional":
        return <ProfessionalDetails />;
      case "applied":
        return <AppliedJobs />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#E2F4FA]">
      {/* Topbar */}
      <SessionProvider>
        <Topbar />
      </SessionProvider>

      {/* Main content with vertical tabs */}
      <div className="flex flex-col md:flex-row p-4 md:p-6 mt-6">
        {/* Tabs */}
        <div className="flex md:flex-col flex-row md:space-y-3 space-x-3 md:space-x-0 overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <div
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-between px-4 py-3 gap-2 rounded-full cursor-pointer transition-all border min-w-[150px]
                  ${isActive ? "bg-[#CCE9F2] border-[#A8D6E3] font-bold" : "hover:bg-[#D6EFF6] border-transparent"}
                `}
              >
                {/* Tab Text */}
                <span className={`${isActive ? "font-bold" : "font-normal"} text-sm text-black md:text-base`}>
                  {tab.name}
                </span>

                {/* Circle with Arrow */}
                <div
                  className={`w-7 h-7 flex items-center justify-center rounded-full p-2
                    ${isActive ? "bg-[#CCE9F2] border border-black" : "bg-[#E2F4FA]"}`}
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
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 mt-4 md:mt-0 md:ml-6">{renderTabContent()}</div>
      </div>
    </div>
  );
}

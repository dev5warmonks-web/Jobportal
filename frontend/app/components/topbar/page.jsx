"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Topbar() {
  const pathname = usePathname();
  const adminName = "Raghesh K R"; 
  const profileImage = "/images/profile.jpg";

  return (
    <div className="bg-white">
      <div className="w-full bg-[#E2F4FA] text-black">
        <div className="flex justify-between items-center ml-5 p-3">
            <h2 className="text-2xl font-bold">techjobs</h2>

            {/* Profile circle */}
            <div className="flex items-center space-x-3 rounded-full px-5 py-2">
                <span className="font-normal">Hi,{adminName}</span>
                <img 
                    src={profileImage} 
                    alt="Profile" 
                    className="w-10 h-10 rounded-full object-cover border-2 border-black"
                />
            </div>
        </div>

        <div className="mt-5 px-4 bg-[#CCE9F2] p-5 ml-5 mr-5">
          <p className="text-lg">Welcome,</p>
          <p className="text-xl font-semibold">{adminName}</p>
          <p className="text-black text-sm mt-2">
            Manage your job applications, update your profile, and explore new opportunities—all in one place.
          </p>
        </div>
      </div>
    </div>
  );
}

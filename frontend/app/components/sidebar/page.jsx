"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const menu = [
    { name: "Basic Details", path: "/profile/basic-details" },
    { name: "Professional Details", path: "/profile/professional-details" },
    { name: "Applied Jobs", path: "/profile/applied-jobs" },
  ];

  return (
    <div className="w-auto bg-[#E2F4FA] text-black h-screen p-6">

      <div className="flex flex-col space-y-3">
        {menu.map((item) => {
          const isActive = pathname === item.path;

          return (
            <Link key={item.path} href={item.path}>
              <div
                className={`flex items-center justify-between px-4 py-3 gap-2
                  rounded-full cursor-pointer transition-all border 
                  ${
                    isActive
                      ? "bg-[#CCE9F2] border-[#A8D6E3] font-medium font-bold"
                      : "hover:bg-[#D6EFF6] border-transparent"
                  }
                `}
              >
                {/* Tab Text */}
                <span className={`${isActive ? "font-bold" : "font-normal"}`}>
                  {item.name}
                </span>

                {/* Circle with Arrow */}
                <div
                  className={`
                    w-7 h-7 flex items-center p-2 justify-center rounded-full
                    ${isActive ? "bg-[#CCE9F2] border border-black" : "bg-[#E2F4FA]"}
                  `}
                >
                  {/* Arrow SVG */}
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

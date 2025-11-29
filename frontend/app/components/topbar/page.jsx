"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from "react";

export default function Topbar() {
  const pathname = usePathname();
  const profileImage = "/images/profile.jpg";
  const { data: session } = useSession();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUserName = async () => {
      if (!session?.user?.id) return;

      try {
        const response = await fetch(`http://localhost:5000/api/users/${session.user.id}`, {
          headers: {
            'Authorization': `Bearer ${session.user.token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          const fullName = `${userData.firstName} ${userData.lastName || ''}`.trim();
          setUserName(fullName);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Fallback to session name if fetch fails
        setUserName(session.user.name || "User");
      }
    };

    fetchUserName();
  }, [session]);
  return (
    <div className="bg-white">
      <div className="w-full bg-[#E2F4FA] text-black">
        <div className="flex justify-between items-center ml-5 p-3">
          <h2 className="text-2xl font-bold">techjobs</h2>

          {/* Profile circle */}
          <div className="flex items-center space-x-3 rounded-full px-5 py-2">
            <span className="font-normal">Hi, {userName || session?.user?.name || 'Guest'}</span>
            <img
              src={profileImage}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-black"
            />
          </div>
        </div>

        <div className="mt-5 px-4 bg-[#CCE9F2] p-5 ml-5 mr-5">
          <p className="text-lg">Welcome,</p>
          <p className="text-xl font-semibold">{userName || session?.user?.name || 'Guest'}</p>
          <p className="text-black text-sm mt-2">
            Manage your job applications, update your profile, and explore new opportunities—all in one place.
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import LoginPopup from "./LoginPopup";
import RegisterPopup from "./RegisterPopup";
import EmployerRegisterPopup from "./EmployerRegisterPopup";
import { getUserRole } from "../api/api";

export default function Navbar() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [userType, setUserType] = useState(null);
  const [loggedUser, setLoggedUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [roleName, setRoleName] = useState(null);

  const profileImage = "/images/profile.jpg";

  // Load user
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setLoggedUser(JSON.parse(stored));
      } catch {
        console.error("Invalid JSON in localStorage");
      }
    }
  }, []);

  // Load role
  useEffect(() => {
    async function loadRole() {
      if (!loggedUser?.user_role) return;

      try {
        const roles = await getUserRole();
        const found = roles.find((r) => r._id === loggedUser.user_role);
        setRoleName(found?.name?.toLowerCase() || "user");
      } catch (e) {
        console.error("Failed to fetch roles:", e);
      }
    }

    loadRole();
  }, [loggedUser]);

  const openLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  const openRegister = (type) => {
    setUserType(type);
    setShowLogin(false);
    setShowRegister(true);
  };

  const closePopups = () => {
    setShowLogin(false);
    setShowRegister(false);
    setUserType(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    setLoggedUser(null);
    window.location.href = "/";
  };

  const profileUrl =
    roleName === "employer"
      ? "/employer/jobs"
      : ["admin", "super admin"].includes(roleName)
      ? "/master/jobs"
      : "/profilepages";

  return (
    <>
      <nav className="w-full border-b border-gray-200 bg-gradient-to-b from-[#E2F4FA] via-white to-[#E2F4FA] antialiased">
        <div className="mx-auto p-[10px] md:p-[50px] py-4 flex items-center justify-between">

          {/* Left Logo */}
          <div className="text-2xl font-semibold tracking-tight">
            <span className="text-black">nexttechie.</span>
          </div>

          {/* Right Section */}
          {loggedUser ? (
            // Logged In Menu
            <div className="relative">
              <div
                className="flex items-center space-x-3 px-5 py-2 rounded-full cursor-pointer hover:bg-gray-100"
                onClick={() => setOpen(!open)}
              >
                <span>Hi, {loggedUser.firstName || loggedUser.email || "User"}</span>
                <img
                  src={loggedUser.profileImage || profileImage}
                  className="w-10 h-10 rounded-full object-cover border-2 border-black"
                />
              </div>

              {open && (
                <div className="absolute right-0 mt-2 w-44 bg-[#E2F4FA] border rounded-xl shadow-lg py-2 z-50">
                  <button
                    onClick={() => (window.location.href = "/")}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    🏠 Home
                  </button>

                  <Link href={profileUrl}>
                    <div className="block px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer">
                      👤 My Profile
                    </div>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                  >
                    🔓 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Not Logged In (WRAPPED properly)
            <div className="flex items-center md:space-x-4">
              <button
                onClick={openLogin}
                className="text-gray-600 hover:text-black font-medium text-[12px] md:text-[18px]"
              >
                Sign in / Register
              </button>

              <button className="px-[5px] py-[3px] md:px-4 md:py-2 bg-black text-white text-[12px] md:text-[18px] rounded-full hover:bg-gray-800 transition">
                Post a job
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Popups */}
      {showLogin && <LoginPopup onClose={closePopups} onRegister={openRegister} />}
      {showRegister && userType === "candidate" && (
        <RegisterPopup onClose={closePopups} onLogin={openLogin} />
      )}
      {showRegister && userType === "employer" && (
        <EmployerRegisterPopup onClose={closePopups} onLogin={openLogin} />
      )}
    </>
  );
}

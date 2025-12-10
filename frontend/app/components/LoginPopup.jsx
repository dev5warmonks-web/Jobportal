'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { loginUser } from '../api/api';
import { getUserRole } from "../api/api";
import { BASE_URL } from "../config/apiConfig";

export default function LoginPopup({ onClose, onRegister, login }) {
  const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');

  const [error, setError] = useState('');
  const [showUserType, setShowUserType] = useState(false);
  // const { login } = useSession();

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError("");

  //   try {
  //     const res = await fetch("https://api.mindssparsh.com/api/auth/login", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         email: emailOrPhone,
  //         mobile: "9876543210",
  //       }),
  //     });

  //     const data = await res.json();
  //     // alert(JSON.stringify(data, null, 2));
  //     if (!res.ok) {
  //       setError(data.message || "Login failed");
  //       return;
  //     }

  //     // Store user in localStorage / cookie
  //     localStorage.setItem("user", JSON.stringify(data));
  //     sessionStorage.setItem("user", JSON.stringify(data));

  //     // Redirect
  //     // window.location.href = "/profilepages";

  //   } catch (err) {
  //     console.log(err);
  //     setError("Something went wrong");
  //   }
  // };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^\d{10}$/;

      const isEmail = emailRegex.test(emailOrPhone);
      const isPhone = phoneRegex.test(emailOrPhone);

      if (!isEmail && !isPhone) {
        setError("Enter a valid email or 10-digit phone number");
        return;
      }

      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: isEmail ? emailOrPhone : "",
          mobile: isPhone ? emailOrPhone : "",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // Save user
      localStorage.setItem("user", JSON.stringify(data));
      sessionStorage.setItem("user", JSON.stringify(data));

      //  Fetch all roles like UserMenu
      const allRoles = await getUserRole();

      //  Match role ID with user role
      // const matchedRole = allRoles.find(r => r._id === data.user_role);
      // const roleName = matchedRole?.name?.toLowerCase() || "candidate";
      
      let roleName = "candidate"; 
      if (data.user_role) {
        const matchedRole = allRoles.find(r => r._id === data.user_role);
        roleName = matchedRole?.name?.toLowerCase() || "candidate";
      } else {
        console.warn("User role missing in login response, defaulting to 'candidate'");
      }

      console.log("Matched role:", roleName);

      // SET COOKIE FOR MIDDLEWARE 
    document.cookie = `role=${roleName}; path=/`;

    //secure cookie for HTTPS:
    //document.cookie = `role=${roleName}; path=/; secure; samesite=lax`;

    //cookie to expire after a day:
    //document.cookie = `role=${roleName}; path=/; max-age=86400`;

      //  Redirect based on role
      if (roleName === "employer") {
        window.location.href = "/employer/jobs";
      } else if (["admin", "super admin"].includes(roleName)) {
        window.location.href = "/master/jobs";
      } else {
        window.location.href = "/profilepages";
      }

      onClose();

    } catch (err) {
      // console.error(err);
      // setError("Something went wrong");
      setError("User not found. Please register first.");
    }
  };

  const handleRegisterClick = () => {
    // Show user type selection before opening registration
    setShowUserType(true);
  };

  const handleUserTypeSelect = (type) => {
    onRegister(type); // passes 'candidate' or 'employer' to page.js
  };


  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/20 z-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-[#E2F4FB] rounded-lg shadow-md relative">

        {/* Header with title and close button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Sign In to Your Account</h2>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#CCE9F2] hover:bg-gray-300 text-xl"
          >&times;</button>
        </div>

        <p className="text-sm text-gray-700 mb-4">
          Access your dashboard and manage everything in one place. Enter your credentials to continue.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={emailOrPhone}
              placeholder="Enter your registered email or phone number"
              onChange={(e) => setEmailOrPhone(e.target.value)}
              className="w-full px-3 py-2 border bg-[#CCE9F2] rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>
          {/* <div>
            <input
              type="tel"
              value={mobile}
              placeholder="Enter your phone number"
              onChange={(e) => setMobile(e.target.value)}
              className="w-full px-3 py-2 border bg-[#CCE9F2] rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div> */}

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-black bg-[#CCE9F2] rounded-lg hover:bg-black hover:text-white"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-black bg-[#CCE9F2] rounded-lg hover:bg-black hover:text-white"
            >
              Cancel
            </button>
          </div>
        </form>

        {!showUserType ? (
          <p className="text-sm text-center mt-4">
            Don't have an account?{' '}
            <button onClick={handleRegisterClick} className="text-blue-500 hover:underline">
              Register
            </button>
          </p>
        ) : (
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => handleUserTypeSelect('candidate')}
              className="px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-500"
            >
              Candidate
            </button>
            <button
              onClick={() => handleUserTypeSelect('employer')}
              className="px-4 py-2 bg-green-400 text-white rounded hover:bg-green-500"
            >
              Employer
            </button>
          </div>
        )}

        {/* <p className="text-sm text-center mt-4">
          Don't have an account?{' '}
          <button onClick={onRegister} className="text-blue-500 hover:underline">
            Register
          </button>
        </p> */}
      </div>
    </div>
  );
}

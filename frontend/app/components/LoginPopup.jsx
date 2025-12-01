'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { loginUser } from '../api/api';

export default function LoginPopup({ onClose, onRegister, login }) {
  const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');

  const [error, setError] = useState('');
  const [showUserType, setShowUserType] = useState(false);
  // const { login } = useSession();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("https://api.mindssparsh.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailOrPhone,
          mobile: "9876543210",
        }),
      });

      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // Store user in localStorage / cookie
      localStorage.setItem("user", JSON.stringify(data));
      sessionStorage.setItem("user", JSON.stringify(data));

      // Redirect
      window.location.href = "/profilepages";

    } catch (err) {
      console.log(err);
      setError("Something went wrong");
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

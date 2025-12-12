//login with otp

'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { loginUser } from '../api/api';
import { getUserRole } from "../api/api";
import { sendLoginOtp } from '../api/api';

export default function LoginPopup({ onClose, onRegister, login }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');

  const [error, setError] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('login'); // login → otp
  const [emailForOtp, setEmailForOtp] = useState(null);
  const [showUserType, setShowUserType] = useState(false);
  const [userType, setUserType] = useState("");
  // const { login } = useSession();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");

    const isEmail = emailOrPhone.includes("@");
    const isPhone = /^\d{10}$/.test(emailOrPhone);

    // Input validation
    if (!isEmail && !isPhone) {
      setError("Enter a valid email or 10-digit mobile number");
      return;
    }

    // Build payload
    const payload = isEmail
      ? { email: emailOrPhone }
      : { mobile: emailOrPhone };

    try {
      const data = await sendLoginOtp(payload);

      if (!data.success) {
        setError(data.message || "OTP sending failed");
        return;
      }

      setEmailForOtp(data.email);
      setStep("otp");
    } catch (err) {
      console.error("OTP ERROR:", err);
      setError("Server error while sending OTP");
    }
  };

  // STEP 2 — VERIFY OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:3002/api/auth/login-verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailForOtp, otp }),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.message);
        return;
      }
      const user = data.user;

      // Save user
      localStorage.setItem("user", JSON.stringify(user));
      sessionStorage.setItem("user", JSON.stringify(user));

      // Fetch roles
      const allRoles = await getUserRole();
      const matchedRole = allRoles.find(r => r._id === user.user_role);
      const roleName = matchedRole?.name?.toLowerCase() || "candidate";

      // SAVE COOKIE FOR MIDDLEWARE
      document.cookie = `role=${roleName}; path=/; max-age=86400; samesite=lax`;

      // Redirect user
      if (roleName === "employer") {
        window.location.href = "/employer/jobs";
      } else if (["admin", "super admin"].includes(roleName)) {
        window.location.href = "/master/jobs";
      } else {
        window.location.href = "/profilepages";
      }

      onClose();

    } catch (err) {
      setError("Invalid OTP. Try again.");
    }
  };

  const handleUserTypeSelect = (type) => {
    onRegister(type); // passes 'candidate' or 'employer' to page.js
  };

  // --------------------------------------------------------
  // STEP 1 — CHECK USER TYPE BEFORE LOGIN
  // --------------------------------------------------------
  const handleCheckUserType = async (e) => {
    e.preventDefault();
    setError("");

    const input = emailOrPhone.trim();
    const isEmail = input.includes("@");
    const isPhone = /^\d{10}$/.test(input);

    if (!isEmail && !isPhone) {
      setError("Enter valid email or phone");
      return;
    }

    let res = await fetch("http://localhost:3002/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: input })
    });

    let data = await res.json();
    // if (!data.success) {
    //   setError(data.message);
    //   return;
    // }

    const roleId = data.user_role;
    // Fetch all roles to match ID
    const roles = await getUserRole();
    const matchedRole = roles.find(r => r._id === roleId);

    if (!matchedRole) {
      setError("User role not found");
      return;
    }

    const roleName = matchedRole.name.toLowerCase();
    setUserType(roleName);

    // Admin logic
    if (roleName === "admin" || roleName === "super admin") {
      setStep("admin-password");
      return;
    }

    // OTP login for: employer / candidate
    setStep("otp-request");
  };

  const handleAdminPasswordLogin = async (e) => {
    e.preventDefault();
    setError("");

    const input = emailOrPhone.trim();
    const isEmail = input.includes("@");
    const isPhone = /^\d{10}$/.test(input);

    if (!isEmail && !isPhone) {
      setError("Enter valid email or phone");
      return;
    }
	
	//newly add
	let res = await fetch("http://localhost:3002/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: input })
    });

    let data = await res.json();
    localStorage.setItem("user", JSON.stringify(data));
    sessionStorage.setItem("user", JSON.stringify(data));
	  const roleId = data.user_role;
    // Fetch all roles to match ID
    const roles = await getUserRole();
    const matchedRole = roles.find(r => r._id === roleId);

    if (!matchedRole) {
      setError("User role not found");
      return;
    }

    const roleName = matchedRole.name.toLowerCase();
    setUserType(roleName);
	//newly add

    let res1 = await fetch("http://localhost:3002/api/auth/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: emailOrPhone,
        password,
		    roleName
      })
    });

    let data1 = await res1.json();
document.cookie = `role=${roleName}; path=/; max-age=86400; samesite=lax`;
    // if (!data1.success) {
    //   setError(data1.message);
    //   return;
    // }

    // Redirect admin
    window.location.href = "/master/jobs";
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

        {/* <form onSubmit={handleSubmit} className="space-y-4">
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
        </form> */}

        {step === "login" && (
          <form onSubmit={handleCheckUserType} className="space-y-4">
            <input
              type="text"
              value={emailOrPhone}
              placeholder="Enter email or phone"
              onChange={(e) => setEmailOrPhone(e.target.value)}
              className="w-full px-3 py-2 bg-[#CCE9F2] rounded"
              required
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}
<button className="w-full bg-black text-white py-2 rounded">Next</button>
            {/* <button className="w-full py-2 bg-black text-white rounded">Send OTP</button> */}
          </form>
        )}

        {/* STEP 2 — ADMIN PASSWORD FORM */}
        {step === "admin-password" && (
          <form onSubmit={handleAdminPasswordLogin} className="space-y-4">
            <input
              type="password"
              className="w-full p-2 bg-[#CCE9F2] rounded"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button className="w-full bg-black text-white py-2 rounded">Login as Admin</button>
          </form>
        )}

        {/* STEP 2B — SEND OTP */}
        {step === "otp-request" && (
          <div className="space-y-4">
            <button
              onClick={handleSendOtp}
              className="w-full bg-black text-white py-2 rounded"
            >
              Send OTP
            </button>
          </div>
        )}

        {/* OTP INPUT */}
        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <input
              type="text"
              value={otp}
              placeholder="Enter OTP"
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-3 py-2 bg-[#CCE9F2] rounded"
              required
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button className="w-full py-2 bg-black text-white rounded">Verify OTP</button>
          </form>
        )}

        {!showUserType ? (
          <p className="text-sm text-center mt-4">
            Don't have an account?{' '}
            <button onClick={() => setShowUserType(true)} className="text-blue-500 hover:underline">
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

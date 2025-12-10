'use client';

import { useState } from 'react';
import { sendOtp, verifyOtp } from '../api/api';
import { BASE_URL } from "../config/apiConfig";

export default function EmployerRegisterPopup({ onClose, onLogin }) {
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError('');

  //   if (!companyName || !contactName || !email || !phone) {
  //     setError('All fields are required');
  //     return;
  //   }
  //   if (!acceptedTerms) {
  //     setError('You must accept the terms & conditions');
  //     return;
  //   }

  //   try {
  //     const response = await registerEmployer({
  //       firstName: contactName,
  //       lastName: companyName,
  //       email,
  //       mobile: phone,
  //       subscriptionEmail: email,
  //       isSubscribed: false,
  //       user_type: "employer"
  //     });

  //     if (response.success) {
  //       // onLogin();
  //       setOtpSent(true);
  //     } else {
  //       setError('Failed to send OTP');
  //     }

  //   } catch (err) {
  //     setError('Server error while sending OTP');
  //   }
  // };

  const handleSendOtp = async (e) => {
      e.preventDefault();
      setError('');
  
      if (!companyName || !contactName || !email || !phone) {
        setError('All fields are required');
        return;
      }
      if (!acceptedTerms) {
        setError('Please accept terms & conditions.');
        return;
      }
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(phone)) {
        setError('Enter a valid 10-digit phone number');
        return;
      }
      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Enter a valid email address');
        return;
      }
  
      try {
//         const checkRes = await fetch(
//           `https://api.mindssparsh.com/api/users?email=${email}&mobile=${phone}`
//         );

//         const existingUsers = await checkRes.json();
// console.log(existingUsers);
//         if (Array.isArray(existingUsers) && existingUsers.length > 0) {
//           setError('Email or phone number already registered');
//           return;
//         }

        const checkRes = await fetch(
          `${BASE_URL}/api/users/check-unique?email=${email}&mobile=${phone}`
        );
        const { exists } = await checkRes.json();
        if (exists) {
          setError('Email or phone number already registered');
          return;
        }
        
        const res = await sendOtp({ email, phone });
  
        if (res.success) {
          setOtpSent(true);
        } else {
          setError(res.message || 'Failed to send OTP');
        }
      } catch (err) {
        setError('Server error while sending OTP');
        console.error(err);
      }
    };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // const res = await verifyOtp({ name, email, phone: mobile, otp });
      const res = await verifyOtp({
        name: contactName,
        email,
        mobile: phone,
        otp,
        user_type: "employer",
        companyName
      });

      if (res.success) {
        setSuccess("User registered successfully");
        setError("");
        setTimeout(() => {
          // setSuccess("");
          onLogin();
        }, 2000);
        // // onLogin();
        // setSuccess("User registered successfully");

        // // After 2 seconds, redirect to login page
        // setTimeout(() => {
        //   setSuccess(""); // Clear the message
        //   onLogin(); // Call the login function or redirect
        // }, 2000);
      } else {
        setError(res.message || "Invalid OTP");
      }

      // if (res.success) {
      //   onLogin();
      // } else {
      //   setError(res.message || 'Invalid OTP');
      // }
    } catch (err) {
      setError('OTP verification failed');
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/20 z-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-[#E2F4FB] rounded-lg shadow-md">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Register Your Company</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#CCE9F2] hover:bg-gray-300 text-xl"
          >
            &times;
          </button>
        </div>

    {!otpSent ? (
        <form onSubmit={handleSendOtp} className="space-y-6">
          <input
            type="text"
            value={companyName}
            placeholder="Company name"
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full px-3 py-2 bg-[#CCE9F2] rounded-lg"
            required
          />

          <input
            type="text"
            value={contactName}
            placeholder="Contact person name"
            onChange={(e) => setContactName(e.target.value)}
            className="w-full px-3 py-2 bg-[#CCE9F2] rounded-lg"
            required
          />

          <input
            type="email"
            value={email}
            placeholder="Official email address"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 bg-[#CCE9F2] rounded-lg"
            required
          />

          <input
            type="tel"
            value={phone}
            placeholder="Phone number"
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3 py-2 bg-[#CCE9F2] rounded-lg"
            required
          />

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="w-4 h-4"
            />
            <label>I accept the terms & conditions</label>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button className="w-full px-4 py-2 bg-[#CCE9F2] rounded-lg hover:bg-black hover:text-white">
              Send OTP
            </button>
        </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <input
              type="text"
              value={otp}
              placeholder="Enter OTP"
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-3 py-2 border bg-[#CCE9F2] rounded-lg"
              required
            />
            {success && <p className="text-green-500 text-sm">{success}</p>}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button className="w-full px-4 py-2 bg-[#CCE9F2] rounded-lg hover:bg-black hover:text-white">
              Verify OTP
            </button>
          </form>
        )}


        <p className="text-sm text-center">
          Already have an account? <button onClick={onLogin} className="text-blue-500 underline">Login</button>
        </p>
      </div>
    </div>
  );
}

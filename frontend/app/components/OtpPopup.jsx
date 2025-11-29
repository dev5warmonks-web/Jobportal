'use client';

import { useState } from 'react';

export default function OtpPopup({ userData, onClose, onSuccess }) {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const verifyOtp = async () => {
    try {
      const res = await fetch("https://api.mindssparsh.com/api/users/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...userData, otp })
      });

      const data = await res.json();

      if (data.success) {
        onSuccess(); // Registration successful
      } else {
        setError(data.message || "Invalid OTP");
      }

    } catch (err) {
      setError("OTP verification failed");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur bg-black/20 z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">

        <h2 className="text-xl font-bold mb-4">Verify OTP</h2>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full px-3 py-2 bg-gray-100 rounded mb-2"
        />

        {error && <p className="text-red-500">{error}</p>}

        <button
          onClick={verifyOtp}
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          Verify
        </button>

        <button
          onClick={onClose}
          className="mt-3 text-blue-500 underline block w-full"
        >
          Cancel
        </button>

      </div>
    </div>
  );
}

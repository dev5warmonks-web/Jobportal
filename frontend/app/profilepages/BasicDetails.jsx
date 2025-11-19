"use client";
import { useState } from "react";

export default function BasicDetails() {

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    subscriptionEmail: "",
  });
  const [isSubscribed, setIsSubscribed] = useState(false); // track subscription

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.subscriptionEmail) {
      setIsSubscribed(true);
    }
    console.log("Form Submitted:", form);
  };

  return (
    <div className="mx-auto bg-[#E2F4FA] h-screen">

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <div className="flex gap-3">
          {/* First Name */}
          <div className="w-1/2">
            <label className="block font-medium mb-1">Your first name</label>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="w-full border rounded bg-[#CCE9F2] px-3 py-2"
              required
            />
          </div>

          {/* Last Name */}
          <div className="w-1/2">
            <label className="block font-medium mb-1">Your last name</label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="w-full border rounded bg-[#CCE9F2] px-3 py-2"
              required
            />
          </div>
        </div>

        <div className="flex gap-3">
          {/* Email */}
          <div className="w-1/2">
            <label className="block font-medium mb-1">Primary email address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded bg-[#CCE9F2] px-3 py-2"
              required
            />
          </div>

          {/* Contact Number */}
          <div className="w-1/2">
            <label className="block font-medium mb-1">Contact number</label>
            <input
              type="text"
              name="contact"
              value={form.contact}
              onChange={handleChange}
              className="w-full border rounded bg-[#CCE9F2] px-3 py-2"
              required
            />
          </div>
        </div>

        {/* Subscription Email */}
        {/* <div>
          <p className="font-bold">Get job offers straight to your inbox</p>
          <p>Subscribe to our newsletter and be the first to receive exclusive tech job offers and updates. Stay ahead in your career search!</p>
          <label className="block font-medium mb-1 mt-1.5">
            Enter your email to subscribe
          </label>
          <input
            type="email"
            name="subscriptionEmail"
            value={form.subscriptionEmail}
            onChange={handleChange}
            className="w-full border rounded bg-[#CCE9F2] px-3 py-2"
          />
        </div> */}

        {/* Subscription Section */}
        <div>
          {!isSubscribed ? (
            <>
              <p className="font-bold">Get job offers straight to your inbox</p>
              <p>Subscribe to our newsletter and be the first to receive exclusive tech job offers and updates. Stay ahead in your career search!</p>
              <label className="block font-medium mb-1 mt-1.5">
                Enter your email to subscribe
              </label>
              <input
                type="email"
                name="subscriptionEmail"
                value={form.subscriptionEmail}
                onChange={handleChange}
                className="w-full border rounded bg-[#CCE9F2] px-3 py-2"
              />
            </>
          ) : (
            <div className="bg-green-100 p-4 rounded-md text-green-800">
              <p className="font-bold">You're subscribed!</p>
              <p>
                Thank you for subscribing! You'll now receive the latest job offers, career tips, and updates straight to your inbox. Stay tuned for exciting opportunities!
              </p>
              <button
                type="button"
                className="mt-2 text-sm text-blue-600 underline"
                onClick={() => {
                  setIsSubscribed(false);
                  setForm({ ...form, subscriptionEmail: "" });
                }}
              >
                Unsubscribe
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="bg-black text-white px-5 py-2 rounded-full"
        >
          Save changes
        </button>
      </form>
    </div>
  );
}

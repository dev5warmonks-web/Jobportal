"use client";

import { useState } from "react";
import Sidebar from "../components/sidebar/page";
import Topbar from "../components/topbar/page";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex flex-col">
      {/* Top bar */}
      <Topbar />

      {/* Sidebar + main content */}
      <div className="flex">
        <Sidebar />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}

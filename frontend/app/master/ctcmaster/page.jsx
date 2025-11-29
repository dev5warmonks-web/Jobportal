"use client";

import { useState, useEffect } from "react";
import ExpectedCTCForm from "./ExpectedCTCForm";
import ExpectedCTCList from "./ExpectedCTCList";

export default function ExpectedCTCPage() {
  const [ctcs, setCtcs] = useState([]);
  const [editItem, setEditItem] = useState(null);

  const loadCTCs = async () => {
    const res = await fetch(`https://api.mindssparsh.com/api/expected-ctc`);
    const data = await res.json();
    setCtcs(data);
  };

  useEffect(() => {
    loadCTCs();
  }, []);

  return (
    <div className="p-8 bg-[#E2F4FA] min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Expected CTC Master</h1>

      <ExpectedCTCForm editItem={editItem} setEditItem={setEditItem} reload={loadCTCs} />
      <ExpectedCTCList ctcs={ctcs} setEditItem={setEditItem} reload={loadCTCs} />
    </div>
  );
}

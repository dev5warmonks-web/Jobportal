"use client";
import React from "react";
import { useState, useEffect } from "react";
import { BASE_URL } from "../config/apiConfig";


import Link from "next/link";

export default function TagsSlider() {
    const [categories, setCategories] = useState([]);
    const [editItem, setEditItem] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Fetch categories from backend
    const loadCategories = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`${BASE_URL}/api/job-categories`);
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Failed to load categories");
            }
            const data = await res.json();
            setCategories(data);
        } catch (err) {
            //   console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    return (
        <div className="w-full overflow-hidden py-6 space-y-4">

            <div className="marquee">
                <div className="marquee-content">
                    {categories.map((cat) => (
                        <Link key={cat._id} href={`/filter?category=${encodeURIComponent(cat.jobCategory)}`}>
                            <span
                                className="px-4 py-2 mx-2 bg-white border border-gray-300 rounded-md bg-[linear-gradient(to_bottom_right,_#EFF2F3_0%,_#EAFAFF_40%,_white_100%)] cursor-pointer hover:shadow-md transition-shadow inline-block"
                            >
                                {cat.jobCategory}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
            <div className="marquee">
                <div className="marquee-content reverse">
                    {categories.map((cat) => (
                        <Link key={cat._id} href={`/filter?category=${encodeURIComponent(cat.jobCategory)}`}>
                            <span
                                className="px-4 py-2 mx-2 bg-white border border-gray-300 rounded-md bg-[linear-gradient(to_bottom_right,_#EFF2F3_0%,_#EAFAFF_40%,_white_100%)] cursor-pointer hover:shadow-md transition-shadow inline-block"
                            >
                                {cat.jobCategory}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="marquee">
                <div className="marquee-content">
                    {categories.map((cat) => (
                        <Link key={cat._id} href={`/filter?category=${encodeURIComponent(cat.jobCategory)}`}>
                            <span
                                className="px-4 py-2 mx-2 bg-white border border-gray-300 rounded-md bg-[linear-gradient(to_bottom_right,_#EFF2F3_0%,_#EAFAFF_40%,_white_100%)] cursor-pointer hover:shadow-md transition-shadow inline-block"
                            >
                                {cat.jobCategory}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

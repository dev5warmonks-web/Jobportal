"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {

    const [user, setUser] = useState(null);   // ⬅ store full user object

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (!storedUser || storedUser === "undefined") return;

        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);     // ⬅ store whole object, not only email
    }, []);

    return (
        <div>
            <h1>Dashboard</h1>

            {user ? (
                <div>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Mobile:</strong> {user.mobile}</p>
                    {user.name && <p><strong>Name:</strong> {user.name}</p>}
                    {user.role && <p><strong>Role:</strong> {user.role}</p>}
                </div>
            ) : (
                <p>No user found</p>
            )}
        </div>
    );
}

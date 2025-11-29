'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

export default function EmployerProfilePage() {
  const { data: session } = useSession();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (session) {
      fetch(`http://localhost:5000/api/users/${session.user.id}`)
        .then(res => res.json())
        .then(data => setUser(data));
    }
  }, [session]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Employer Profile</h1>
      <p>Name: {user.firstName} {user.lastName}</p>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>
    </div>
  );
}
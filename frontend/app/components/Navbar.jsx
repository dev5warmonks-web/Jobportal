'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import LoginPopup from './LoginPopup';
import RegisterPopup from './RegisterPopup';
import EmployerRegisterPopup from './EmployerRegisterPopup';

export default function Navbar() {
  // const { token, user, logout } = useSession();
  const { data: session } = useSession();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [userType, setUserType] = useState(null);
  const openLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  const openRegister = (type) => {
    setUserType(type); // store selected user type
    setShowLogin(false);
    setShowRegister(true);
  };

  const closePopups = () => {
    setShowLogin(false);
    setShowRegister(false);
    setUserType(null);
  };

  return (
    <>
      <nav className="w-full border-b border-gray-200 antialiased">
        <div className="mx-auto p-[10px] md:p-[50px] py-4 flex items-center justify-between">

          <div className="text-2xl font-semibold tracking-tight">
            <span className="text-black">nexttecdddhie.</span>
          </div>


          {session?.user ? (
            <div className="flex items-center gap-4">
              <p>{session.user.name}</p>
              <Link href={
                session.user.role === "employer"
                  ? "/employer/jobs"
                  : session.user.role === "admin" || session.user.role === "super admin"
                    ? "/master/jobs"
                    : "/profilepages"
              }>
                <p className="px-4 py-2 text-white bg-blue-500 rounded-md">Dashboard</p>
              </Link>
              <button onClick={() => signOut({ callbackUrl: "/" })}
                className="px-4 py-2 text-white bg-red-500 rounded-md">
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center md:space-x-4">
              <a href="#" onClick={openLogin} className="text-gray-600 hover:text-black font-medium text-[12px] md:text-[18px] leading-[20px] md:leading-[26px]">
                Sign in / Register
              </a>

              <button className="px-[5px] py-[3px] md:px-4 md:py-2 bg-black text-white text-[12px] md:text-[18px] leading-[20px] md:leading-[26px] rounded-full hover:bg-gray-800 transition">
                Post a job
              </button>
            </div>
          )}

        </div>
      </nav>
      {/* <nav className="flex items-center justify-between p-4 bg-white shadow-md">
        <div className="flex items-center">
          <Link href="/">
            <p className="text-2xl font-bold">Job Board</p>
          </Link>
        </div>
        <div>
          {token && user ? (
            <div className="flex items-center gap-4">
              <p>Welcome, {user.name}!</p>
              <Link href="/profile">
                <p className="px-4 py-2 text-white bg-blue-500 rounded-md">Profile</p>
              </Link>
              <button onClick={logout} className="px-4 py-2 text-white bg-red-500 rounded-md">
                Sign Out
              </button>
            </div>
          ) : (
            <button onClick={openLogin} className="px-4 py-2 text-white bg-blue-500 rounded-md">
              Sign In
            </button>
          )}
        </div>
      </nav> */}

      {showLogin && <LoginPopup onClose={closePopups} onRegister={openRegister} />}
      {showRegister && userType === 'candidate' && <RegisterPopup onClose={closePopups} onLogin={openLogin} />}
      {showRegister && userType === 'employer' && <EmployerRegisterPopup onClose={closePopups} onLogin={openLogin} />}
    </>
  );
}

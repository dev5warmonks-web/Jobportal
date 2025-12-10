import { BASE_URL } from "../config/apiConfig";
const API_URL = `${BASE_URL}/api/jobs`;
const API_USERS_URL = `${BASE_URL}/api/users`;      // for users
const API_AUTH_URL = `${BASE_URL}/api/auth`;        // unused currently
// const API_USERROLE_URL = "https://api.mindssparsh.com/api/user-roles";
const API_USERROLE_URL = `${BASE_URL}/api/user-roles`;

// ========================================
// JOBS API
// ========================================

export const getJobs = async () => await fetch(API_URL).then(res => res.json());

export const getJob = async (id) =>
  await fetch(`${API_URL}/${id}`).then(res => res.json());

export const getJobsByUser = async (userId) => {
  const jobs = await getJobs();     // fetch all jobs
  return jobs.filter(job => job.userid === userId);
};


export const addJob = async (job) => {
  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(job)
  });
};

export const updateJob = async (id, job) => {
  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(job)
  });
};

export const deleteJob = async (id) => {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
};

// ========================================
// LOGIN
// ========================================

export const loginUser = async (credentials) => {
  const res = await fetch("https://api.mindssparsh.com/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials)
  });
  return res.json();
};

// ========================================
// REGISTER USER (Admin/Manual direct creation)
// ========================================

export async function registerUser(data) {
  try {
    const res = await fetch(`${API_USERS_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

// ========================================
// GET USER
// ========================================

export const getUser = async (email) => {
  const res = await fetch(`${API_USERS_URL}/?email=${email}`);
  return res.json();
};

// ========================================
// UPDATE USER
// ========================================

export const updateUser = async (id, userData) => {
  const res = await fetch(`${API_USERS_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData)
  });
  return res.json();
};

// ========================================
// OTP SYSTEM FOR CANDIDATES
// ========================================

// SEND OTP
export async function sendOtp(data) {
  console.log(data);
  const res = await fetch('https://api.mindssparsh.com/api/users/send-otp', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
}


// VERIFY OTP (creates candidate user automatically)
export async function verifyOtp(data) {
  const res = await fetch(`${API_USERS_URL}/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
}

// ========================================
// EMPLOYER REGISTRATION (uses same Users model)
// ========================================

export async function registerEmployer(data) {
  console.log(data);
  const res = await fetch(`${API_USERS_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
}

// ========================================
// Get User Roles 
// ========================================

export const getUserRole = async () => {
  const res = await fetch(`${API_USERROLE_URL}`);
  if (!res.ok) throw new Error("Failed to fetch user roles");
  return res.json(); // returns array of roles
};

export async function sendLoginOtp(payload) {
  console.log("Login OTP Payload:", payload);

  const res = await fetch("http://localhost:3002/api/auth/login-send-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  return res.json();
}


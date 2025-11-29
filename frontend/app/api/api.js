const API_URL = "https://api.mindssparsh.com/api/jobs";
const API_USERS_URL = "https://api.mindssparsh.com/api/users";      // for users
const API_AUTH_URL = "https://api.mindssparsh.com/api/auth";        // unused currently

// ========================================
// JOBS API
// ========================================

export const getJobs = async () => await fetch(API_URL).then(res => res.json());

export const getJob = async (id) =>
  await fetch(`${API_URL}/${id}`).then(res => res.json());

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

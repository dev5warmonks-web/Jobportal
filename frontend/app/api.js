"use client";

const API_URL = "http://localhost:5000/api/jobs";

export const getJobs = async () => await fetch(API_URL).then(res => res.json());
export const getJob = async (id) => await fetch(`${API_URL}/${id}`).then(res => res.json());

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
  alert('df');
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
};

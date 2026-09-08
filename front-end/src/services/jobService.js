const API_URL = "http://localhost:3000/api/jobs";


// GET - Get all jobs
export const getJobs = async () => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch jobs");
  }

  return response.json();
};


// POST - Create a new job
export const createJob = async (jobData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(jobData)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create job");
  }

  return data;
};


// PATCH - Update a job
export const updateJob = async (id, jobData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(jobData)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update job");
  }

  return data;
};


// DELETE - Delete a job
export const deleteJob = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });

  if (!response.ok) {
    throw new Error("Failed to delete job");
  }
};
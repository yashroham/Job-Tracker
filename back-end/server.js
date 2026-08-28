const express = require("express");

const app = express();

const PORT = 3000;

app.use(express.json());

let jobs = [];

// Home route
app.get("/", (req, res) => {
    res.send("Job Tracker API is running!");
});

// Add a new job
app.post("/api/jobs", (req, res) => {
    const newJob = {
        id: jobs.length + 1,
        ...req.body
    };

    jobs.push(newJob);

    res.status(201).json(newJob);
});

// Get all jobs
app.get("/api/jobs", (req, res) => {
    res.json(jobs);
});

// Get one job by ID
app.get("/api/jobs/:id", (req, res) => {
    const job = jobs.find((job) => job.id === Number(req.params.id));

    res.json(job);
});

app.delete("/api/jobs/:id", (req, res) => {
    const id = Number(req.params.id);

    const job = jobs.find((job) => job.id === id);

    if (!job) {
        return res.status(404).send("Job not found");
    }

    jobs = jobs.filter((job) => job.id !== id);

    res.send("Job deleted successfully");
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
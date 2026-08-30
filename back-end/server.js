const express = require("express");

const app = express();

const PORT = 3000;

app.use(express.json());

let jobs = [];
let nextId = 1;
const allowedStatuses = [
    "Applied",
    "Interview",
    "Rejected",
    "Offer",
    "Accepted"
];

// Home route
app.get("/", (req, res) => {
    res.send("Job Tracker API is running!");
});

// Add a new job
app.post("/api/jobs", (req, res) => {
    const { company, role, status } = req.body;

    if (!company || !role || !status) {
        return res.status(400).json({
            message: "Company, role, and status are required"
        });
    }

    const newJob = {
        id: nextId++,
        company,
        role,
        status
    };

    jobs.push(newJob);

    res.status(201).json(newJob);
});

// Get all jobs
app.get("/api/jobs", (req, res) => {
    res.json(jobs);
});

// Get a single job by ID
app.get("/api/jobs/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const job = jobs.find(job => job.id === id);

    if (!job) {
        return res.status(404).json({
            message: "Job not found"
        });
    }

    res.json(job);
});

app.put("/api/jobs/:id", (req, res) => {
    const id = Number(req.params.id);

    const job = jobs.find((job) => job.id === id);

    if (!job) {
        return res.status(404).json({ message: "Job not found" });
    }

    job.status = req.body.status;

    res.json(job);
});

// Partially update a job
app.patch("/api/jobs/:id", (req, res) => {
    const id = Number(req.params.id);

    const job = jobs.find((job) => job.id === id);

    if (!job) {
        return res.status(404).json({ message: "Job not found" });
    }

    if (req.body.status && !allowedStatuses.includes(req.body.status)) {
        return res.status(400).json({
            message: "Invalid job status"
        });
    }

    Object.assign(job, req.body);

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
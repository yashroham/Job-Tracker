const express = require("express");
const cors = require("cors");
const pool = require("./db");
const app = express();

const PORT = 3000;
app.use(cors());
app.use(express.json());

const allowedStatuses = [
    "Applied",
    "Interview",
    "Rejected",
    "Offer",
    "Accepted",
    "Selected"
];

// Home route
app.get("/", (req, res) => {
    res.send("Job Tracker API is running!");
});

// Add a new job
app.post("/api/jobs", async (req, res) => {
    const { company, role, status } = req.body;

    if (!company || !role || !status) {
        return res.status(400).json({
            message: "Company, role, and status are required"
        });
    }

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
            message: "Invalid job status"
        });
    }

    try {
        const result = await pool.query(
            `INSERT INTO jobs (company, role, status)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [company, role, status]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Database error"
        });
    }
});

// Get all jobs
app.get("/api/jobs", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM jobs");
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database error" });
    }
});

// Get a single job by ID
app.get("/api/jobs/:id", async (req, res) => {
    const id = Number(req.params.id);

    try {
        const result = await pool.query(
            "SELECT * FROM jobs WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Database error"
        });
    }
});

app.put("/api/jobs/:id", async (req, res) => {
    const id = Number(req.params.id);
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({
            message: "Status is required"
        });
    }

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
            message: "Invalid job status"
        });
    }

    try {
        const result = await pool.query(
            `UPDATE jobs
             SET status = $1
             WHERE id = $2
             RETURNING *`,
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Database error"
        });
    }
});
// Partially update a job
app.patch("/api/jobs/:id", async (req, res) => {
    const id = Number(req.params.id);
    const { company, role, status } = req.body;

    if (status && !allowedStatuses.includes(status)) {
        return res.status(400).json({
            message: "Invalid job status"
        });
    }

    try {
        const result = await pool.query(
            `UPDATE jobs
             SET
                company = COALESCE($1, company),
                role = COALESCE($2, role),
                status = COALESCE($3, status)
             WHERE id = $4
             RETURNING *`,
            [company, role, status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Database error"
        });
    }
});

app.delete("/api/jobs/:id", async (req, res) => {
    const id = Number(req.params.id);

    try {
        const result = await pool.query(
            "DELETE FROM jobs WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        res.json({
            message: "Job deleted successfully",
            job: result.rows[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Database error"
        });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
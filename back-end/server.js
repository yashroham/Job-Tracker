const express = require("express");
const cors = require("cors");

const jobRoutes = require("./routes/jobRoutes");

const app = express();

const PORT = 3000;

app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.send("Job Tracker API is running!");
});

// Job routes
app.use("/api/jobs", jobRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
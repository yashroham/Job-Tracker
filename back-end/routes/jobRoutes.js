const express = require("express");

const {
    addJob,
    getJobs,
    getJobById,
    updateJob,
    patchJob,
    deleteJob
} = require("../controllers/jobController");

const router = express.Router();

router.post("/", addJob);

router.get("/", getJobs);

router.get("/:id", getJobById);

router.put("/:id", updateJob);

router.patch("/:id", patchJob);

router.delete("/:id", deleteJob);

module.exports = router;
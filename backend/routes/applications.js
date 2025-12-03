const express = require("express");
const Application = require("../models/Application");
const router = express.Router();

// CREATE - Submit new job application
router.post("/", async (req, res) => {
    try {
        const { userId, jobId, coverLetter } = req.body;

        if (!userId || !jobId) {
            return res.status(400).json({ message: "userId and jobId are required" });
        }

        // Check if user already applied to this job
        const existingApplication = await Application.findOne({ userId, jobId });
        if (existingApplication) {
            return res.status(400).json({ message: "You have already applied to this job" });
        }

        const application = await Application.create({
            userId,
            jobId,
            coverLetter,
            status: 'pending'
        });

        // Populate job details in response
        const populatedApplication = await Application.findById(application._id)
            .populate('jobId')
            .populate('userId', 'firstName lastName email');

        res.status(201).json(populatedApplication);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// GET - Fetch ALL applications (for admin/employer dashboard)
router.get("/", async (req, res) => {
    try {
        const applications = await Application.find()
            .populate('jobId')
            .populate('userId', 'firstName lastName email mobile')
            .sort({ appliedAt: -1 }); // Most recent first

        res.json(applications);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// GET - Fetch all applications for a specific user
router.get("/user/:userId", async (req, res) => {
    try {
        const applications = await Application.find({ userId: req.params.userId })
            .populate('jobId')
            .sort({ appliedAt: -1 }); // Most recent first

        res.json(applications);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// GET - Fetch all applications for a specific job (employer view)
router.get("/job/:jobId", async (req, res) => {
    try {
        const applications = await Application.find({ jobId: req.params.jobId })
            .populate('userId', 'firstName lastName email mobile')
            .sort({ appliedAt: -1 });

        res.json(applications);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// GET - Fetch single application by ID
router.get("/:id", async (req, res) => {
    try {
        const application = await Application.findById(req.params.id)
            .populate('jobId')
            .populate('userId', 'firstName lastName email mobile');

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        res.json(application);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// PUT - Update application status
router.put("/:id", async (req, res) => {
    try {
        const { status, coverLetter } = req.body;

        const updateData = {};
        if (status) updateData.status = status;
        if (coverLetter !== undefined) updateData.coverLetter = coverLetter;

        const application = await Application.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        )
            .populate('jobId')
            .populate('userId', 'firstName lastName email');

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        res.json(application);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// DELETE - Withdraw application
router.delete("/:id", async (req, res) => {
    try {
        const application = await Application.findByIdAndDelete(req.params.id);

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        res.json({ message: "Application withdrawn successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

module.exports = router;

const express = require("express");
const JobLocation = require("../models/JobLocation");
const router = express.Router();

// CREATE job location
router.post("/", async (req, res) => {
  try {
    const { location } = req.body;

    const existingLocation = await JobLocation.findOne({
      location: { $regex: `^${location}$`, $options: "i" }
    });

    if (existingLocation) {
      return res.status(400).json({ error: "Location already exists" });
    }

    const newLocation = await JobLocation.create({ location });

    res.status(201).json(newLocation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ all job location
router.get("/", async (req, res) => {
  try {
    const jobLocations = await JobLocation.find({}).lean(); // <— fetch everything, faster
    res.json(jobLocations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// READ single job location
router.get("/:id", async (req, res) => {
  try {
    const jobLocation = await JobLocation.findById(req.params.id);
    if (!jobLocation)
      return res.status(404).json({ error: "Job location not found" });

    res.json(jobLocation);
  } catch (err) {
    res.status(400).json({ error: "Invalid ID" });
  }
});

// UPDATE job location
router.put("/:id", async (req, res) => {
  try {
    const jobLocation = await JobLocation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!jobLocation)
      return res.status(404).json({ error: "Job location not found" });

    res.json(jobLocation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE job location
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await JobLocation.findByIdAndDelete(req.params.id);

    if (!deleted)
      return res.status(404).json({ error: "Job location not found" });

    res.json({ message: "Job location deleted" });
  } catch (err) {
    res.status(400).json({ error: "Invalid ID" });
  }
});

module.exports = router;

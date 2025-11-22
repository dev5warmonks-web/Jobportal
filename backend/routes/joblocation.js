const express = require("express");
const JobCategory = require("../models/JobCategory");
const router = express.Router();

// CREATE job category
router.post("/", async (req, res) => {
  try {
    const jobCategory = await JobCategory.create(req.body);
    res.status(201).json(jobCategory);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ all job categories
router.get("/", async (req, res) => {
  try {
    const jobCategories = await JobCategory.find();
    res.json(jobCategories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ single job category
router.get("/:id", async (req, res) => {
  try {
    const jobCategory = await JobCategory.findById(req.params.id);
    if (!jobCategory)
      return res.status(404).json({ error: "Job category not found" });

    res.json(jobCategory);
  } catch (err) {
    res.status(400).json({ error: "Invalid ID" });
  }
});

// UPDATE job category
router.put("/:id", async (req, res) => {
  try {
    const jobCategory = await JobCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!jobCategory)
      return res.status(404).json({ error: "Job category not found" });

    res.json(jobCategory);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE job category
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await JobCategory.findByIdAndDelete(req.params.id);

    if (!deleted)
      return res.status(404).json({ error: "Job category not found" });

    res.json({ message: "Job category deleted" });
  } catch (err) {
    res.status(400).json({ error: "Invalid ID" });
  }
});

module.exports = router;

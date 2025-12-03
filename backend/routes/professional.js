const express = require("express");
const Professional = require("../models/Professional");
const router = express.Router();

// CREATE professional details
router.post("/", async (req, res) => {
  try {
    const { userId, experienceLevel, highestEducation, currentCompany, preferredIndustry, preferredJobType, keySkills } = req.body;

    // Check if professional details already exist for this user
    const existing = await Professional.findOne({ userId });
    if (existing) {
      return res.status(400).json({ message: "Professional details already exist. Use PUT to update." });
    }

    const professional = await Professional.create({
      userId,
      experienceLevel,
      highestEducation,
      currentCompany,
      preferredIndustry,
      preferredJobType,
      keySkills
    });

    res.status(201).json(professional);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET professional details by user ID
router.get("/user/:userId", async (req, res) => {
  try {
    const professional = await Professional.findOne({ userId: req.params.userId });

    if (!professional) {
      return res.status(404).json({ message: "Professional details not found" });
    }

    res.json(professional);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET professional details by ID
router.get("/:id", async (req, res) => {
  try {
    const professional = await Professional.findById(req.params.id);

    if (!professional) {
      return res.status(404).json({ message: "Professional details not found" });
    }

    res.json(professional);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// UPDATE professional details
router.put("/:id", async (req, res) => {
  try {
    const { experienceLevel, highestEducation, currentCompany, preferredIndustry, preferredJobType, keySkills } = req.body;

    const professional = await Professional.findByIdAndUpdate(
      req.params.id,
      {
        experienceLevel,
        highestEducation,
        currentCompany,
        preferredIndustry,
        preferredJobType,
        keySkills
      },
      { new: true }
    );

    if (!professional) {
      return res.status(404).json({ message: "Professional details not found" });
    }

    res.json(professional);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// DELETE professional details
router.delete("/:id", async (req, res) => {
  try {
    const professional = await Professional.findByIdAndDelete(req.params.id);

    if (!professional) {
      return res.status(404).json({ message: "Professional details not found" });
    }

    res.json({ message: "Professional details deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
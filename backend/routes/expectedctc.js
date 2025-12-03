const express = require("express");
const ExpectedCTC = require("../models/ExpectedCTC");
const router = express.Router();

// CREATE expected ctc
router.post("/", async (req, res) => { 
  try {
    const expectedCTC = await ExpectedCTC.create(req.body);
    res.status(201).json(expectedCTC);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ all expected ctc
router.get("/", async (req, res) => {
  try {
    const expectedCTCs = await ExpectedCTC.find();
    res.json(expectedCTCs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ single expected ctc
router.get("/:id", async (req, res) => {
  try {
    const expectedCTC = await ExpectedCTC.findById(req.params.id);
    if (!expectedCTC)
      return res.status(404).json({ error: "Expected CTC not found" });

    res.json(expectedCTC);
  } catch (err) {
    res.status(400).json({ error: "Invalid ID" });
  }
});

// UPDATE expected ctc
router.put("/:id", async (req, res) => {
  try {
    const expectedCTC = await ExpectedCTC.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!expectedCTC)
      return res.status(404).json({ error: "Expected CTC not found" });

    res.json(expectedCTC);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE expected ctc
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await ExpectedCTC.findByIdAndDelete(req.params.id);

    if (!deleted)
      return res.status(404).json({ error: "Expected CTC not found" });

    res.json({ message: "Expected CTC deleted" });
  } catch (err) {
    res.status(400).json({ error: "Invalid ID" });
  }
});

module.exports = router;

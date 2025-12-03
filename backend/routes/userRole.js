const express = require("express");
const router = express.Router();
const UserRole = require("../models/UserRole");

// Get all user roles
router.get("/", async (req, res) => {
  try {
    const userRoles = await UserRole.find();
    res.json(userRoles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new user role
router.post("/", async (req, res) => {
  const userRole = new UserRole({
    name: req.body.name
  });

  try {
    const newUserRole = await userRole.save();
    res.status(201).json(newUserRole);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
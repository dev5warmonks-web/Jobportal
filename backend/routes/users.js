const express = require("express");
const Users = require("../models/Users");
const router = express.Router();

// ========================================
// SPECIFIC ROUTES (must come first!)
// ========================================

// LOGIN user - MUST be before /:id route
router.post("/login", async (req, res) => {
  try {
    const { email, mobile } = req.body;

    console.log('🔍 Login attempt:', { email, mobile });

    // Build search criteria - handle both email and mobile
    const searchCriteria = [];

    if (email) {
      // Case-insensitive email search
      searchCriteria.push({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
    }

    if (mobile && mobile !== email) {
      // Only add mobile search if it's different from email
      searchCriteria.push({ contact: mobile });
    }

    console.log('🔎 Search criteria:', JSON.stringify(searchCriteria, null, 2));

    // Find user by email OR mobile
    const user = await Users.findOne({
      $or: searchCriteria.length > 0 ? searchCriteria : [{ email: email }]
    });

    if (!user) {
      console.log('❌ User not found with criteria:', searchCriteria);

      // Debug: Check if any users exist
      const totalUsers = await Users.countDocuments();
      console.log(`📊 Total users in database: ${totalUsers}`);

      // Debug: Try to find user with exact email (case-sensitive)
      const exactUser = await Users.findOne({ email: email });
      console.log('🔍 Exact match (case-sensitive):', exactUser ? 'Found' : 'Not found');

      return res.status(404).json({
        message: "User not found. Please register first."
      });
    }

    console.log('✅ User found:', user.email, '| Role:', user.role);

    // Return user data
    res.json({
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role || 'candidate',
        contact: user.contact
      },
      token: "temp-token-" + user._id // Temporary token, implement JWT later
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

// ========================================
// GENERIC ROUTES (must come after specific routes!)
// ========================================

// CREATE user
router.post("/", async (req, res) => {
  const users = await Users.create(req.body);
  res.json(users);
});

// READ all users
router.get("/", async (req, res) => {
  const users = await Users.find();
  res.json(users);
});

// READ single user - MUST come after /login
router.get("/:id", async (req, res) => {
  const users = await Users.findById(req.params.id);
  res.json(users);
});

// UPDATE user
router.put("/:id", async (req, res) => {
  const users = await Users.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(users);
});

// DELETE user
router.delete("/:id", async (req, res) => {
  await Users.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
});

module.exports = router;
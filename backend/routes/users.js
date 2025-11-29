
const express = require("express");
const Users = require("../models/Users");
const router = express.Router();

// CREATE user
router.post("/", async (req, res) => {
  const users = await Users.create(req.body);
  res.json(users);
});

// LOGIN user
router.post("/login", async (req, res) => {
  try {
    const { email, mobile } = req.body;

    console.log('Login attempt:', { email, mobile });

    // Find user by email OR mobile
    const user = await Users.findOne({
      $or: [
        { email: email },
        { contact: mobile }
      ]
    });

    if (!user) {
      console.log('User not found');
      return res.status(404).json({
        message: "User not found. Please register first."
      });
    }

    console.log('User found:', user.email);

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
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

// READ all users
router.get("/", async (req, res) => {
  const users = await Users.find();
  res.json(users);
});

// READ single user
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
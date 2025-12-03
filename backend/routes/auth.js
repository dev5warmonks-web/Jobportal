const express = require("express");
const router = express.Router();
// const bcrypt = require("bcryptjs");
const Users = require("../models/Users");
const UserRole = require("../models/UserRole");

router.post("/login", async (req, res) => {
  // const { email, password } = req.body;
  const { email, mobile } = req.body;

  try {
    const user = await Users.findOne({ email }).populate('user_role');
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) {
    if (user.mobile !== mobile) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const userResponse = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobile: user.mobile,
        subscriptionEmail: user.subscription_email,
        isSubscribed: user.isSubscribed,
        role: user.user_role.name
    };

    res.json({ user: userResponse });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/register", async (req, res) => {
  // const { firstName, lastName, username, email, password, user_type } = req.body;
  const { firstName, lastName, username, email, mobile, user_type } = req.body;

  try {
    let user = await Users.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const userRole = await UserRole.findOne({ name: user_type });
    if (!userRole) {
        return res.status(400).json({ message: "Invalid user role" });
    }

    user = new Users({
      firstName,
      lastName,
      username,
      email,
      // password,
      mobile,
      user_role: userRole._id
    });

    // const salt = await bcrypt.genSalt(10);
    // user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
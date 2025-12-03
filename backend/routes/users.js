const express = require("express");
const router = express.Router();
const Users = require("../models/Users");
const UserRole = require("../models/UserRole");
const Professional = require("../models/Professional");
const nodemailer = require('nodemailer');
const { sendEmail } = require('../utils/email');
const OTPStore = {}; // simple in-memory OTP store, consider Redis for production
const jwt = require('jsonwebtoken');
const multer = require("multer");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// SEND OTP
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  console.log("send-otp called with:", { email });

  try {
    const otp = Math.floor(100000 + Math.random() * 900000);
    OTPStore[email] = { otp };
    console.log("Generated OTP:", otp);

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return res.status(500).json({ success: false, message: "Email service not configured" });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Actually send the email
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is: ${otp}`,
    });

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error("Error sending OTP:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});




// VERIFY OTP and REGISTER USER
router.post("/verify-otp", async (req, res) => {
  // const { name, email, phone, otp } = req.body;
  const { name, email, mobile, otp, user_type, companyName } = req.body;

  try {
    if (!OTPStore[email] || OTPStore[email].otp != otp) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    // let role = await UserRole.findOne({ name: /candidate/i });
    let role = await UserRole.findOne({ name: new RegExp(`^${user_type}$`, "i") });
    // if (!role) {
    //   role = await UserRole.findById("60d21b4667d0d8992e610c85"); // fallback id
    // }
    if (!role) {
      return res.status(500).json({ success: false, message: "Invalid user role" });
    }

    const newUser = new Users({
      firstName: name,
      lastName: user_type === "employer" ? companyName : "",
      username: email,
      email,
      mobile: mobile,
      companyName: user_type === "employer" ? companyName : "",
      subscription_email: email,
      isSubscribed: false,
      user_role: role._id
    });

    const saved = await newUser.save();
    delete OTPStore[email]; // clear OTP

    res.json({ success: true, message: `${user_type} User registered successfully`, user: saved });
  } catch (err) {
    console.error("verify-otp error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

//Login
router.post("/login", async (req, res) => {
  const { email, mobile } = req.body;

  try {
    if (!email && !mobile) {
      return res.status(400).json({ message: "Email or mobile number is required" });
    }

    // Create OR query array for email/mobile
    const orQuery = [];
    if (email) orQuery.push({ email });
    if (mobile) orQuery.push({ mobile });

    const user = await Users.findOne({ $or: orQuery }).populate("user_role");

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const userResponse = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobile: user.mobile,
      companyName: user.companyName,
      logo: user.logo,
      isFeatured: user.isFeatured,
      subscriptionEmail: user.subscription_email,
      isSubscribed: user.isSubscribed,
      role: user.user_role.name,
    };

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.user_role.name },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ user: userResponse, token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// REGISTER (without OTP)
router.post("/register", async (req, res) => {
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
      mobile,
      user_role: userRole._id
    });

    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// GET all users or filter by role
router.get("/", async (req, res) => {
  try {
    const { user_role } = req.query; // e.g., "employer"

    let filter = {};
    let roleDoc = null;
    if (user_role) {
      // Find the role document first
      roleDoc = await UserRole.findOne({ name: new RegExp(`^${user_role}$`, "i") });
      if (!roleDoc) {
        return res.status(404).json({ message: `Role '${user_role}' not found` });
      }
      filter.user_role = roleDoc._id;
    }

    const users = await Users.find(filter).populate("user_role");

    let result = [];
    // const result = users.map((user) => ({
      for (let user of users) {
      let userObj = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobile: user.mobile,
      companyName: user.companyName,
      logo: user.logo,
      isFeatured: user.isFeatured,
      subscriptionEmail: user.subscription_email,
      isSubscribed: user.isSubscribed,
      role: user.user_role.name, // populated role name
    // }));
    };
    // Fetch skills ONLY for candidates
      if (user_role?.toLowerCase() === "candidate") {
        const professional = await Professional.findOne({ userId: user._id });
        userObj.skills = professional?.keySkills || [];
      }
      result.push(userObj);
    }

    res.json(result);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET USER BY ID
router.get("/:id", async (req, res) => {
  try {
    const user = await Users.findById(req.params.id).populate("user_role");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userResponse = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobile: user.mobile,
      subscription_email: user.subscription_email,
      isSubscribed: user.isSubscribed,
      companyName: user.companyName,
      logo: user.logo,
      isFeatured: user.isFeatured,
      role: user.user_role.name,
    };

    res.json(userResponse);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE USER BY ID (Employer Edit)
// router.put("/:id", async (req, res) => {
router.put("/:id", upload.single("logo"), async (req, res) => {
  try {
    const user = await Users.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    user.mobile = req.body.mobile || user.mobile;
    user.companyName = req.body.companyName || user.companyName;
    // user.isFeatured = req.body.isFeatured ?? user.isFeatured;
    user.isFeatured = req.body.isFeatured === "true" || req.body.isFeatured === true;

    // Logo (if uploaded)
    if (req.file) {
      user.logo = req.file.filename;
    }

    // Password change — optional
    if (req.body.password) {
      user.password = req.body.password;
    }

    await user.save();

    res.json({ message: "User updated successfully", user });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

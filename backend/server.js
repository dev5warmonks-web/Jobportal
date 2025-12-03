// Load environment variables if dotenv is available
// try {
//   require("dotenv").config();
// } catch (e) {
//   console.warn("dotenv not installed; continuing without loading backend/.env");
// }
require('dotenv').config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// ROUTES
const authRoutes = require("./routes/auth");
const jobRoutes = require("./routes/jobRoutes");
const userRoutes = require("./routes/users");              // <-- IMPORTANT
const userRoleRoutes = require("./routes/userRole");
const jobCategoryRoutes = require("./routes/jobcategory");
const jobExperienceRoutes = require("./routes/jobexperience");
const jobLocationRoutes = require("./routes/joblocation");
const sortByDateRoutes = require("./routes/sortbydate");
const professionalRoutes = require("./routes/professional");
const expectedCTCRoutes = require("./routes/expectedCTC");
const subscriptionRoutes = require("./routes/subscription");
const applicationRoutes = require("./routes/applications");

const app = express();

// CONNECT DATABASE
connectDB();

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// API ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

// Final fixed users route
// This includes:
// GET /api/users
// GET /api/users/:id
// POST /api/users
// POST /api/users/send-otp
// POST /api/users/verify-otp
// PUT /api/users/:id
app.use("/api/users", userRoutes);

app.use("/api/user-roles", userRoleRoutes);
app.use("/api/job-categories", jobCategoryRoutes);
app.use("/api/job-experiences", jobExperienceRoutes);
app.use("/api/job-locations", jobLocationRoutes);
app.use("/api/sort-by-dates", sortByDateRoutes);
app.use("/api/professional", professionalRoutes);
app.use("/api/expected-ctc", expectedCTCRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/applications", applicationRoutes);

// SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

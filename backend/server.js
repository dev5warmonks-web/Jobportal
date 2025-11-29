
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const jobRoutes = require("./routes/jobRoutes");
const jobCategoryRoutes = require("./routes/jobcategory");

const app = express();

// Connect MongoDB 
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Mount job routes
app.use("/api/jobs", jobRoutes);

// Mount users routes
const userRoutes = require("./routes/users");
app.use("/api/users", userRoutes);

// Routes

app.use("/api/jobcategory", jobCategoryRoutes);

// Start server
app.listen(5000, () => console.log("Server running on port 5000"));


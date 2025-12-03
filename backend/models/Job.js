const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  userid: String,
  title: String,
  company: String,
  location: String,
  salary: String,
  description: String,
  site: String,
  jobtype: String,
  jobcategory: String,
  experience: String,
  mails: String,
  skills: [],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Job", jobSchema);

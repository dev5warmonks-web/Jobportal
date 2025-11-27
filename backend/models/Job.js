const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  salary: String,
  onsiteorremote: String,
  description: String,
  jobtype: String,
  jobcategory: String,
  mails: String,
  skills: Array,
  experience: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Job", jobSchema);

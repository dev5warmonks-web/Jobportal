const mongoose = require("mongoose");

const professionalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
  experienceLevel: String,
  highestEducation: String,
  currentCompany: String,
  preferredIndustry: String,
  preferredJobType: String,
  keySkills: [String], // Array of selected skills
}, { timestamps: true });

module.exports = mongoose.model("ProfessionalDetails", professionalSchema);

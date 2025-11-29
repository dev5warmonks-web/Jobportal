const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true, required: true },
  contact: String,
  role: { type: String, enum: ['candidate', 'employer', 'super admin'], default: 'candidate' },
  subscriptionEmail: String,
  isSubscribed: { type: Boolean, default: false },
  skills: [{ type: mongoose.Schema.Types.ObjectId, ref: "Skill" }],
});

module.exports = mongoose.model("Users", userSchema);

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
  username: { type: String },
  email: { type: String, unique: true, required: true },
  password: { type: String },
  mobile: { type: String },
  whatsapp_number: { type: String },
  address: { type: String },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  dob: { type: Date },
  email_verified_at: { type: Date, default: null },
  remember_token: { type: String },
  subscription_email: { type: String },
  isSubscribed: { type: Boolean, default: false },
  companyName: { type: String },
  logo: { type: String },
  isFeatured: { type: Boolean, default: false },
  skills: [{ type: mongoose.Schema.Types.ObjectId, ref: "Skill" }],
  user_role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserRole",
    required: true
  }
});

module.exports = mongoose.model("Users", userSchema);

const mongoose = require("mongoose");

const userRoleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ['super admin', 'admin', 'employer', 'candidate']
  }
});

module.exports = mongoose.model("UserRole", userRoleSchema);
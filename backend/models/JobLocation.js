const mongoose = require("mongoose");

const jobLocationSchema = new mongoose.Schema(
  {
    location: {
      type: String,
      required: true,
      unique: true, // unique constraint
      trim: true,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collation: { locale: "en", strength: 2 }, // case-insensitive
  }
);

// Correct unique index with collation
jobLocationSchema.index(
  { location: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } }
);

module.exports = mongoose.model("JobLocation", jobLocationSchema);

const mongoose = require("mongoose");

const jobCategorySchema = new mongoose.Schema({
  jobCategory: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
},
{
    collation: { locale: "en", strength: 2 } // 👈 Case-insensitive
  }
);
// Create unique index with collation
jobCategorySchema.index({ jobCategory: 1 }, { unique: true, collation: { locale: "en", strength: 2 } });

module.exports = mongoose.model("JobCategory", jobCategorySchema);

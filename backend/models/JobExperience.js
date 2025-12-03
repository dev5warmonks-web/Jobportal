
const mongoose = require('mongoose');

const JobExperienceSchema = new mongoose.Schema({
    jobExperience: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    is_active: {
        type: Boolean,
        default: true
    },
    createdAt: {
    type: Date,
    default: Date.now,
  },
},
{
    collation: { locale: "en", strength: 2 } // 👈 Case-insensitive
  }
);
// Create unique index with collation
JobExperienceSchema.index({ jobExperience: 1 }, { unique: true, collation: { locale: "en", strength: 2 } });

module.exports = mongoose.model('JobExperience', JobExperienceSchema);

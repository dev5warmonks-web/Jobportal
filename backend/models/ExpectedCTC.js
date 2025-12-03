const mongoose = require("mongoose");

const expectedCTCSchema = new mongoose.Schema({
  minCTC: {
    type: String,
    required: true,
    trim: true,
  },
  maxCTC: {
    type: String,
    required: true,
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
    collation: { locale: "en", strength: 2 } // 👈 Case-insensitive
  }
);
expectedCTCSchema.index(
  { minCTC: 1, maxCTC: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } }
);
module.exports = mongoose.model("ExpectedCTC", expectedCTCSchema);

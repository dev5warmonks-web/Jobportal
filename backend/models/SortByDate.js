
const mongoose = require('mongoose');

const SortByDateSchema = new mongoose.Schema({
    sortByDate: {
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
SortByDateSchema.index({ sortByDate: 1 }, { unique: true, collation: { locale: "en", strength: 2 } });

module.exports = mongoose.model('SortByDate', SortByDateSchema);

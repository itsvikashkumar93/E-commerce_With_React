const mongoose = require("mongoose");

const blacklistSchema = mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

blacklistSchema.index({ token: 1 }, { unique: true });

module.exports = mongoose.model("blacklist", blacklistSchema);

const mongoose = require("mongoose");

const TeamLeaderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  active: { type: Boolean, default: true } // ✅ Active status added
});

module.exports = mongoose.model("TeamLeader", TeamLeaderSchema);
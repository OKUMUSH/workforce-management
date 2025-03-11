const mongoose = require("mongoose");

const TeamleaderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  active: { type: Boolean, default: true } // ✅ Active status added
});

module.exports = mongoose.model("Teamleader", TeamleaderSchema);
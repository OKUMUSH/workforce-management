const mongoose = require("mongoose");

const ShiftSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["Morning", "Afternoon", "Night"], required: true },
  week: { type: Number, required: true },
  year: { type: Number, required: true },
  status: { type: String, default: "needPlanning" }
});

module.exports = mongoose.model("Shift", ShiftSchema);
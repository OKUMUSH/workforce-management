const mongoose = require("mongoose");

const IncidentSchema = new mongoose.Schema({
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: "Worker", required: true },
  shiftId: { type: mongoose.Schema.Types.ObjectId, ref: "Shift", required: true },
  type: { type: String, required: true },
  desc: { type: String, required: true }
});

module.exports = mongoose.model("Incident", IncidentSchema);
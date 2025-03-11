const mongoose = require("mongoose");

const WorkerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  startedWeek: { type: Number, required: true },
  startedYear: { type: Number, required: true },
  teamLeaderId: { type: mongoose.Schema.Types.ObjectId, ref: "TeamLeader" },
  active: { type: Boolean, default: true } // ✅ New field added
});

module.exports = mongoose.model("Worker", WorkerSchema);
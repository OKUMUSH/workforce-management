const mongoose = require("mongoose");

const PerformanceSchema = new mongoose.Schema({
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: "Worker", required: true },
  departmentShiftId: { type: mongoose.Schema.Types.ObjectId, ref: "DepartmentShift", required: true },
  performance: { type: Number, required: true }
});

module.exports = mongoose.model("Performance", PerformanceSchema);
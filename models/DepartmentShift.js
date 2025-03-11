const mongoose = require("mongoose");

const DepartmentShiftSchema = new mongoose.Schema({
  teamLeaderId: { type: mongoose.Schema.Types.ObjectId, ref: "TeamLeader", required: true },
  shiftId: { type: mongoose.Schema.Types.ObjectId, ref: "Shift", required: true },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true }
});

module.exports = mongoose.model("DepartmentShift", DepartmentShiftSchema);
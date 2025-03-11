const mongoose = require("mongoose");

const DepartmentShiftSchema = new mongoose.Schema({
  teamleaderId: { type: mongoose.Schema.Types.ObjectId, ref: "Teamleader", required: true },
  shiftId: { type: mongoose.Schema.Types.ObjectId, ref: "Shift", required: true },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true }
});

module.exports = mongoose.model("DepartmentShift", DepartmentShiftSchema);
const mongoose = require("mongoose");

const DepartmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  target: { type: Number, required: true }
});

module.exports = mongoose.model("Department", DepartmentSchema);
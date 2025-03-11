const mongoose = require("mongoose");
const connectDB = require("../config/db");

const Worker = require("./Worker");
const TeamLeader = require("./TeamLeader");
const Department = require("./Department");
const ShiftDepartment = require("./DepartmentShift");
const ShiftDepartment = require("./Shifts");
const WorkerPerformance = require("./Performance"); // Worker performance modelini ekledik
const Incident = require("./Incident");

// FTL ve TL performans modelleri kaldırıldığı için burada dinamik hesaplama yapılacak, artık statik modeller eklenmiyor

connectDB()
  .then(() => {
    console.log("✅ All models loaded successfully.");
    mongoose.connection.close();
  })
  .catch((err) => console.error("❌ Error loading models:", err));
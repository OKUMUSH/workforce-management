const express = require("express");
const {
  getAllWorkers,
  addWorker,
  updateWorker,
  deleteWorker,
  checkWorkerPerformance
} = require("../controllers/workerController");

const router = express.Router();

// 📌 Get all workers
router.get("/", getAllWorkers);

// 📌 Add new worker
router.post("/", addWorker);

// 📌 Update worker details (name, team leader, start week, year, status)
router.put("/:id", updateWorker);

// 📌 Delete worker with performance check
router.delete("/:id", deleteWorker);

// 📌 Check if worker has performance data before deletion
router.get("/check-performance/:id", checkWorkerPerformance);

module.exports = router;
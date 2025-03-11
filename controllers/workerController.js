const Worker = require("../models/Worker");
const WorkerPerformance = require("../models/Performance");

// 📌 Get all workers
const getAllWorkers = async (req, res) => {
  try {
    const workers = await Worker.find().populate("teamLeader");
    res.json({ success: true, data: workers });
  } catch (error) {
    console.error("❌ Error fetching workers:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 📌 Add a new worker
const addWorker = async (req, res) => {
  try {
    const { name, teamLeader, startedWeek, startedYear, isActive } = req.body;
    if (!name || !teamLeader || !startedWeek || !startedYear) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }
    const newWorker = new Worker({ name, teamLeader, startedWeek, startedYear, isActive });
    await newWorker.save();
    res.status(201).json({ success: true, data: newWorker });
  } catch (error) {
    console.error("❌ Error adding worker:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 📌 Update worker details
const updateWorker = async (req, res) => {
  try {
    const { name, teamLeader, startedWeek, startedYear, isActive } = req.body;
    const updatedWorker = await Worker.findByIdAndUpdate(
      req.params.id,
      { name, teamLeader, startedWeek, startedYear, isActive },
      { new: true }
    );
    if (!updatedWorker) {
      return res.status(404).json({ success: false, message: "Worker not found" });
    }
    res.json({ success: true, data: updatedWorker });
  } catch (error) {
    console.error("❌ Error updating worker:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 📌 Check if worker has performance data before deletion
const checkWorkerPerformance = async (req, res) => {
  try {
    const performanceCount = await WorkerPerformance.countDocuments({ worker: req.params.id });
    res.json({ success: true, hasPerformance: performanceCount > 0 });
  } catch (error) {
    console.error("❌ Error checking worker performance:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 📌 Delete worker (if no performance data exists, delete directly, else delete performances first)
const deleteWorker = async (req, res) => {
  try {
    const workerId = req.params.id;
    const performanceCount = await WorkerPerformance.countDocuments({ worker: workerId });

    if (performanceCount > 0) {
      await WorkerPerformance.deleteMany({ worker: workerId });
      console.log(`✅ Deleted ${performanceCount} performance records for worker ${workerId}`);
    }

    const deletedWorker = await Worker.findByIdAndDelete(workerId);
    if (!deletedWorker) {
      return res.status(404).json({ success: false, message: "Worker not found" });
    }
    
    res.json({ success: true, message: "Worker deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting worker:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { getAllWorkers, addWorker, updateWorker, deleteWorker, checkWorkerPerformance };
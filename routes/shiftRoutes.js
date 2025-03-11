const express = require("express");
const router = express.Router();
const ShiftDepartment = require("../models/DepartmentShift");
const TeamLeader = require("../models/Teamleader");
const Department = require("../models/Department");

// 📌 Get all shifts (with filters)
router.get("/", async (req, res) => {
    try {
        const { week, year, teamLeader, department } = req.query;
        let query = {};

        if (week) query.shiftWeek = Number(week);
        if (year) query.shiftYear = Number(year);
        if (teamLeader) query.teamLeader = teamLeader;
        if (department) query.department = department;

        const shifts = await ShiftDepartment.find(query)
            .populate("teamLeader", "name")
            .populate("department", "departmentName");

        res.json({ success: true, data: shifts });
    } catch (error) {
        console.error("❌ Error fetching shifts:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

// 📌 Add a new shift
router.post("/", async (req, res) => {
    try {
        const { teamLeader, department, shift, shiftWeek, shiftYear } = req.body;
        if (!teamLeader || !department || !shift || !shiftWeek || !shiftYear) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const shiftMonth = Math.ceil(shiftWeek / 4);
        const shiftQuarter = shiftMonth <= 3 ? "Q1" : shiftMonth <= 6 ? "Q2" : shiftMonth <= 9 ? "Q3" : "Q4";

        const newShift = await ShiftDepartment.create({
            teamLeader,
            department,
            shift,
            shiftWeek,
            shiftYear,
            shiftMonth,
            shiftQuarter
        });

        res.json({ success: true, data: newShift });
    } catch (error) {
        console.error("❌ Error adding shift:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

// 📌 Update a shift
router.put("/:id", async (req, res) => {
    try {
        const { teamLeader, department, shift, shiftWeek, shiftYear } = req.body;
        const shiftMonth = Math.ceil(shiftWeek / 4);
        const shiftQuarter = shiftMonth <= 3 ? "Q1" : shiftMonth <= 6 ? "Q2" : shiftMonth <= 9 ? "Q3" : "Q4";

        const updatedShift = await ShiftDepartment.findByIdAndUpdate(
            req.params.id,
            { teamLeader, department, shift, shiftWeek, shiftYear, shiftMonth, shiftQuarter },
            { new: true }
        );

        res.json({ success: true, data: updatedShift });
    } catch (error) {
        console.error("❌ Error updating shift:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

// 📌 Delete a shift
router.delete("/:id", async (req, res) => {
    try {
        await ShiftDepartment.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Shift deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting shift:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

module.exports = router;
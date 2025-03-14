const express = require("express");
const router = express.Router();
const Shifts = require("../models/Shifts");


// 📌 Get all shifts (with filters)
// 📌 Get shifts with optional filters
router.get("/", async (req, res) => {
    try {
        const { week, year, type } = req.query;  // 🛠 Get query parameters

        let filter = {};  // 🔍 Build dynamic query
        if (week) filter.week = parseInt(week);
        if (year) filter.year = parseInt(year);
        if (type) filter.type = type;

        const shifts = await Shifts.find(filter).sort({ year: -1, week: -1 });

        res.json({ success: true, data: shifts });
    } catch (error) {
        console.error("❌ Error fetching shifts:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// 📌 Fetch distinct weeks & years from the database
router.get("/weeks-years", async (req, res) => {
    try {
        const weeks = await Shifts.distinct("week");
        const years = await Shifts.distinct("year");

        // Sort weeks and years in ascending order
        weeks.sort((a, b) => a - b);
        years.sort((a, b) => a - b);

        res.json({ weeks, years });
    } catch (error) {
        console.error("❌ Error fetching weeks & years:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// 📌 Add a new shift
router.post("/", async (req, res) => {
    try {
        const { teamleader, department, shift, shiftWeek, shiftYear } = req.body;
        if (!teamleader || !department || !shift || !shiftWeek || !shiftYear) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const shiftMonth = Math.ceil(shiftWeek / 4);
        const shiftQuarter = shiftMonth <= 3 ? "Q1" : shiftMonth <= 6 ? "Q2" : shiftMonth <= 9 ? "Q3" : "Q4";

        const newShift = await ShiftDepartment.create({
            teamleader,
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
        const { name, type, week, year } = req.body;

        const updatedShift = await Shifts.findByIdAndUpdate(
            req.params.id,
            { name, type, week, year },
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
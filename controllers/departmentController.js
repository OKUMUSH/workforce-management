const Department = require("../models/Department");

// 📌 Tüm departmanları getir
const getDepartments = async (req, res) => {
    try {
        const departments = await Department.find();
        res.json({ success: true, data: departments });
    } catch (error) {
        console.error("❌ [GET] Error fetching departments:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// 📌 Yeni departman ekle
const addDepartment = async (req, res) => {
    try {
        console.log("🔍 [POST] /department - New department:", req.body);
        const { name, target = 350 } = req.body;

        if (!name) {
            console.error("❌ [POST] Missing department name!");
            return res.status(400).json({ message: "Department name is required" });
        }

        const newDepartment = new Department({ name, target });
        await newDepartment.save();
        console.log("✅ [POST] Department added successfully:", newDepartment);
        res.status(201).json(newDepartment);
    } catch (error) {
        console.error("❌ [POST] Error adding department:", error);
        res.status(500).json({ message: "Failed to add department" });
    }
};

// 📌 Departman Güncelle
const updateDepartment = async (req, res) => {
    try {
        console.log(`🔍 [PUT] /department/${req.params.id} - Update request received:`, req.body);
        const { id } = req.params;
        const { name, target } = req.body;

        if (!target) {
            console.error("❌ [PUT] Target!");
            return res.status(400).json({ message: "Target is required" });
        }

        const updated = await Department.findByIdAndUpdate(
            id,
            { name, target },
            { new: true }
        );

        if (!updated) {
            console.error("❌ [PUT] Department not found:", id);
            return res.status(404).json({ message: "Department not found" });
        }

        console.log("✅ [PUT] Department updated successfully:", updated);
        res.status(200).json(updated);
    } catch (error) {
        console.error("❌ [PUT] Error updating department:", error);
        res.status(500).json({ message: "Failed to update department" });
    }
};

// 📌 Departman Sil
const deleteDepartment = async (req, res) => {
    try {
        console.log(`🔍 [DELETE] /department/${req.params.id} - Delete request received`);

        const deleted = await Department.findByIdAndDelete(req.params.id);
        if (!deleted) {
            console.error("❌ [DELETE] Department not found:", req.params.id);
            return res.status(404).json({ message: "Department not found" });
        }

        console.log("✅ [DELETE] Department deleted successfully:", deleted);
        res.status(200).json({ message: "Department deleted" });
    } catch (error) {
        console.error("❌ [DELETE] Error deleting department:", error);
        res.status(500).json({ message: "Failed to delete department" });
    }
};

module.exports = { getDepartments, addDepartment, updateDepartment, deleteDepartment };
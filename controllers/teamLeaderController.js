const Teamleader = require("../models/Teamleader");

// 📌 Tüm Takım Liderlerini Getir
const getAllTeamleaders = async (req, res) => {
  try {
    const teamleaders = await Teamleader.find();
    res.status(200).json({ success: true, data: teamleaders });
  } catch (error) {
    console.error("❌ Get Teamleaders Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// 📌 Yeni Takım Lideri Ekle
const createTeamleader = async (req, res) => {
  try {
    const { name, active } = req.body;
    if (!name) return res.status(400).json({ success: false, message: "Name is required" });
    if (typeof active !== "boolean") return res.status(400).json({ success: false, message: "Active status is required" });

    const newTeamleader = await Teamleader.create({ name, active });
    res.status(201).json({ success: true, data: newTeamleader });
  } catch (error) {
    console.error("❌ Create Teamleader Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// 📌 Takım Liderini Güncelle
const updateTeamleader = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, active } = req.body;

    const updatedTeamleader = await Teamleader.findByIdAndUpdate(id, { name, active }, { new: true });

    if (!updatedTeamleader) return res.status(404).json({ success: false, message: "Team Leader Not Found" });

    res.status(200).json({ success: true, data: updatedTeamleader });
  } catch (error) {
    console.error("❌ Update Teamleader Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// 📌 Takım Liderini Sil
const deleteTeamleader = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTeamleader = await Teamleader.findByIdAndDelete(id);

    if (!deletedTeamleader) return res.status(404).json({ success: false, message: "Teamleader Not Found" });

    res.status(200).json({ success: true, message: "Teamleader Deleted" });
  } catch (error) {
    console.error("❌ Delete Teamleader Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  getAllTeamleaders,
  createTeamleader,
  updateTeamleader,
  deleteTeamleader
};
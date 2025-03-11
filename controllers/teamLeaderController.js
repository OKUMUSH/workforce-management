const TeamLeader = require("../models/TeamLeader");

// 📌 Tüm Takım Liderlerini Getir
const getAllTeamLeaders = async (req, res) => {
  try {
    const teamLeaders = await TeamLeader.find();
    res.status(200).json({ success: true, data: teamLeaders });
  } catch (error) {
    console.error("❌ Get Team Leaders Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// 📌 Yeni Takım Lideri Ekle
const createTeamLeader = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ success: false, message: "Name is required" });

    const newTeamLeader = await TeamLeader.create({ name });
    res.status(201).json({ success: true, data: newTeamLeader });
  } catch (error) {
    console.error("❌ Create Team Leader Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// 📌 Takım Liderini Güncelle
const updateTeamLeader = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, active } = req.body;

    const updatedTeamLeader = await TeamLeader.findByIdAndUpdate(id, { name, active }, { new: true });

    if (!updatedTeamLeader) return res.status(404).json({ success: false, message: "Team Leader Not Found" });

    res.status(200).json({ success: true, data: updatedTeamLeader });
  } catch (error) {
    console.error("❌ Update Team Leader Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// 📌 Takım Liderini Sil
const deleteTeamLeader = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTeamLeader = await TeamLeader.findByIdAndDelete(id);

    if (!deletedTeamLeader) return res.status(404).json({ success: false, message: "Team Leader Not Found" });

    res.status(200).json({ success: true, message: "Team Leader Deleted" });
  } catch (error) {
    console.error("❌ Delete Team Leader Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  getAllTeamLeaders,
  createTeamLeader,
  updateTeamLeader,
  deleteTeamLeader
};
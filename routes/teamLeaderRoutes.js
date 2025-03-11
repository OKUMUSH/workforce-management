const express = require("express");
const {
  getAllTeamLeaders,
  createTeamLeader,
  updateTeamLeader,
  deleteTeamLeader
} = require("../controllers/teamLeaderController");

const router = express.Router();

// 📌 Tüm Takım Liderlerini Getir
router.get("/", getAllTeamLeaders);

// 📌 Yeni Takım Lideri Ekle
router.post("/", createTeamLeader);

// 📌 Takım Liderini Güncelle
router.put("/:id", updateTeamLeader);

// 📌 Takım Liderini Sil
router.delete("/:id", deleteTeamLeader);

module.exports = router;
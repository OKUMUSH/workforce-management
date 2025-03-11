const express = require("express");
const {
  getAllTeamleaders,
  createTeamleader,
  updateTeamleader,
  deleteTeamleader
} = require("../controllers/teamleaderController");

const router = express.Router();

// 📌 Tüm Takım Liderlerini Getir
router.get("/", getAllTeamleaders);

// 📌 Yeni Takım Lideri Ekle
router.post("/", createTeamleader);

// 📌 Takım Liderini Güncelle
router.put("/:id", updateTeamleader);

// 📌 Takım Liderini Sil
router.delete("/:id", deleteTeamleader);

module.exports = router;
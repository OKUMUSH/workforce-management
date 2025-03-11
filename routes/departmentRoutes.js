const express = require("express");
const {
    getDepartments,
    addDepartment,
    updateDepartment,
    deleteDepartment
} = require("../controllers/departmentController");

const router = express.Router();

router.get("/", getDepartments);
router.post("/", addDepartment);
router.put("/:id", updateDepartment);
router.delete("/:id", deleteDepartment);

module.exports = router;
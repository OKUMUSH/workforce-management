const express = require("express");
const connectDB = require("./config/db");
require("dotenv").config();
const departmentRoutes = require("./routes/departmentRoutes");
const teamLeaderRoutes = require("./routes/teamLeaderRoutes");
const workerRoutes = require("./routes/workerRoutes");
const Worker = require("./models/Worker"); 
const TeamLeader = require("./models/TeamLeader");
const shiftRoutes = require("./routes/shiftRoutes");

const app = express();

// 📌 Middleware
app.use(express.json());
app.use(require("cors")());

// 📌 MongoDB Bağlantısı
connectDB();

// 📌 EJS Ayarları
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public")); // 📌 Statik dosyalar (CSS, JS)

// 📌 Departman Rotaları Kullan
app.use("/api/department", departmentRoutes);

// 📌 Teamleader Rotaları Kullan
app.use("/api/teamleaders", teamLeaderRoutes);

// 📌 Worker Rotaları Kullan
app.use("/api/workers", workerRoutes);

// 📌 Shift Rotaları Kullan
app.use("/api/shifts", shiftRoutes);

// 📌 Dashboard Sayfası (Ana Sayfa)
app.get("/", (req, res) => {
  res.render("dashboard");
});

app.get("/manage-shifts", (req, res) => {
  res.render("manageShifts");
}
);

// 📌 Manage Workers Page (Fix for teamLeaders)
app.get("/manage-workers", async (req, res) => {
  try {
      const workers = await Worker.find().populate("teamLeader", "name").lean();
      const teamLeaders = await TeamLeader.find().lean();
      
      console.log("✅ Fetched Workers:", workers);
      console.log("✅ Fetched Team Leaders:", teamLeaders);

      res.render("manageWorkers", { workers: { data: workers }, teamLeaders });  // Ensure data key
  } catch (error) {
      console.error("❌ Error fetching workers:", error);
      res.status(500).send("Internal Server Error");
  }
});

// 📌 Manage Departments Sayfası
app.get("/manage-departments", async (req, res) => {
  try {
      const Department = require("./models/Department");
      const departments = await Department.find().lean();
      res.render("manageDepartments", { departments });
  } catch (error) {
      console.error("❌ Manage Departments Error:", error);
      res.status(500).send("Internal Server Error");
  }
});

// 📌 Manage TeamLeaders Sayfası
app.get("/manage-teamleaders", async (req, res) => {
  try {
      const TeamLeader = require("./models/TeamLeader");
      const teamLeaders = await TeamLeader.find().lean();
      res.render("manageTeamLeaders", { teamLeaders });
  } catch (error) {
      console.error("❌ Manage TeamLeaders Error:", error);
      res.status(500).send("Internal Server Error");
  }
});

// 📌 Sunucuyu Başlat
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
const express = require("express");
const connectDB = require("./config/db");
require("dotenv").config();
const departmentRoutes = require("./routes/departmentRoutes");
const teamleaderRoutes = require("./routes/teamleaderRoutes");
const workerRoutes = require("./routes/workerRoutes");
const Worker = require("./models/Worker"); 
const Department = require("./models/Department");
const Teamleader = require("./models/Teamleader");
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
app.use("/api/teamleaders", teamleaderRoutes);

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

// 📌 Manage Workers Page (Fix for teamleaders)
app.get("/manage-workers", async (req, res) => {
  try {
      const workers = await Worker.find().lean();
      const teamleaders = await Teamleader.find().lean();
      const fixedteamleaders = teamleaders.map(tl => ({ _id: tl._id, name: tl.name }));

      console.log("✅ Fetched Workers:", workers);
      console.log("✅ Fetched Team Leaders:", teamleaders);
      console.log("✅ Fixed Team Leaders:", fixedteamleaders);

      res.render("manageWorkers", { workers, teamleaders, fixedteamleaders });  // Ensure data key

  } catch (error) {
      console.error("❌ Error fetching workers:", error);
      res.status(500).send("Internal Server Error");
  }
});

// 📌 Manage Departments Sayfası
app.get("/manage-departments", async (req, res) => {
  try {

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
      const teamleaders = await Teamleader.find().lean();
      res.render("manageTeamleaders", { teamleaders });
  } catch (error) {
      console.error("❌ Manage Teamleaders Error:", error);
      res.status(500).send("Internal Server Error");
  }
});

// 📌 Sunucuyu Başlat
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
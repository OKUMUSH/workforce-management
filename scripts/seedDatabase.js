const mongoose = require("mongoose");
const connectDB = require("../config/db");

const Worker = require("../models/Worker");
const Teamleader = require("../models/Teamleader");
const Department = require("../models/Department");
const Shift = require("../models/Shifts");
const DepartmentShift = require("../models/DepartmentShift");
const Performance = require("../models/Performance");
const Incident = require("../models/Incident");
const { Logger } = require("sequelize/lib/utils/logger");


// 📌 Shift Codes Mapping
const shiftCodes = {
  Monday: { Morning: "MONDAY MAPO", Afternoon: "MONDAY MAPA" },
  Tuesday: { Morning: "TUESDAY WOPO", Afternoon: "TUESDAY WOPA" },
  Wednesday: { Morning: "WEDNESDAY DOPO", Afternoon: "WEDNESDAY DOPA" },
  Thursday: { Morning: "THURSDAY VRPO", Afternoon: "THURSDAY VRPA" },
  Friday: { Morning: "FRIDAY ZOPO", Afternoon: "FRIDAY ZOPA" },
  Saturday: { Morning: "SATURDAY ZAPO", Afternoon: "SATURDAY ZAPA" },
  Sunday: { Morning: "SUNDAY SOPO", Afternoon: "SUNDAY SOPA" },
};

// 📌 Function to calculate the week number from a given date
const getWeekNumber = (date) => {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  return Math.ceil((((date - startOfYear) / 86400000) + 1) / 7);
};

const seedDatabase = async () => {
  await connectDB();

  try {
    // **Clear all collections**
    await Worker.deleteMany();
    await Teamleader.deleteMany();
    await Department.deleteMany();
    await Shift.deleteMany();
    await DepartmentShift.deleteMany();
    await Performance.deleteMany();
    await Incident.deleteMany();
    console.log("🗑️ All collections have been cleared!");

    // **Add Team Leaders**
    const teamleaders = await Teamleader.insertMany([
      { name: "Tomasz", active: true },
      { name: "Nenad", active: true },
      { name: "Costel", active: true },
      { name: "Silviu", active: true },
      { name: "Kamil", active: true },
      { name: "Rafal", active: true }
    ]);
    console.log("✅ Team Leaders added!");

    // **Add Departments**
    const departmentData = await Department.insertMany([
      { name: "HB PICKING", target: 350 },
      { name: "HB HALVE PICKING", target: 350 },
      { name: "BULK PICKING", target: 350 },
      { name: "KOEL", target: 350 },
      { name: "KOEL HALVE PICKING", target: 350 },
      { name: "DPVR PICKING", target: 350 },
    ]);


    // **Check for duplicate department names before inserting**
    const existingDepartments = await Department.find();
    const existingNames = new Set(existingDepartments.map(d => d.name));

    const validDepartments = departmentData
        .filter(dept => dept.name && dept.target) // Ensure name and target exist
        .filter(dept => !existingNames.has(dept.name)); // Avoid duplicates

    if (validDepartments.length > 0) {
        await Department.insertMany(validDepartments);
        console.log("✅ Departments added!");
    } else {
        console.log("ℹ️ No new departments to insert (duplicates skipped).");
    }

    console.log("✅ Departments added!");

    // **Add Workers**
    const workers = await Worker.insertMany(
      Array.from({ length: 50 }, (_, i) => ({
        name: `Worker ${i + 1}`,
        startedWeek: Math.floor(Math.random() * 52) + 1,
        startedYear: 2024,
        teamleaderId: teamleaders[i % teamleaders.length]._id,
        active: Math.random() > 0.2 // 20% chance of being inactive
      }))
    );
    console.log("✅ 50 Workers added!");

    // **Generate shifts for the entire year 2025-2030**
    const shifts = [];
    const startDate = new Date("2024-12-31T23:59:59.999Z");
    const endDate = new Date("2030-12-31T23:59:59.999Z");

    for (let date = new Date(startDate.getTime()); date <= endDate; date.setDate(date.getDate() + 1)) {
      const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
      const now = new Date();
      let status = 'needPlanning';
      if (date < now) {
        status = 'needReport';
      }

      if (date > now) {
          console.log(date.toISOString() + " is later than " + now.toISOString());
      } else if (date < now) {
          console.log(date + " is earlier than " + now);
      } else {
          console.log("🔄 Both dates are equal.");
      }


      if (shiftCodes[dayName]) {
        Object.entries(shiftCodes[dayName]).forEach(([shiftType, shiftCode]) => {
          shifts.push({
          name: shiftCode, // Shift Code as Name
          type: shiftType, // Morning or Afternoon
          week: getWeekNumber(date),
          year: date.getFullYear(),
          status: status
          });
        });
      } 
    }

    const insertedShifts = await Shift.insertMany(shifts);
    console.log("✅ Shifts created for the entire 2025-2030 with shift codes!");

    // **Generate Department Shifts**
    const departmentShifts = [];
    const departments = await Department.find();

    insertedShifts.forEach((shift) => {
      const assignedDepartment = departments[Math.floor(Math.random() * departments.length)];
      const assignedTeamleader = teamleaders[Math.floor(Math.random() * teamleaders.length)];

      departmentShifts.push({
        teamleaderId: assignedTeamleader._id,
        shiftId: shift._id,
        departmentId: assignedDepartment._id
      });
    });

    const insertedDepartmentShifts = await DepartmentShift.insertMany(departmentShifts);
    console.log("✅ Department Shifts created!");

    // **Generate Worker Performance & Incidents**
    const performanceDocs = [];
    const incidentDocs = [];
    const incidentTypes = ["Resignation", "Sick Leave", "Quality Issue", "Safety/Culture Violation"];

    insertedDepartmentShifts.forEach((deptShift) => {
      workers.forEach((worker) => {
        if (Math.random() < 0.33) { // 33% chance of worker being in this shift
          performanceDocs.push({
            workerId: worker._id,
            departmentShiftId: deptShift._id,
            performance: Math.floor(Math.random() * 275) + 199 // Random performance 50-100
          });

          // **15% chance of an incident**
          if (Math.random() < 0.07) {
            const randomIncidentType = incidentTypes[Math.floor(Math.random() * incidentTypes.length)];
            incidentDocs.push({
              workerId: worker._id,
              shiftId: deptShift.shiftId,
              type: randomIncidentType,
              desc: `${randomIncidentType} incident.`
            });
          }
        }
      });
    });

    await Performance.insertMany(performanceDocs);
    console.log("✅ Worker Performance data added!");

    // **Insert Incidents**
    if (incidentDocs.length > 0) {
      await Incident.insertMany(incidentDocs);
      console.log(`✅ ${incidentDocs.length} Incidents added!`);
    } else {
      console.log("ℹ️ No incidents were created (low probability).");
    }

    console.log("🚀 Seeding process completed successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error during seeding process:", error);
    mongoose.connection.close();
  }
};

seedDatabase();
const express = require("express");
const router = express.Router();
const {
  startWorkSession,
  stopWorkSession,
  addEod,
  getTodaysSession,
  getAllTodaysSessions,
  getSessionsByDateRange,
} = require("../controllers/workSessionController");

router.post("/start", startWorkSession);
router.post("/stop", stopWorkSession);
router.post("/eod", addEod);
router.get("/today/:userId", getTodaysSession);
router.get("/today", getAllTodaysSessions);
router.get("/range", getSessionsByDateRange); // ✅ new route for all history

module.exports = router;

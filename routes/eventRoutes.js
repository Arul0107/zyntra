const express = require("express");
const router = express.Router();

const {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");

// FIX → import default export, NOT destructured
const authMiddleware = require("../middlewares/auth");

// Routes
router.post("/", authMiddleware, createEvent);
router.get("/", authMiddleware, getEvents);
router.put("/:id", authMiddleware, updateEvent);
router.delete("/:id", authMiddleware, deleteEvent);

module.exports = router;

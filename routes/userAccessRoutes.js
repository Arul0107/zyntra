const express = require("express");
const router = express.Router();
const controller = require("../controllers/userAccessController");
const auth = require("../middlewares/auth");

// List all users + permissions
router.get("/all", auth, controller.getAllUsersWithAccess);

// Update permissions
router.post("/update", auth, controller.updateUserAccess);

// Logged in user access
router.get("/my", auth, controller.getMyAccess);

module.exports = router;

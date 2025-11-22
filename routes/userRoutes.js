// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// 🔥 Normal User APIs
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getSingleUser);
router.post("/", userController.createUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

// 🔥 Transfer user
router.put("/transfer/:id", userController.transferUser);

// 🔥 Presence update
router.post("/status/update", userController.updateStatus);

// 🔥 Chat Sorted User List (WhatsApp Style Sorting)
router.get("/chat/list", userController.getChatSortedUsers);

module.exports = router;

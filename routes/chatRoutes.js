// server/routes/chatRoutes.js
const router = require("express").Router();
const {
  sendMessage,
  getChatHistory,
  markAsRead,
  getUnreadCounts, // 🔥 New route
  deleteMessage,
  deleteMultiple,
  deleteForEveryone
} = require("../controllers/chatController");

// send message
router.post("/", sendMessage);

// load full chat
router.get("/:user1/:user2", getChatHistory);

// 🔥 Get unread counts for chat list
router.get("/unread-counts", getUnreadCounts); 

// mark read
router.post("/read", markAsRead);

// delete single
router.delete("/:id", deleteMessage);

// delete multiple
router.post("/delete-multiple", deleteMultiple);
router.post("/delete-for-everyone", deleteForEveryone);

module.exports = router;
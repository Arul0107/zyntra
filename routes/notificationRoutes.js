const router = require("express").Router();
const {
  getNotificationsByUser,
  markAsRead,
  deleteNotification,
  createNotification,
} = require("../controllers/notificationController");

router.post("/", createNotification);
router.get("/:userId", getNotificationsByUser);
router.post("/read", markAsRead);
router.delete("/:id", deleteNotification);

module.exports = router;

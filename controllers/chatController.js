// controllers/chatController.js
const Message = require("../models/Message");
const User = require("../models/User");
const Notification = require("../models/Notification");
const getConversationId = require("../utils/getConversationId");
const mongoose = require("mongoose");


//
// 🔥 SEND MESSAGE (Save + Notify + RT Update)
//
exports.sendMessage = async (req, res) => {
  try {
    const { from, to, text, attachments } = req.body;
    
    if (!from || !to) {
      return res.status(400).json({ message: "From & To required" });
    }

    const conversationId = getConversationId(from, to);

    // Save message to DB
    const msg = await Message.create({
      conversationId,
      from,
      to,
      text,
      attachments,
      read: false,
      sentAt: new Date()
    });

    // Update sorting time
    await User.findByIdAndUpdate(from, { lastMessageAt: new Date() });
    await User.findByIdAndUpdate(to, { lastMessageAt: new Date() });

    // ⭐ Create notification with sender reference
    const notification = await Notification.create({
      user: to,
      fromUser: from,
      message: text || "📎 New attachment received",
      type: "message",
      read: false,
    });

    // ⭐ Populate sender name before sending to frontend
    const populatedNotification = await Notification.findById(notification._id)
      .populate("fromUser", "name email");

    // 🔔 Emit Real-time Notification With Sender Name
    if (global._io) {
      global._io.to(to.toString()).emit("new_notification", {
        ...populatedNotification.toObject()
      });
    }

    // 📩 Emit real-time chat message to receiver
    if (global._io) {
      global._io.to(to.toString()).emit("new_message", msg);
    }

    res.json(msg);

  } catch (err) {
    console.error("sendMessage error:", err);
    res.status(500).json({ error: err.message });
  }
};



//
// 🔥 GET CHAT HISTORY
//
exports.getChatHistory = async (req, res) => {
  try {
    const { user1, user2 } = req.params;
    const conversationId = getConversationId(user1, user2);

    const messages = await Message.find({ conversationId }).sort({ sentAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



//
// 🔥 GET UNREAD COUNTS
//
exports.getUnreadCounts = async (req, res) => {
  try {
    const { userId } = req.query;

    const counts = await Message.aggregate([
      {
        $match: {
          to: new mongoose.Types.ObjectId(userId),
          read: false,
        },
      },
      {
        $group: { _id: "$from", count: { $sum: 1 } },
      },
    ]);

    const unreadMap = {};
    counts.forEach(item => unreadMap[item._id.toString()] = item.count);

    res.json(unreadMap);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



//
// 🔥 MARK AS READ
//
exports.markAsRead = async (req, res) => {
  try {
    const { from, to } = req.body;
    const conversationId = getConversationId(from, to);

    await Message.updateMany(
      { conversationId, from, to, read: false },
      { $set: { read: true } }
    );

    res.json({ message: "Marked as read" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



//
// 🔥 DELETE MESSAGE
//
exports.deleteMessage = async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



//
// 🔥 DELETE MULTIPLE
//
exports.deleteMultiple = async (req, res) => {
  try {
    const { ids } = req.body;
    await Message.deleteMany({ _id: { $in: ids } });
    res.json({ message: "Messages deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



//
// 🔥 DELETE FOR EVERYONE
//
exports.deleteForEveryone = async (req, res) => {
  try {
    const { id } = req.body;

    const deletedMsg = await Message.findByIdAndDelete(id);

    if (!deletedMsg) return res.json({ message: "Not found" });

    if (global._io) {
      const { from, to } = deletedMsg;
      global._io.to(from.toString()).emit("message_deleted_for_everyone", { id });
      global._io.to(to.toString()).emit("message_deleted_for_everyone", { id });
    }

    res.json({ message: "Deleted for everyone" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

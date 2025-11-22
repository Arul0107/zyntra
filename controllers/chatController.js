// server/controllers/chatController.js
const Message = require("../models/Message");
const User = require("../models/User");
const getConversationId = require("../utils/getConversationId");


//
// 🔥 SEND MESSAGE (supports reply + updates lastMessageAt)
//
exports.sendMessage = async (req, res) => {
  try {
    const { from, to, text, attachments, replyTo } = req.body;
    const conversationId = getConversationId(from, to);

    let replyText = "";

    if (replyTo) {
      const original = await Message.findById(replyTo);
      if (original) replyText = original.text.substring(0, 120);
    }

    const msg = await Message.create({
      conversationId,
      from,
      to,
      text,
      attachments,
      replyTo: replyTo || null,
      replyText,
      read: false,
      sentAt: new Date()
    });

    // 🔥 ONLY HERE → update lastMessageAt
    await User.findByIdAndUpdate(from, { lastMessageAt: new Date() });
    await User.findByIdAndUpdate(to, { lastMessageAt: new Date() });

    res.json(msg);
  } catch (err) {
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
// 🔥 MARK MESSAGES AS READ
//
exports.markAsRead = async (req, res) => {
  try {
    const { from, to } = req.body;
    const conversationId = getConversationId(from, to);

    await Message.updateMany(
      { conversationId, to, read: false },
      { $set: { read: true } }
    );

    // Emit read event to sender
    if (global._io) {
      global._io.to(from.toString()).emit("messages_read", { conversationId });
    }

    res.json({ message: "Messages marked as read" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



//
// 🔥 DELETE SINGLE MESSAGE
//
exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    await Message.findByIdAndDelete(id);

    res.json({ message: "Message deleted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



//
// 🔥 DELETE MULTIPLE MESSAGES
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

      // Notify both users
      global._io.to(from.toString()).emit("message_deleted_for_everyone", { id });
      global._io.to(to.toString()).emit("message_deleted_for_everyone", { id });
    }

    res.json({ message: "Message deleted for everyone" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const Message = require("../models/Message");
const User = require("../models/User");
const getConversationId = require("../utils/getConversationId");
const mongoose = require("mongoose"); // Used for ObjectId in aggregation

//
// 🔥 SEND MESSAGE (updates lastMessageAt, includes attachments)
//
exports.sendMessage = async (req, res) => {
    try {
        const { from, to, text, attachments } = req.body; // attachments is received here
        const conversationId = getConversationId(from, to);

        const msg = await Message.create({
            conversationId,
            from,
            to,
            text,
            attachments, // 👈 Saved to DB
            read: false, 
            sentAt: new Date()
        });

        // Update last message time for sorting
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
// 🔥 GET UNREAD COUNTS (Pre-calculation for chat list)
//
exports.getUnreadCounts = async (req, res) => {
    try {
        const { userId } = req.query; // Logged user ID

        const counts = await Message.aggregate([
            {
                $match: {
                    to: new mongoose.Types.ObjectId(userId), // Messages intended for the logged user
                    read: false,                             // Message is unread
                },
            },
            {
                $group: {
                    _id: "$from", // Group by sender ID
                    count: { $sum: 1 },
                },
            },
        ]);

        // Convert the array of counts into a map { senderId: count }
        const unreadMap = counts.reduce((acc, item) => {
            acc[item._id.toString()] = item.count;
            return acc;
        }, {});

        res.json(unreadMap);

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

        // Mark messages sent BY 'from' TO 'to' as read
        const result = await Message.updateMany(
            { conversationId, from, to, read: false },
            { $set: { read: true } }
        );

        // Emit read event to the sender ('from' user)
        if (global._io && result.modifiedCount > 0) {
            global._io.to(from.toString()).emit("messages_read", { conversationId });
        }

        res.json({ message: "Messages marked as read" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


//
// 🔥 DELETE SINGLE MESSAGE (Delete for me)
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
// 🔥 DELETE MULTIPLE MESSAGES (Delete for me)
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
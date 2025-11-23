// server/models/Message.js

const mongoose = require("mongoose");

// Define Attachment Schema
const attachmentSchema = new mongoose.Schema({
    url: { type: String, required: true },
    filename: { type: String, required: true },
    // You can add more fields like mimeType, size, etc.
}, { _id: false }); // Do not create a separate ID for attachments

const messageSchema = new mongoose.Schema(
    {
        conversationId: {
            type: String,
            required: true,
            index: true
        },

        from: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        to: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        text: {
            type: String,
            default: ""
        },

        // 🌟 CORE CHANGE: Array of attachments
        attachments: {
            type: [attachmentSchema], // Array of attachments
            default: [],
        },

        // 🔥 CORE: Tracks if the recipient has opened the chat/read the message
        read: {
            type: Boolean,
            default: false
        },

        sentAt: {
            type: Date,
            default: Date.now
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Message", messageSchema);
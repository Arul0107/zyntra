const mongoose = require("mongoose");

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

    attachments: [
      {
        url: String,
        filename: String
      }
    ],

    read: {
      type: Boolean,
      default: false
    },

    sentAt: {
      type: Date,
      default: Date.now
    },
  replyTo: { type: String, default: null },   // referenced message ID
  replyText: { type: String, default: "" },
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Message", messageSchema);
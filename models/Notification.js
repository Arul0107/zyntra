const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Receiver
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // Sender

    message: { type: String, required: true },

    type: {
      type: String,
      enum: ["info", "warning", "error", "STOP_WORK_WARNING", "message"],
      default: "message",
    },

    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);

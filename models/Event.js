// Event Model (e.g., Event.js)
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },

    type: {
      type: String,
      enum: ["meeting", "birthday", "task", "reminder"],
      default: "task",
    },

    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BusinessAccount", // Assuming this is your account model name
    },

    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BrandService", // Assuming this is your service model name
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    color: { type: String, default: "#1677ff" },

    start: { type: Date, required: true },
    end: { type: Date, required: true },

    role: { type: String, required: true }, // from user
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
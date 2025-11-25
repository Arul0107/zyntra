// models/Task.js
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },

    // NEW FIELDS
    reason: { type: String },
    timeRequired: { type: String },
    extraAttachment: [{ type: String }],

    // IMPORTANT FLAG
    isImportant: { type: Boolean, default: false },

    // TIME FIELD
    startTime: { type: String }, // Example: "09:30"

    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // ACCOUNT + SERVICE
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BusinessAccount"
    },

    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BrandService"
    },

    status: {
      type: String,
      enum: ["To Do", "In Progress", "Review", "Completed", "Overdue"],
      default: "To Do"
    },

    assignedDate: { type: Date, default: Date.now },
    dueDate: { type: Date },

    attachments: [{ type: String }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);

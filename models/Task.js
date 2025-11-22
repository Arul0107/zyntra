const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },

  // NEW FIELD FIX
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: "BusinessAccount" },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "BrandService" },

  status: {
    type: String,
    enum: ["To Do", "In Progress", "Review", "Completed", "Overdue"],
    default: "To Do",
  },

  assignedDate: { type: Date, default: Date.now },
  dueDate: { type: Date },
  attachments: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);

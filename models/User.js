// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  mobile: { type: String, trim: true },
  password: { type: String, required: true },

  role: {
    type: String,
    enum: ["Superadmin", "Admin", "Team Leader", "Employee"],
    default: "Employee",
  },
fcmToken: { type: String }
,
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active",
  },

  /* =========================================
      PRESENCE FIELDS
  ========================================== */
  presence: {
    type: String,
    enum: ["online", "offline", "busy", "away", "in_meeting"],
    default: "offline",
  },

  previousPresence: {
    type: String,
    enum: ["online", "offline", "busy", "away", "in_meeting", null],
    default: "offline",
  },

  /* =========================================
      LAST SEEN + LAST ACTIVE
  ========================================== */
  lastSeen: {
    type: Date,
    default: null,
  },

  lastActiveAt: {
    type: Date,
    default: Date.now,
  },

  /* =========================================
      NEW FIELD — LAST MESSAGE TIME
      REQUIRED FOR CHAT SORTING
  ========================================== */
  lastMessageAt: {
    type: Date,
    default: null,
  },

  department: { type: mongoose.Schema.Types.ObjectId, ref: "Department", default: null },
  team: { type: mongoose.Schema.Types.ObjectId, ref: "Team", default: null },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);

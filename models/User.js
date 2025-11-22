const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

  name: { type: String, required: true, trim: true },

  email: { type: String, required: true, unique: true, trim: true, lowercase: true },

  mobile: { type: String, trim: true },

  password: { type: String, required: true },

  role: {
    type: String,
    enum: ['Superadmin', 'Admin', 'Team Leader', 'Employee'],
    default: 'Employee'
  },

  // ✔ Old status kept (Active / Inactive)
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },

  // 🟢 NEW PRESENCE FIELD (Teams style)
  presence: {
    type: String,
    enum: ['online', 'offline', 'busy', 'away', 'in_meeting'],
    default: 'offline'
  },

  lastActiveAt: {
    type: Date,
    default: Date.now
  },

  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', default: null },

  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null }

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

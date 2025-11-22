// models/Credential.js
const mongoose = require("mongoose");

const credentialSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  appName: { type: String, required: true },       // Example: Instagram, Google Ads
  loginId: { type: String, required: true },       // Username / Email / Phone
  password: { type: String, required: true },      // Saved Password
  notes: { type: String, default: "" },            // Optional notes

}, { timestamps: true });

module.exports = mongoose.model("Credential", credentialSchema);

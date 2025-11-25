const mongoose = require("mongoose");

const userAccessSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  routes: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model("UserAccess", userAccessSchema);

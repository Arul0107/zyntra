const Credential = require("../models/Credential");

// CREATE
exports.createCredential = async (req, res) => {
  try {
    const data = await Credential.create(req.body);
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET BY USER
exports.getUserCredentials = async (req, res) => {
  try {
    const creds = await Credential.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(creds);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// UPDATE
exports.updateCredential = async (req, res) => {
  try {
    const updated = await Credential.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE
exports.deleteCredential = async (req, res) => {
  try {
    await Credential.findByIdAndDelete(req.params.id);
    res.json({ message: "Credential deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

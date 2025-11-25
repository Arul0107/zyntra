const User = require("../models/User");
const UserAccess = require("../models/UserAccess");

// Get all users + their allowed routes
exports.getAllUsersWithAccess = async (req, res) => {
  try {
    const users = await User.find().select("_id name role");
    const accessData = await UserAccess.find();

    const response = users.map(u => {
      const item = accessData.find(a => a.userId?.toString() === u._id.toString());
      return {
        user: u,
        allowedRoutes: item ? item.routes : []
      };
    });

    res.json(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update user’s allowed route list
exports.updateUserAccess = async (req, res) => {
  try {
    const { userId, allowedRoutes } = req.body;

    let record = await UserAccess.findOne({ userId });

    if (!record) {
      record = new UserAccess({ userId, routes: allowedRoutes });
    } else {
      record.routes = allowedRoutes;
    }

    await record.save();

    res.json({ success: true, message: "Permissions Updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get logged-in user’s access
exports.getMyAccess = async (req, res) => {
  try {
    // Support both id formats from JWT
    const userId = req.user.id || req.user._id;

    if (!userId) {
      return res.json([]);
    }

    // Load access record
    const record = await UserAccess.findOne({ userId });

    res.json(record ? record.routes : []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

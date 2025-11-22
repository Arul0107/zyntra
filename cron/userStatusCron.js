// cron/userStatusCron.js
const cron = require("node-cron");
const User = require("../models/User");
const dayjs = require("dayjs");

// Auto mark offline after 5 minutes inactivity
module.exports = () => {
  // Runs every 5 minutes → "*/5 * * * *"
  cron.schedule("*/5 * * * *", async () => {
    try {
      const fiveMinAgo = dayjs().subtract(5, "minute").toDate();

      const usersToOffline = await User.find({
        lastActiveAt: { $lt: fiveMinAgo },
        presence: { $ne: "offline" }
      });

      if (usersToOffline.length > 0) {
        for (const user of usersToOffline) {
          const previousPresence = user.presence;

          await User.findByIdAndUpdate(user._id, {
            presence: "offline",
            previousPresence,
          });

          if (global._io) {
            global._io.emit("presence_updated", {
              userId: user._id.toString(),
              presence: "offline",
              previousPresence,
              lastActiveAt: user.lastActiveAt
            });
          }
        }
      }

      console.log(
        "⏳ Auto offline cron triggered (5 min):",
        usersToOffline.length,
        "users changed"
      );
    } catch (err) {
      console.error("Cron error:", err.message);
    }
  });
};

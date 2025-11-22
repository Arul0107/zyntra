const cron = require("node-cron");
const User = require("../models/User");
const dayjs = require("dayjs");

// Auto mark offline after 1 minute inactivity (FOR TESTING)
module.exports = () => {
  cron.schedule("*/1 * * * *", async () => {
    try {
      const oneMinAgo = dayjs().subtract(1, "minute").toDate();

      await User.updateMany(
        { lastActiveAt: { $lt: oneMinAgo }, presence: { $ne: "offline" } },
        { presence: "offline" }
      );

      console.log("⏳ Auto offline test cron triggered");
    } catch (err) {
      console.error("Cron error:", err.message);
    }
  });
};

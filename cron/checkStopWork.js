const cron = require("node-cron");
const WorkSession = require("../models/WorkSession");
const Notification = require("../models/Notification");
const dayjs = require("dayjs");

module.exports = () => {
  // Run everyday at 7:00 PM
  cron.schedule("0 19 * * *", async () => {
    console.log("🔎 Checking employees who didn’t stop work...");

    const todayStart = dayjs().startOf("day").toDate();
    const todayEnd = dayjs().endOf("day").toDate();

    const runningSessions = await WorkSession.find({
      logoutTime: null,
      loginTime: { $gte: todayStart, $lte: todayEnd }
    });

    for (const session of runningSessions) {
      await Notification.create({
        userId: session.userId,
        message: "Your shift ended at 7PM. Please stop work or extend time.",
        type: "STOP_WORK_WARNING",
        itemId: session._id
      });
    }

    console.log(`🚨 Warning notifications sent: ${runningSessions.length}`);
  });
};

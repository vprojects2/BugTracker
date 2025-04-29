// utils/logActivity.js
const logActivity = (bugDoc, { action, message, userId }) => {
    bugDoc.activityLogs.push({
      action,
      message,
      user: userId,
      createdAt: new Date()
    });
  };
  module.exports = logActivity;
  
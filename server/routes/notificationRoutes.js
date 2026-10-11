const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { getStore } = require('../services/dataStore');

router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { isDb, Notification, mem } = getStore();

    if (isDb) {
      const notifications = await Notification.find({ recipientId: userId }).sort({ createdAt: -1 });
      return res.json({ success: true, notifications });
    } else {
      const notifs = mem.notifications.filter(n => n.recipientId.toString() === userId.toString());
      return res.json({ success: true, notifications: notifs });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch notifications.' });
  }
});

router.put('/:id/read', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { isDb, Notification, mem } = getStore();

    if (isDb) {
      await Notification.findByIdAndUpdate(id, { isRead: true });
    } else {
      const n = mem.notifications.find(notif => notif._id.toString() === id.toString());
      if (n) n.isRead = true;
    }
    res.json({ success: true, message: 'Notification marked as read.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update notification.' });
  }
});

module.exports = router;

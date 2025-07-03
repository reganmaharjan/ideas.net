import { Router } from 'express';

const router = Router();

// Get user notifications
router.get('/', async (req, res) => {
  res.json({ message: 'Get notifications' });
});

// Mark notification as read
router.put('/:id/read', async (req, res) => {
  res.json({ message: 'Mark notification as read' });
});

// Mark all notifications as read
router.put('/read-all', async (req, res) => {
  res.json({ message: 'Mark all notifications as read' });
});

export default router; 
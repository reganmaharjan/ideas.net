import { Router } from 'express';

const router = Router();

// Get conversations
router.get('/conversations', async (req, res) => {
  res.json({ message: 'Get conversations' });
});

// Get messages with user
router.get('/user/:userId', async (req, res) => {
  res.json({ message: 'Get messages with user' });
});

// Send message
router.post('/', async (req, res) => {
  res.json({ message: 'Send message' });
});

// Mark messages as read
router.put('/read/:userId', async (req, res) => {
  res.json({ message: 'Mark messages as read' });
});

export default router; 
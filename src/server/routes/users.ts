import { Router } from 'express';
import { AuthRequest } from '../../types';

const router = Router();

// Get current user profile
router.get('/me', async (req: any, res) => {
  res.json({ user: req.user });
});

// Get user by username
router.get('/:username', async (req, res) => {
  res.json({ message: 'Get user by username' });
});

// Update user profile
router.put('/me', async (req: any, res) => {
  res.json({ message: 'Update user profile' });
});

export default router; 
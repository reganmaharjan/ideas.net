import { Router } from 'express';

const router = Router();

// Get comments for an idea
router.get('/idea/:ideaId', async (req, res) => {
  res.json({ message: 'Get comments for idea' });
});

// Create comment
router.post('/', async (req, res) => {
  res.json({ message: 'Create comment' });
});

// Update comment
router.put('/:id', async (req, res) => {
  res.json({ message: 'Update comment' });
});

// Delete comment
router.delete('/:id', async (req, res) => {
  res.json({ message: 'Delete comment' });
});

export default router; 
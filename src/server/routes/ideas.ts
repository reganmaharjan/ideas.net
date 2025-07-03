import { Router } from 'express';
import { prisma } from '../../utils/database';
import { authMiddleware } from '../../middleware/auth';
import slugify from 'slugify';
import { AuthRequest } from '../../types';

const router = Router();

// Get all ideas
router.get('/', async (req, res) => {
  try {
    const ideas = await prisma.idea.findMany({
      where: { isPublic: true },
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { id: true, username: true, firstName: true, lastName: true, avatar: true } },
      },
    });
    res.json(ideas);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ideas' });
  }
});

// Get idea by slug
router.get('/:slug', async (req, res) => {
  try {
    const idea = await prisma.idea.findUnique({
      where: { slug: req.params.slug },
      include: {
        author: { select: { id: true, username: true, firstName: true, lastName: true, avatar: true } },
        comments: true,
      },
    });
    if (!idea || !idea.isPublic) {
      return res.status(404).json({ error: 'Idea not found' });
    }
    return res.json(idea);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch idea' });
  }
});

// Create new idea
router.post('/', authMiddleware, async (req: any, res) => {
  try {
    const { title, description, problem, solution, targetMarket, businessModel, tags, industry, technology, isPublic } = req.body;
    if (!title || !description || !problem || !solution) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const slug = slugify(title, { lower: true, strict: true }) + '-' + Math.random().toString(36).substring(2, 7);
    const idea = await prisma.idea.create({
      data: {
        title,
        slug,
        description,
        problem,
        solution,
        targetMarket,
        businessModel,
        tags: tags ? tags.split(',').map((t: string) => t.trim()) : [],
        industry,
        technology,
        isPublic: isPublic !== undefined ? isPublic : true,
        authorId: req.user!.id,
      },
    });
    return res.status(201).json(idea);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create idea' });
  }
});

// Update idea
router.put('/:id', authMiddleware, async (req: any, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.idea.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Idea not found' });
    }
    if (existing.authorId !== req.user!.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    const { title, description, problem, solution, targetMarket, businessModel, tags, industry, technology, isPublic } = req.body;
    let slug = existing.slug;
    if (title && title !== existing.title) {
      slug = slugify(title, { lower: true, strict: true }) + '-' + Math.random().toString(36).substring(2, 7);
    }
    const updated = await prisma.idea.update({
      where: { id },
      data: {
        title,
        slug,
        description,
        problem,
        solution,
        targetMarket,
        businessModel,
        tags: tags ? tags.split(',').map((t: string) => t.trim()) : [],
        industry,
        technology,
        isPublic,
      },
    });
    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update idea' });
  }
});

// Delete idea
router.delete('/:id', authMiddleware, async (req: any, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.idea.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Idea not found' });
    }
    if (existing.authorId !== req.user!.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    await prisma.idea.delete({ where: { id } });
    return res.json({ message: 'Idea deleted' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete idea' });
  }
});

export default router; 
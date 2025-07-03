"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../../utils/database");
const auth_1 = require("../../middleware/auth");
const slugify_1 = __importDefault(require("slugify"));
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    try {
        const ideas = await database_1.prisma.idea.findMany({
            where: { isPublic: true },
            orderBy: { createdAt: 'desc' },
            include: {
                author: { select: { id: true, username: true, firstName: true, lastName: true, avatar: true } },
            },
        });
        res.json(ideas);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch ideas' });
    }
});
router.get('/:slug', async (req, res) => {
    try {
        const idea = await database_1.prisma.idea.findUnique({
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
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to fetch idea' });
    }
});
router.post('/', auth_1.authMiddleware, async (req, res) => {
    try {
        const { title, description, problem, solution, targetMarket, businessModel, tags, industry, technology, isPublic } = req.body;
        if (!title || !description || !problem || !solution) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const slug = (0, slugify_1.default)(title, { lower: true, strict: true }) + '-' + Math.random().toString(36).substring(2, 7);
        const idea = await database_1.prisma.idea.create({
            data: {
                title,
                slug,
                description,
                problem,
                solution,
                targetMarket,
                businessModel,
                tags: tags ? tags.split(',').map((t) => t.trim()) : [],
                industry,
                technology,
                isPublic: isPublic !== undefined ? isPublic : true,
                authorId: req.user.id,
            },
        });
        return res.status(201).json(idea);
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to create idea' });
    }
});
router.put('/:id', auth_1.authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const existing = await database_1.prisma.idea.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ error: 'Idea not found' });
        }
        if (existing.authorId !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized' });
        }
        const { title, description, problem, solution, targetMarket, businessModel, tags, industry, technology, isPublic } = req.body;
        let slug = existing.slug;
        if (title && title !== existing.title) {
            slug = (0, slugify_1.default)(title, { lower: true, strict: true }) + '-' + Math.random().toString(36).substring(2, 7);
        }
        const updated = await database_1.prisma.idea.update({
            where: { id },
            data: {
                title,
                slug,
                description,
                problem,
                solution,
                targetMarket,
                businessModel,
                tags: tags ? tags.split(',').map((t) => t.trim()) : [],
                industry,
                technology,
                isPublic,
            },
        });
        return res.json(updated);
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to update idea' });
    }
});
router.delete('/:id', auth_1.authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const existing = await database_1.prisma.idea.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ error: 'Idea not found' });
        }
        if (existing.authorId !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized' });
        }
        await database_1.prisma.idea.delete({ where: { id } });
        return res.json({ message: 'Idea deleted' });
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to delete idea' });
    }
});
exports.default = router;
//# sourceMappingURL=ideas.js.map
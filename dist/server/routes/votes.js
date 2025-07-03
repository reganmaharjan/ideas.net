"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../../utils/database");
const auth_1 = require("../../middleware/auth");
const router = (0, express_1.Router)();
router.post('/idea/:ideaId', auth_1.authMiddleware, async (req, res) => {
    try {
        const { ideaId } = req.params;
        const { type } = req.body;
        if (!['UPVOTE', 'INVEST_INTEREST', 'WOULD_USE', 'WOULD_PAY', 'DOWNVOTE'].includes(type)) {
            return res.status(400).json({ error: 'Invalid vote type' });
        }
        const existing = await database_1.prisma.vote.findUnique({
            where: {
                userId_ideaId_type: {
                    userId: req.user.id,
                    ideaId,
                    type,
                },
            },
        });
        if (existing) {
            return res.status(400).json({ error: 'Already voted' });
        }
        await database_1.prisma.vote.create({
            data: {
                userId: req.user.id,
                ideaId,
                type,
            },
        });
        let field = '';
        if (type === 'UPVOTE')
            field = 'upvoteCount';
        if (type === 'INVEST_INTEREST')
            field = 'investInterestCount';
        if (type === 'WOULD_USE')
            field = 'wouldUseCount';
        if (type === 'WOULD_PAY')
            field = 'wouldPayCount';
        if (type === 'DOWNVOTE')
            field = 'downvoteCount';
        if (field) {
            await database_1.prisma.idea.update({
                where: { id: ideaId },
                data: { [field]: { increment: 1 } },
            });
        }
        return res.json({ message: 'Vote added' });
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to vote' });
    }
});
router.post('/comment/:commentId', async (req, res) => {
    return res.json({ message: 'Vote on comment' });
});
router.delete('/idea/:ideaId', auth_1.authMiddleware, async (req, res) => {
    try {
        const { ideaId } = req.params;
        const { type } = req.body;
        const existing = await database_1.prisma.vote.findUnique({
            where: {
                userId_ideaId_type: {
                    userId: req.user.id,
                    ideaId,
                    type,
                },
            },
        });
        if (!existing) {
            return res.status(404).json({ error: 'Vote not found' });
        }
        await database_1.prisma.vote.delete({
            where: { id: existing.id },
        });
        let field = '';
        if (type === 'UPVOTE')
            field = 'upvoteCount';
        if (type === 'INVEST_INTEREST')
            field = 'investInterestCount';
        if (type === 'WOULD_USE')
            field = 'wouldUseCount';
        if (type === 'WOULD_PAY')
            field = 'wouldPayCount';
        if (type === 'DOWNVOTE')
            field = 'downvoteCount';
        if (field) {
            await database_1.prisma.idea.update({
                where: { id: ideaId },
                data: { [field]: { decrement: 1 } },
            });
        }
        return res.json({ message: 'Vote removed' });
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to remove vote' });
    }
});
exports.default = router;
//# sourceMappingURL=votes.js.map
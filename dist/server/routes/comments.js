"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/idea/:ideaId', async (req, res) => {
    res.json({ message: 'Get comments for idea' });
});
router.post('/', async (req, res) => {
    res.json({ message: 'Create comment' });
});
router.put('/:id', async (req, res) => {
    res.json({ message: 'Update comment' });
});
router.delete('/:id', async (req, res) => {
    res.json({ message: 'Delete comment' });
});
exports.default = router;
//# sourceMappingURL=comments.js.map
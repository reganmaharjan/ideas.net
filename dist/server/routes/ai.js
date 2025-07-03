"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post('/summarize/:ideaId', async (req, res) => {
    res.json({ message: 'Generate discussion summary' });
});
router.post('/brainstorm', async (req, res) => {
    res.json({ message: 'AI brainstorming assistance' });
});
router.post('/validate', async (req, res) => {
    res.json({ message: 'AI idea validation' });
});
exports.default = router;
//# sourceMappingURL=ai.js.map
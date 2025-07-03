"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/conversations', async (req, res) => {
    res.json({ message: 'Get conversations' });
});
router.get('/user/:userId', async (req, res) => {
    res.json({ message: 'Get messages with user' });
});
router.post('/', async (req, res) => {
    res.json({ message: 'Send message' });
});
router.put('/read/:userId', async (req, res) => {
    res.json({ message: 'Mark messages as read' });
});
exports.default = router;
//# sourceMappingURL=messages.js.map
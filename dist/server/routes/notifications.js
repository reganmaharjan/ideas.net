"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    res.json({ message: 'Get notifications' });
});
router.put('/:id/read', async (req, res) => {
    res.json({ message: 'Mark notification as read' });
});
router.put('/read-all', async (req, res) => {
    res.json({ message: 'Mark all notifications as read' });
});
exports.default = router;
//# sourceMappingURL=notifications.js.map
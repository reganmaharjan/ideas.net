"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/me', async (req, res) => {
    res.json({ user: req.user });
});
router.get('/:username', async (req, res) => {
    res.json({ message: 'Get user by username' });
});
router.put('/me', async (req, res) => {
    res.json({ message: 'Update user profile' });
});
exports.default = router;
//# sourceMappingURL=users.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const passport_1 = __importDefault(require("passport"));
const database_1 = require("../../utils/database");
const errorHandler_1 = require("../../middleware/errorHandler");
const jwt_1 = require("../../utils/jwt");
const router = (0, express_1.Router)();
router.post('/register', async (req, res, next) => {
    try {
        const { email, username, firstName, lastName, password, role } = req.body;
        const existingUser = await database_1.prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { username }
                ]
            }
        });
        if (existingUser) {
            return res.status(400).json({
                error: 'User with this email or username already exists'
            });
        }
        const saltRounds = 12;
        const hashedPassword = await bcryptjs_1.default.hash(password, saltRounds);
        const user = await database_1.prisma.user.create({
            data: {
                email,
                username,
                firstName,
                lastName,
                password: hashedPassword,
                role: role || 'ENTHUSIAST'
            },
            select: {
                id: true,
                email: true,
                username: true,
                firstName: true,
                lastName: true,
                role: true,
                isVerified: true
            }
        });
        const token = (0, jwt_1.signJWT)({ userId: user.id });
        return res.status(201).json({
            message: 'User registered successfully',
            user,
            token
        });
    }
    catch (error) {
        return next((0, errorHandler_1.createError)('Registration failed', 500));
    }
});
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await database_1.prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                username: true,
                firstName: true,
                lastName: true,
                role: true,
                isVerified: true,
                password: true
            }
        });
        if (!user) {
            return res.status(401).json({
                error: 'Invalid email or password'
            });
        }
        const isValidPassword = await bcryptjs_1.default.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                error: 'Invalid email or password'
            });
        }
        await database_1.prisma.user.update({
            where: { id: user.id },
            data: { lastActive: new Date() }
        });
        const token = (0, jwt_1.signJWT)({ userId: user.id });
        const { password: _, ...userWithoutPassword } = user;
        return res.json({
            message: 'Login successful',
            user: userWithoutPassword,
            token
        });
    }
    catch (error) {
        return next((0, errorHandler_1.createError)('Login failed', 500));
    }
});
router.get('/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport_1.default.authenticate('google', { failureRedirect: '/login' }), async (req, res) => {
    try {
        const user = req.user;
        const token = (0, jwt_1.signJWT)({ userId: user.id });
        res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
    }
    catch (error) {
        res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_failed`);
    }
});
router.get('/linkedin', passport_1.default.authenticate('linkedin', { scope: ['r_emailaddress', 'r_liteprofile'] }));
router.get('/linkedin/callback', passport_1.default.authenticate('linkedin', { failureRedirect: '/login' }), async (req, res) => {
    try {
        const user = req.user;
        const token = (0, jwt_1.signJWT)({ userId: user.id });
        res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
    }
    catch (error) {
        res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_failed`);
    }
});
router.get('/verify', async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        const decoded = (0, jwt_1.verifyJWT)(token);
        const user = await database_1.prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                email: true,
                username: true,
                firstName: true,
                lastName: true,
                role: true,
                isVerified: true
            }
        });
        if (!user) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        return res.json({ user });
    }
    catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map
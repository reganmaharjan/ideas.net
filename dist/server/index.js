"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const ideas_1 = __importDefault(require("./routes/ideas"));
const comments_1 = __importDefault(require("./routes/comments"));
const votes_1 = __importDefault(require("./routes/votes"));
const notifications_1 = __importDefault(require("./routes/notifications"));
const messages_1 = __importDefault(require("./routes/messages"));
const ai_1 = __importDefault(require("./routes/ai"));
const errorHandler_1 = require("../middleware/errorHandler");
const auth_2 = require("../middleware/auth");
const logger_1 = require("../utils/logger");
const database_1 = require("../utils/database");
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.app = app;
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});
exports.io = io;
const PORT = process.env.PORT || 3001;
const limiter = (0, express_rate_limit_1.default)({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    message: 'Too many requests from this IP, please try again later.'
});
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(limiter);
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});
app.use('/api/auth', auth_1.default);
app.use('/api/users', auth_2.authMiddleware, users_1.default);
app.use('/api/ideas', ideas_1.default);
app.use('/api/comments', auth_2.authMiddleware, comments_1.default);
app.use('/api/votes', auth_2.authMiddleware, votes_1.default);
app.use('/api/notifications', auth_2.authMiddleware, notifications_1.default);
app.use('/api/messages', auth_2.authMiddleware, messages_1.default);
app.use('/api/ai', auth_2.authMiddleware, ai_1.default);
io.on('connection', (socket) => {
    logger_1.logger.info(`User connected: ${socket.id}`);
    socket.on('join-idea', (ideaId) => {
        socket.join(`idea-${ideaId}`);
        logger_1.logger.info(`User ${socket.id} joined idea room: ${ideaId}`);
    });
    socket.on('leave-idea', (ideaId) => {
        socket.leave(`idea-${ideaId}`);
        logger_1.logger.info(`User ${socket.id} left idea room: ${ideaId}`);
    });
    socket.on('new-comment', (data) => {
        socket.to(`idea-${data.ideaId}`).emit('comment-added', data);
    });
    socket.on('new-vote', (data) => {
        socket.to(`idea-${data.ideaId}`).emit('vote-updated', data);
    });
    socket.on('disconnect', () => {
        logger_1.logger.info(`User disconnected: ${socket.id}`);
    });
});
app.use(errorHandler_1.errorHandler);
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route not found',
        path: req.originalUrl
    });
});
process.on('SIGTERM', async () => {
    logger_1.logger.info('SIGTERM received, shutting down gracefully');
    await database_1.prisma.$disconnect();
    server.close(() => {
        logger_1.logger.info('Server closed');
        process.exit(0);
    });
});
process.on('SIGINT', async () => {
    logger_1.logger.info('SIGINT received, shutting down gracefully');
    await database_1.prisma.$disconnect();
    server.close(() => {
        logger_1.logger.info('Server closed');
        process.exit(0);
    });
});
server.listen(PORT, () => {
    logger_1.logger.info(`🚀 Ideas.net server running on port ${PORT}`);
    logger_1.logger.info(`📊 Environment: ${process.env.NODE_ENV}`);
    logger_1.logger.info(`🔗 Health check: http://localhost:${PORT}/health`);
});
//# sourceMappingURL=index.js.map
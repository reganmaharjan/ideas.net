"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWT = exports.signJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signJWT = (payload, expiresIn) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET not configured');
    }
    return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
        expiresIn: expiresIn || process.env.JWT_EXPIRES_IN || '7d'
    });
};
exports.signJWT = signJWT;
const verifyJWT = (token) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET not configured');
    }
    return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
};
exports.verifyJWT = verifyJWT;
//# sourceMappingURL=jwt.js.map
import { Request } from 'express';
export interface JwtPayload {
    userId: string;
    iat?: number;
    exp?: number;
}
export interface AuthUser {
    id: string;
    email: string;
    username: string;
    role: string;
    isVerified: boolean;
}
export interface AuthRequest extends Request {
    user?: AuthUser;
}
//# sourceMappingURL=index.d.ts.map
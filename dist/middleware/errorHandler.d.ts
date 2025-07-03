import { Request, Response, NextFunction } from 'express';
export interface AppError extends Error {
    statusCode?: number;
    isOperational?: boolean;
}
export declare const errorHandler: (error: AppError, req: Request, res: Response, next: NextFunction) => void;
export declare const createError: (message: string, statusCode?: number) => AppError;
export interface AuthUser {
    id: string;
    email: string;
    username: string;
    role: string;
}
export interface AuthRequest extends Request {
    user?: AuthUser;
}
//# sourceMappingURL=errorHandler.d.ts.map
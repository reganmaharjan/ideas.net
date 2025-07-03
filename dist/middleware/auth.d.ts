import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
export { AuthRequest, JwtPayload } from '../types';
export declare const authMiddleware: (req: any, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export declare const optionalAuthMiddleware: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=auth.d.ts.map
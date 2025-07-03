import { JwtPayload } from '../types';
export declare const signJWT: (payload: {
    userId: string;
}, expiresIn?: string) => string;
export declare const verifyJWT: (token: string) => JwtPayload;
//# sourceMappingURL=jwt.d.ts.map
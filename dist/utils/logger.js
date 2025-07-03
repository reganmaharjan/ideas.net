"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
exports.logger = {
    info: (message, meta) => {
        console.log(`[INFO] ${new Date().toISOString()}: ${message}`, meta || '');
    },
    error: (message, error) => {
        console.error(`[ERROR] ${new Date().toISOString()}: ${message}`, error || '');
    },
    warn: (message, meta) => {
        console.warn(`[WARN] ${new Date().toISOString()}: ${message}`, meta || '');
    },
    debug: (message, meta) => {
        if (process.env.NODE_ENV === 'development') {
            console.debug(`[DEBUG] ${new Date().toISOString()}: ${message}`, meta || '');
        }
    }
};
//# sourceMappingURL=logger.js.map
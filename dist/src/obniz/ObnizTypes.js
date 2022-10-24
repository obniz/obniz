"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isObnizId = void 0;
const isObnizId = (arg) => {
    if (typeof arg === 'string') {
        return !!/^\d{4}-\d{4}$/.test(arg);
    }
    return false;
};
exports.isObnizId = isObnizId;

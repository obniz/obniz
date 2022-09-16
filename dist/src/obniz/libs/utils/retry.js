"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retry = void 0;
const retry = async (times, f, onFail) => {
    let error = new Error(`Failed ${times} times`); // will be not use
    for (let i = 0; i < times; i++) {
        try {
            return await f();
        }
        catch (e) {
            error = e;
            if (onFail) {
                await onFail(error);
            }
        }
    }
    throw error;
};
exports.retry = retry;

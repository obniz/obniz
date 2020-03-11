"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @packageDocumentation
 * @ignore
 */
const BleHelper = {
    uuidFilter(uuid) {
        return uuid.toLowerCase().replace(/[^0-9abcdef]/g, "");
    },
};
exports.default = BleHelper;
//# sourceMappingURL=bleHelper.js.map
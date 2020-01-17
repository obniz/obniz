"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BleHelper = {
    uuidFilter(uuid) {
        return uuid.toLowerCase().replace(/[^0-9abcdef]/g, "");
    },
};
exports.default = BleHelper;

//# sourceMappingURL=bleHelper.js.map

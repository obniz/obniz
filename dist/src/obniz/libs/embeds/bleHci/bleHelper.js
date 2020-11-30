"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BleHelper = {
    uuidFilter(uuid) {
        return uuid.toLowerCase().replace(/[^0-9abcdef]/g, "");
    },
    toCamelCase(str) {
        str = str.charAt(0).toLowerCase() + str.slice(1);
        return str.replace(/[-_](.)/g, (match, group1) => {
            return group1.toUpperCase();
        });
    },
    toSnakeCase(str) {
        const camel = this.toCamelCase(str);
        return camel.replace(/[A-Z]/g, (s) => {
            return "_" + s.charAt(0).toLowerCase();
        });
    },
};
exports.default = BleHelper;

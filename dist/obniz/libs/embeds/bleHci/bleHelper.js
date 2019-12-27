"use strict";
const BleHelper = {
    uuidFilter: function (uuid) {
        return uuid.toLowerCase().replace(/[^0-9abcdef]/g, '');
    },
    toCamelCase: function (str) {
        str = str.charAt(0).toLowerCase() + str.slice(1);
        return str.replace(/[-_](.)/g, function (match, group1) {
            return group1.toUpperCase();
        });
    },
    toSnakeCase: function (str) {
        let camel = this.toCamelCase(str);
        return camel.replace(/[A-Z]/g, function (s) {
            return '_' + s.charAt(0).toLowerCase();
        });
    },
};
module.exports = BleHelper;

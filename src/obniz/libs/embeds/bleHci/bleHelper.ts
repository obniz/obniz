const BleHelper: any = {
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
    const camel: any = this.toCamelCase(str);
    return camel.replace(/[A-Z]/g, (s) => {
      return "_" + s.charAt(0).toLowerCase();
    });
  },
};

module.exports = BleHelper;

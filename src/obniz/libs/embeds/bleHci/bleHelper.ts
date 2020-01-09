const BleHelper: any = {
  uuidFilter(uuid: any) {
    return uuid.toLowerCase().replace(/[^0-9abcdef]/g, "");
  },

  toCamelCase(str: any) {
    str = str.charAt(0).toLowerCase() + str.slice(1);
    return str.replace(/[-_](.)/g, (match: any, group1: any ) => {
      return group1.toUpperCase();
    });
  },

  toSnakeCase(str: any) {
    const camel: any = this.toCamelCase(str);
    return camel.replace(/[A-Z]/g, (s: any ) => {
      return "_" + s.charAt(0).toLowerCase();
    });
  },
};

export default BleHelper;

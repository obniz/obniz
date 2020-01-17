const BleHelper: any = {
  uuidFilter(uuid: any) {
    return uuid.toLowerCase().replace(/[^0-9abcdef]/g, "");
  },
};

export default BleHelper;

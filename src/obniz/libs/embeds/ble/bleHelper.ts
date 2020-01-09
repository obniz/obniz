const BleHelper: any = {
  uuidFilter(uuid) {
    return uuid.toLowerCase().replace(/[^0-9abcdef]/g, "");
  },
};

export default BleHelper;

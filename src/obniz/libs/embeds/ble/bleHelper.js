const BleHelper = {
  uuidFilter: function(uuid) {
    return uuid.toLowerCase().replace(/[^0-9abcdef]/g, '');
  },
};

module.exports = BleHelper;

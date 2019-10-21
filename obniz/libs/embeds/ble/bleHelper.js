const BleHelper = {
  uuidFilter: function(uuid) {
    return uuid.toLowerCase().replace(/[^0-9abcdef]/g, '');
  },
  ieee754Converter: function(data, signlen, explen, fraclen) {
    let sgn = signlen ? (data >>> 11) & 0b1 : 0; // sign
    let max = Math.pow(2, explen) - 1; // maximum of exponent
    let exp = (data >>> fraclen) & max; // exponent
    let fra = 0; // fraction
    for (let i = 0; i < fraclen; i++) {
      if ((data >>> (fraclen - i - 1)) & 0b1) {
        fra += Math.pow(2, -(i + 1));
      }
    }
    if (exp === 0 && fra === 0) {
      return 0;
    } else if (exp === 0 && fra !== 0) {
      let m = Math.pow(2, explen - 1) - 1; // median (7 or 15)
      let v = Math.pow(-1, sgn) * fra * Math.pow(2, 1 - m);
      return v;
    } else if (exp >= 1 && exp <= max - 1) {
      let m = Math.pow(2, explen - 1) - 1; // median (7 or 15)
      let v = Math.pow(-1, sgn) * (1 + fra) * Math.pow(2, exp - m);
      return v;
    } else if (exp === max && fra === 0) {
      return Infinity;
    } else {
      return NaN;
    }
  },
};

module.exports = BleHelper;

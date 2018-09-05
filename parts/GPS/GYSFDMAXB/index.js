class GYSFDMAXB {
  constructor() {
    this.keys = ['vcc', 'txd', 'rxd', 'gnd', 'Opps'];
    this.requiredKeys = ['txd', 'rxd'];

    this.ioKeys = this.keys;
    this.displayName = 'gps';
    this.displayIoNames = { txd:'txd', rxd:'rxd', Opps:'1pps' };
  }

  static info() {
    return {
      name: 'GYSFDMAXB',
    };
  }

  wired(obniz) {
    this.obniz = obniz;
    this.tx = this.params.txd;
    this.rx = this.params.rxd;
    this.vcc = this.params.vcc;
    this.gnd = this.params.gnd;
    this.Opps = this.params.Opps;

    this.obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
    this.uart = obniz.getFreeUart();
    this.uart.start({tx: this.params.txd, rx: this.params.rxd, baud:9600, drive:"3v"});

    this.editedData = {};
    this.editedData.enable = false;
    this.editedData.GPGSV = new Array(4);
    
    this.on1pps = null;
    this.last1pps = 0; 
  }
  
  start1pps(callback) {
    this.on1pps = callback;
    if (callback) {
      this.last1pps = 2;
      this.obniz.getAD(this.Opps).self = this;
      this.obniz.getAD(this.Opps).start(function(voltage) {
        let vol = Math.round(voltage);
        if (vol != this.self.last1pps) {
          this.self.last1pps = vol;
          if ((vol == 0) && this.self.on1pps) { this.self.on1pps(); }
        }
      });
    } else {
      this.obniz.getAD(this.Opps).end();
    }
  }

  readSentence() {
    let results = [];
    if (this.uart.isDataExists()) {
      let pos = this.uart.received.indexOf(0x0A);
      if (pos >= 0) {
        results = this.uart.received.slice(0, pos-1);
        this.uart.received.splice(0, pos+1);
        return this.uart.tryConvertString(results);
      }
    }
    return "";
  }

  getEditedData() {
    var sentence = this.readSentence();
    this.editedData.enable = false;
    while (sentence.length > 0) {
      let part = sentence.split(",");
      if (sentence.slice(-4, -3) != ",") {
        let st = part[part.length-1].slice(0, -3);
        part.push(part[part.length-1].slice(-3));
        part[part.length-2] = st;
      }
      this.editedData.sentence = part.join(",");
      switch (part[0]) {
      case "$GPGGA":
        this.editedData.GPGGA = part;
        break;
      case "$GPGLL":
        this.editedData.GPGLL = part;
        break;
      case "$GPGSA":
        this.editedData.GPGSA = part;
        break;
      case "$GPGSV":
        let n = Number(part[2]);
        if (n > this.editedData.GPGSV.length) {
          while (n > this.editedData.GPGSV.length) {
            this.editedData.GPGSV.push([]);
          }
        }
        this.editedData.GPGSV[n-1] = part;
        break;
      case "$GPRMC":
        this.editedData.GPRMC = part;
        break;
      case "$GPVTG":
        this.editedData.GPVTG = part;
        break;
      case "$GPZDA":
        this.editedData.GPZDA = part;
        let utc = part[4] + "/" + part[3] + "/" + part[2] + " "
          + part[1].substring(0, 2) + ":" + part[1].substring(2, 4) + ":" + part[1].substring(4, 6) + " +00:00";
        this.editedData.timestamp = new Date(utc);
        break;
      default:
        let format = part[0].substr(1);
        this.editedData[format] = part;
      }

      this.editedData.enable = true;
      sentence = this.readSentence();
    }
    return this.editedData;
  }

  // NMEAの緯度経度を「度分秒(DMS)」の文字列に変換
  static nmea2dms(v) {
    let val = Number(v);
    let d = Math.floor(val / 100);
    let m = Math.floor(((val / 100.0) - d) * 100.0);
    let s = ((((val / 100.0) - d) * 100.0) - m) * 60;
    return d + "°" + m + "'" + s.toFixed(1) + '"';
  }

  // NMEAの緯度経度を「度分(DM)」の文字列に変換
  static nmea2dm(v) {
    let val = Number(v);
    let d = Math.floor(val / 100.0);
    let m = ((val / 100.0) - d) * 100.0;
    return d + "°" + m.toFixed(4) + "'";
  }

  // NMEAの緯度経度を「度(DD)」の文字列に変換
  static nmea2dd(v) {
    let val = Number(v);
    let d = Math.floor(val / 100.0);
    let m = Math.floor((((val / 100.0) - d) * 100.0) / 60);
    let s = (((((val / 100.0) - d) * 100.0) - m) * 60) / (60 * 60);
    return (d + m + s).toFixed(6);
  }

  // NMEAの緯度経度を「秒(S)」の数値に変換
  static nmea2s(v) {
    let val = Number(v);
    let d = Math.floor(val / 100.0);
    let m = Math.floor((((val / 100.0) - d) * 100.0) / 60);
    let s = (((((val / 100.0) - d) * 100.0) - m) * 60) / (60 * 60);
    return (d + m + s) / (1.0 / 60.0 / 60.0);
  }

}

if (typeof module === 'object') {
  module.exports = GYSFDMAXB;
}

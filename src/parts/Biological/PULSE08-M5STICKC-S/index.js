class Puls08M5stickcS {
  constructor() {
    this.keys = ['vcc', 'gnd', 'tx', 'rx'];
    this.requiredKeys = ['tx', 'rx'];
    this.delimiter = 0x0a;
  }

  static info() {
    return {
      name: 'Puls08M5stickcS',
    };
  }

  onbpmupdate(data) {
    return;
  }

  onrawupdate(data) {
    return;
  }

  wired(obniz) {
    this.obniz = obniz;

    obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
    this.uart = obniz.getFreeUart();
    this.uart.start({ tx: this.params.tx, rx: this.params.rx, baud: 19200 });
    this.receivingData = [];

    this.init();

    this.uart.onreceive = (data, text) => {
      let dataToCallback = [];
      data.forEach(e => {
        if (e !== this.delimiter) {
          this.receivingData.push(e);
          return;
        } else {
          let row = this.receivingData;
          if (row[0] === '#'.charCodeAt(0)) {
            row[0] = ' '.charCodeAt(0);
            let str = this.decode(row);
            let val = parseInt(str);
            let bpm = val > 0 ? 60000 / val : null;
            this.onbpmupdate(bpm);
          } else {
            let str = this.decode(row);
            let val = parseInt(str);
            dataToCallback.push(val);
          }
          this.receivingData = [];
        }
      });
      if (dataToCallback.length > 0) {
        this.onrawupdate(dataToCallback);
      }
    };
  }

  decode(data) {
    return Buffer.from(data).toString('utf8');

    // if (typeof TextDecoder !== 'undefined') {
    //   let enc = new TextDecoder('utf-8');
    //   let arr = new Uint8Array(data);
    //   return enc.decode(arr);
    // } else if (typeof Buffer !== 'undefined') {
    // return Buffer.from(data).toString('utf8');
    // }
    // throw new Error('cannot decode');
  }

  init() {
    this.uart.send('@OF30');
    this.uart.send(0x0a);
    this.uart.send('@RG2');
    this.uart.send(0x0a);
  }
}

if (typeof module === 'object') {
  module.exports = Puls08M5stickcS;
}

class Puls08M5stickcS {

  public static info() {
    return {
      name: "Puls08M5stickcS",
    };
  }

  public keys: any;
  public requiredKeys: any;
  public delimiter: any;
  public obniz: any;
  public params: any;
  public uart: any;
  public receivingData: any;

  constructor() {
    this.keys = ["vcc", "gnd", "tx", "rx"];
    this.requiredKeys = ["tx", "rx"];
    this.delimiter = 0x0a;
  }

  public onbpmupdate(data: any) {
    return;
  }

  public onrawupdate(data: any) {
    return;
  }

  public wired(obniz: any) {
    this.obniz = obniz;

    obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
    this.uart = obniz.getFreeUart();
    this.uart.start({tx: this.params.tx, rx: this.params.rx, baud: 19200});
    this.receivingData = [];

    this.init();

    this.uart.onreceive = (data: any, text: any) => {
      const dataToCallback: any = [];
      data.forEach((e: any) => {
        if (e !== this.delimiter) {
          this.receivingData.push(e);
          return;
        } else {
          const row: any = this.receivingData;
          if (row[0] === "#".charCodeAt(0)) {
            row[0] = " ".charCodeAt(0);
            const str: any = this.decode(row);
            const val: any = parseInt(str);
            const bpm: any = val > 0 ? 60000 / val : null;
            this.onbpmupdate(bpm);
          } else {
            const str: any = this.decode(row);
            const val: any = parseInt(str);
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

  public decode(data: any) {
    return Buffer.from(data).toString("utf8");

    // if (typeof TextDecoder !== 'undefined') {
    //   let enc = new TextDecoder('utf-8');
    //   let arr = new Uint8Array(data);
    //   return enc.decode(arr);
    // } else if (typeof Buffer !== 'undefined') {
    // return Buffer.from(data).toString('utf8');
    // }
    // throw new Error('cannot decode');
  }

  public init() {
    this.uart.send("@OF30");
    this.uart.send(0x0a);
    this.uart.send("@RG2");
    this.uart.send(0x0a);
  }
}

if (typeof module === "object") {
  export default Puls08M5stickcS;
}

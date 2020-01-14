class _7SegmentLED_MAX7219 {

  public static info() {
    return {
      name: "7SegmentLED_MAX7219",
    };
  }

  public keys: any;
  public requiredKeys: any;
  public cs: any;
  public params: any;
  public spi: any;
  public obniz: any;
  public numOfDisp: any;
  public digits: any;

  constructor() {
    this.keys = ["vcc", "gnd", "din", "cs", "clk"];
    this.requiredKeys = ["din", "cs", "clk"];
  }

  public wired(obniz: any) {
    this.cs = obniz.getIO(this.params.cs);
    // logich high must 3.5v <=
    if (obniz.isValidIO(this.params.vcc)) {
      obniz.getIO(this.params.vcc).output(true);
    }
    if (obniz.isValidIO(this.params.gnd)) {
      obniz.getIO(this.params.gnd).output(false);
    }

    // max 10Mhz but motor driver can't
    this.params.frequency = this.params.frequency || 10 * 1000 * 1000;
    this.params.mode = "master";
    this.params.mosi = this.params.din;
    this.params.drive = "3v";
    this.spi = this.obniz.getSpiWithConfig(this.params);

    // reset a onece
    this.cs.output(true);
    this.cs.output(false);
    this.cs.output(true);
  }

  public init(numOfDisplay: any, digits: any) {
    this.numOfDisp = numOfDisplay;
    this.digits = digits;
    this.writeAllDisp([0x09, 0xff]); // Code B decode for digits 7-0
    this.writeAllDisp([0x0a, 0x05]); // brightness 11/32 0 to f
    this.writeAllDisp([0x0b, digits - 1]);
    this.writeAllDisp([0x0c, 0x01]); // Shutdown to normal operation
    this.writeAllDisp([0x0f, 0x00]);
    this.obniz.wait(10);
  }

  public clear(disp: any) {
    for (let i = 0; i < this.digits; i++) {
      this.writeOneDisp(disp, [i + 1, 0x0f]);
    }
  }

  public clearAll() {
    for (let i = 0; i < this.numOfDisp; i++) {
      for (let j = 0; j < this.digits; j++) {
        this.writeAllDisp([j + 1, 0x0f]);
      }
    }
  }

  public test() {
    this.writeAllDisp([0x0f, 0x00]); // test command
  }

  public brightness(disp: any, val: any) {
    this.writeOneDisp(disp, [0x0a, val]); // 0 to 15;
  }

  public brightnessAll(val: any) {
    this.writeAllDisp([0x0a, val]); // 0 to 15;
  }

  public writeAllDisp(data: any) {
    for (let i = 0; i < this.numOfDisp; i++) {
      this.writeOneDisp(i, data);
    }
  }

  public writeOneDisp(disp: any, data: any) {
    this.cs.output(false);
    for (let i = 0; i < disp; i++) {
      this.spi.write([0x00, 0x00]);
    }
    this.spi.write(data);
    for (let i = 0; i < this.numOfDisp - (disp + 1); i++) {
      this.spi.write([0x00, 0x00]);
    }
    this.cs.output(true);
  }

  public setNumber(disp: any, digit: any, number: any, dp: any) {
    if (digit >= 0 && digit <= this.digits - 1) {
      this.writeOneDisp(disp, [digit + 1, this.encodeBCD(number, dp)]);
    }
  }

  public encodeBCD(decimal: any, dp: any) {
    let dpreg: any;
    if (dp === true) {
      dpreg = 0x80;
    } else {
      dpreg = 0x00;
    }
    if (decimal >= 0 && decimal <= 9) {
      return decimal | dpreg;
    } else if (decimal === "-" || decimal === 10) {
      return 0x0a | dpreg;
    } else if (decimal === "e" || decimal === 11) {
      return 0x0b | dpreg;
    } else if (decimal === "h" || decimal === 12) {
      return 0x0c | dpreg;
    } else if (decimal === "l" || decimal === 13) {
      return 0x0d | dpreg;
    } else if (decimal === "p" || decimal === 14) {
      return 0x0e | dpreg;
    } else if (decimal === "on") {
      // light all segments
      return 0x88;
    } else if (decimal === "off") {
      return 0x0f | dpreg;
    } else {
      return 0x0f | dpreg;
    }
  }
}

export default _7SegmentLED_MAX7219;
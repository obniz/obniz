
/* tslint:disable:class-name max-classes-per-file */
import Obniz  = require( "../../../dist/src/obniz/index");

const OBNIZ_ID = "1234-5678";

/**
 * https://obniz.io/ja/sdk/parts/7SegmentLED/README.md
 */
class _7SegmentLEDTest {
  public print() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const seg = obniz.wired("7SegmentLED", {
        a: 5,
        b: 6,
        c: 7,
        d: 1,
        e: 0,
        f: 3,
        g: 2,
        dp: 8,
        common: 4,
        commonType: "cathode",
      });

      for (let i = 0; i < 10; i++) {
        seg.print(i);
        await obniz.wait(1000);
      }
    };
  }

  public printRaw() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const seg = obniz.wired("7SegmentLED", {
        a: 7,
        b: 8,
        c: 1,
        d: 2,
        e: 3,
        f: 5,
        g: 4,
        dp: 0,
        common: 6,
        commonType: "cathode",
      });
      seg.printRaw(0x77);
    };
  }
  public off() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const seg = obniz.wired("7SegmentLED", {
        a: 5,
        b: 6,
        c: 7,
        d: 1,
        e: 0,
        f: 3,
        g: 2,
        dp: 8,
        common: 4,
        commonType: "cathode",
      });

      for (let i = 0; i < 10; i++) {
        seg.print(i);
        await obniz.wait(1000);
      }
      seg.off();
    };
  }

  public on() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const seg = obniz.wired("7SegmentLED", {
        a: 5,
        b: 6,
        c: 7,
        d: 1,
        e: 0,
        f: 3,
        g: 2,
        dp: 8,
        common: 4,
        commonType: "cathode",
      });

      seg.print(7);
      while (true) {
        seg.on();
        await obniz.wait(1000);
        seg.off();
        await obniz.wait(1000);
      }
    };
  }

  public dpState() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const seg = obniz.wired("7SegmentLED", {
        a: 5,
        b: 6,
        c: 7,
        d: 1,
        e: 0,
        f: 3,
        g: 2,
        dp: 8,
        common: 4,
        commonType: "cathode",
      });

      seg.print(7);
      while (true) {
        seg.dpState(true);
        await obniz.wait(1000);
        seg.dpState(false);
        await obniz.wait(1000);
      }
    };
  }
}

/**
 * https://obniz.io/ja/sdk/parts/7SegmentLED_MAX7219/README.md
 */
class _7SegmentLED_MAX7219Test {
  public init() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const segment = obniz.wired("7SegmentLED_MAX7219", { clk: 0, cs: 1, din: 2, gnd: 3, vcc: 4 });
      segment.init(1, 4); // 4桁のディスプレイを一つ接続
    };
  }

  public brightness() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const segment = obniz.wired("7SegmentLED_MAX7219", { clk: 0, cs: 1, din: 2, gnd: 3, vcc: 4 });
      segment.init(1, 4);
      segment.brightness(0, 1);
      segment.setNumber(0, 0, 5, false);
    };
  }

  public brightnessAll() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const segment = obniz.wired("7SegmentLED_MAX7219", { clk: 0, cs: 1, din: 2, gnd: 3, vcc: 4 });
      segment.init(1, 4);
      segment.brightnessAll(1);
      segment.setNumber(0, 0, 5, false);
    };
  }

  public setNumber() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const segment = obniz.wired("7SegmentLED_MAX7219", { clk: 0, cs: 1, din: 2, gnd: 3, vcc: 4 });
      segment.init(1, 4);
      segment.setNumber(0, 0, 5, false);
      segment.setNumber(0, 1, "e", false);
      segment.setNumber(0, 2, "off", true);
    };
  }

  public clear() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const segment = obniz.wired("7SegmentLED_MAX7219", { clk: 0, cs: 1, din: 2, gnd: 3, vcc: 4 });
      segment.init(1, 4);
      segment.setNumber(0, 0, 5, false);
      segment.setNumber(0, 1, "e", false);
      segment.clear(0);
    };
  }

  public clearAll() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const segment = obniz.wired("7SegmentLED_MAX7219", { clk: 0, cs: 1, din: 2, gnd: 3, vcc: 4 });
      segment.init(1, 4);
      segment.setNumber(0, 0, 5, false); // ディスプレイ0の1桁目に5を表示,ドット消灯
      segment.clearAll();
    };
  }

  public test() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const segment = obniz.wired("7SegmentLED_MAX7219", { clk: 0, cs: 1, din: 2, gnd: 3, vcc: 4 });
      segment.init(1, 4);
      segment.test();
    };
  }
}

// https://obniz.io/ja/sdk/parts/7SegmentLEDArray/README.md
class _7SegmentLEDArrayTest {
  public print() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const seg0 = obniz.wired("7SegmentLED", {
        a: 7,
        b: 8,
        c: 1,
        d: 2,
        e: 3,
        f: 5,
        g: 4,
        dp: 0,
        common: 6,
        commonType: "cathode",
      });
      const seg1 = obniz.wired("7SegmentLED", {
        a: 7,
        b: 8,
        c: 1,
        d: 2,
        e: 3,
        f: 5,
        g: 4,
        dp: 0,
        common: 9,
        commonType: "cathode",
      });
      const seg2 = obniz.wired("7SegmentLED", {
        a: 7,
        b: 8,
        c: 1,
        d: 2,
        e: 3,
        f: 5,
        g: 4,
        dp: 0,
        common: 10,
        commonType: "cathode",
      });
      const seg3 = obniz.wired("7SegmentLED", {
        a: 7,
        b: 8,
        c: 1,
        d: 2,
        e: 3,
        f: 5,
        g: 4,
        dp: 0,
        common: 11,
        commonType: "cathode",
      });

      const segArray = obniz.wired("7SegmentLEDArray", { segments: [seg0, seg1, seg2, seg3] });
      segArray.print(1234);
    };
  }

  public off() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const seg0 = obniz.wired("7SegmentLED", {
        a: 7,
        b: 8,
        c: 1,
        d: 2,
        e: 3,
        f: 5,
        g: 4,
        dp: 0,
        common: 6,
        commonType: "cathode",
      });
      const seg1 = obniz.wired("7SegmentLED", {
        a: 7,
        b: 8,
        c: 1,
        d: 2,
        e: 3,
        f: 5,
        g: 4,
        dp: 0,
        common: 9,
        commonType: "cathode",
      });
      const seg2 = obniz.wired("7SegmentLED", {
        a: 7,
        b: 8,
        c: 1,
        d: 2,
        e: 3,
        f: 5,
        g: 4,
        dp: 0,
        common: 10,
        commonType: "cathode",
      });
      const seg3 = obniz.wired("7SegmentLED", {
        a: 7,
        b: 8,
        c: 1,
        d: 2,
        e: 3,
        f: 5,
        g: 4,
        dp: 0,
        common: 11,
        commonType: "cathode",
      });

      const segArray = obniz.wired("7SegmentLEDArray", { segments: [seg0, seg1, seg2, seg3] });

      segArray.print(1234);
      await obniz.wait(1000);
      segArray.off();
      await obniz.wait(1000);
      segArray.on();
    };
  }

  public on() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const seg0 = obniz.wired("7SegmentLED", {
        a: 7,
        b: 8,
        c: 1,
        d: 2,
        e: 3,
        f: 5,
        g: 4,
        dp: 0,
        common: 6,
        commonType: "cathode",
      });
      const seg1 = obniz.wired("7SegmentLED", {
        a: 7,
        b: 8,
        c: 1,
        d: 2,
        e: 3,
        f: 5,
        g: 4,
        dp: 0,
        common: 9,
        commonType: "cathode",
      });
      const seg2 = obniz.wired("7SegmentLED", {
        a: 7,
        b: 8,
        c: 1,
        d: 2,
        e: 3,
        f: 5,
        g: 4,
        dp: 0,
        common: 10,
        commonType: "cathode",
      });
      const seg3 = obniz.wired("7SegmentLED", {
        a: 7,
        b: 8,
        c: 1,
        d: 2,
        e: 3,
        f: 5,
        g: 4,
        dp: 0,
        common: 11,
        commonType: "cathode",
      });

      const segArray = obniz.wired("7SegmentLEDArray", { segments: [seg0, seg1, seg2, seg3] });

      segArray.print(1234);
      await obniz.wait(1000);
      segArray.off();
      await obniz.wait(1000);
      segArray.on();
    };
  }
}

/**
 * https://obniz.io/ja/sdk/parts/MatrixLED_MAX7219/README.md
 */
class _MatrixLED_MAX7219Test {
  public init() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const matrix = obniz.wired("MatrixLED_MAX7219", { clk: 0, cs: 1, din: 2, gnd: 3, vcc: 4 });
      matrix.init(8 * 2, 8);
    };
  }

  public brightness() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const matrix = obniz.wired("MatrixLED_MAX7219", { clk: 0, cs: 1, din: 2, gnd: 3, vcc: 4 });
      matrix.init(8 * 2, 8);
      matrix.brightness(7);
    };
  }

  public draw() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const matrix = obniz.wired("MatrixLED_MAX7219", { clk: 0, cs: 1, din: 2, gnd: 3, vcc: 4 });
      matrix.init(8 * 4, 8);
      matrix.brightness(7);

      const ctx = obniz.util.createCanvasContext(matrix.width, matrix.height);
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, matrix.width, matrix.height);
      ctx.fillStyle = "white";
      ctx.font = "9px sans-serif";
      ctx.fillText("Hello World", 0, 7);

      matrix.draw(ctx);
    };
  }

  public clear() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const matrix = obniz.wired("MatrixLED_MAX7219", { clk: 0, cs: 1, din: 2, gnd: 3, vcc: 4 });
      matrix.init(8 * 4, 8);
      matrix.clear();
    };
  }

  public test() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const matrix = obniz.wired("MatrixLED_MAX7219", { clk: 0, cs: 1, din: 2, gnd: 3, vcc: 4 });
      matrix.init(8 * 4, 8);
      matrix.test();
    };
  }
}

// https://obniz.io/ja/sdk/parts/SainSmartTFT18LCD/README.md
class SainSmartTFT18LCDTest {
  public color16() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const lcd = obniz.wired("SainSmartTFT18LCD", { scl: 4, sda: 3, dc: 2, res: 1, cs: 0, vcc: 6, gnd: 5 });
      const red = lcd.color16(255, 0, 0); // 16bitRGB for red
      lcd.drawRect(0, 0, lcd.width, lcd.height, red);
    };
  }

  public drawApi() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const lcd = obniz.wired("SainSmartTFT18LCD", { scl: 4, sda: 3, dc: 2, res: 1, cs: 0, vcc: 6, gnd: 5 });
      // 16bit-RGB color value
      const BLACK = 0x0000;
      const BLUE = 0x001f;
      const RED = 0xf800;
      const GREEN = 0x07e0;
      const CYAN = 0x07ff;
      const MAGENTA = 0xf81f;
      const YELLOW = 0xffe0;
      const WHITE = 0xffff;
      lcd.fillScreen(BLACK);
      lcd.drawRoundRect(0, 0, lcd.width, lcd.height, 8, RED);
      lcd.fillRect(10, 10, lcd.width - 20, lcd.height - 20, MAGENTA);
      await obniz.wait(1000);
      lcd.drawRect(14, 14, lcd.width - 28, lcd.height - 28, GREEN);
      lcd.fillRoundRect(20, 20, lcd.width - 40, lcd.height - 40, 4, CYAN);
      await obniz.wait(1000);
      lcd.drawCircle(0, 0, 100, BLACK);
      lcd.fillCircle(64, 80, 40, YELLOW);
      lcd.drawCircle(64, 80, 40, RED);
      await obniz.wait(1000);
      lcd.drawTriangle(64, 24, 24, lcd.height - 24, lcd.width - 24, lcd.height - 24, BLACK);
      lcd.fillTriangle(64, lcd.height - 48, 24, 48, lcd.width - 24, 48, GREEN);
      await obniz.wait(1000);
      lcd.drawVLine(64, 10, lcd.height - 20, RED);
      lcd.drawHLine(10, 80, lcd.width - 20, BLUE);
      lcd.drawLine(10, 10, lcd.width - 10, lcd.height - 10, BLACK);

      // drawChar / drawString
      const white = lcd.color16(255, 255, 255);
      const red = lcd.color16(255, 0, 0);
      const yellow = lcd.color16(255, 255, 0);
      lcd.drawChar(0, 0, "+", yellow, red, 4);
      let x = 7;
      let y = 32;
      [x, y] = lcd.drawString(x, y, "This is 1st draw.", white, white);
      [x, y] = lcd.drawString(x, y, "This is 2nd draw.", red, red, 2, true);

      // drawContext
      const canvas = document.getElementById("canvas") as HTMLCanvasElement;
      const context = canvas.getContext("2d")!;
      context.fillStyle = "#FFFFCC";
      context.fillRect(0, 0, lcd.width, lcd.height);
      lcd.drawContext(context, false);
    };
  }

  public otherApi() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const lcd = obniz.wired("SainSmartTFT18LCD", { scl: 4, sda: 3, dc: 2, res: 1, cs: 0, vcc: 6, gnd: 5 });
      lcd.fillScreen(0); // clear screen to black
      for (let n = 0; n < 4; n++) {
        lcd.setRotation(n);
        lcd.drawChar(0, 0, n + "", 0xffff, 0xffff, 2);
        lcd.fillCircle(2, 2, 2, 0xf800); // plots origin point to red

        // preset.
        lcd.drawLine(0, 0, lcd.width, lcd.height, lcd.color.AliceBlue);
      }
    };
  }
}

/**
 * https://obniz.io/ja/sdk/parts/SharpMemoryTFT/README.md
 */
class SharpMemoryTFT {
  public draw() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const mdisp = obniz.wired("SharpMemoryTFT", { vcc: 0, gnd: 2, sclk: 3, mosi: 4, cs: 5, width: 144, height: 168 });
      mdisp.clear();

      const canvas = document.getElementById("canvas") as HTMLCanvasElement;
      if (!canvas || !canvas.getContext) {
        return;
      }
      const ctx = canvas.getContext("2d")!;
      const img = new Image();
      img.src = "Image address here";
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        mdisp.draw(ctx);
      };
    };
  }
}


/* tslint:disable:class-name max-classes-per-file */

import Obniz from "../../../obniz";

const OBNIZ_ID = "1234-5678";

/**
 * https://obniz.io/ja/sdk/parts/ArduCAMMini/README.md
 */
class ArduCAMMiniTest {
  public async startupWait1() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.io11.output(true);
    const cam = obniz.wired("ArduCAMMini", { cs: 0, mosi: 1, miso: 2, sclk: 3, gnd: 4, vcc: 5, sda: 6, scl: 7 });
    await cam.spi_pingpongWait();
    cam.setMode("MCU2LCD");
    const chipid = await cam.getChipIdWait();
    if (chipid !== 0x2642) {
      throw new Error("unknown chip " + chipid);
    }
    cam.init();
  }

  public async startupWait2() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.io11.output(true);
    const cam = obniz.wired("ArduCAMMini", { cs: 0, mosi: 1, miso: 2, sclk: 3, gnd: 4, vcc: 5, sda: 6, scl: 7 });
    await cam.startupWait();
  }

  public async takeWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.io11.output(true);
    const cam = obniz.wired("ArduCAMMini", { cs: 0, mosi: 1, miso: 2, sclk: 3, gnd: 4, vcc: 5, sda: 6, scl: 7 });
    await cam.startupWait();
    const jpegData = await cam.takeWait("1024x768");
  }

  public async arrayToBase64() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.io11.output(true);
    const cam = obniz.wired("ArduCAMMini", { cs: 0, mosi: 1, miso: 2, sclk: 3, gnd: 4, vcc: 5, sda: 6, scl: 7 });
    await cam.startupWait();
    const jpegData = await cam.takeWait("1024x768");
    console.log("image size = " + jpegData.length + " bytes");

    const base64 = cam.arrayToBase64(jpegData);
    const elm = document.getElementById("image") as HTMLImageElement;
    elm.src = "data:image/jpeg;base64, " + base64;
  }

  public async setMode() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.io11.output(true);
    const cam = obniz.wired("ArduCAMMini", { cs: 0, mosi: 1, miso: 2, sclk: 3, gnd: 4, vcc: 5, sda: 6, scl: 7 });
    cam.setMode("MCU2LCD");
  }

  public async spi_pingpongWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.io11.output(true);
    const cam = obniz.wired("ArduCAMMini", { cs: 0, mosi: 1, miso: 2, sclk: 3, gnd: 4, vcc: 5, sda: 6, scl: 7 });
    await cam.spi_pingpongWait();
  }

  public async getChipIdWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.io11.output(true);
    const cam = obniz.wired("ArduCAMMini", { cs: 0, mosi: 1, miso: 2, sclk: 3, gnd: 4, vcc: 5, sda: 6, scl: 7 });
    const chipid = await cam.getChipIdWait();
    if (chipid !== 0x2642) {
      throw new Error("unknown chip " + chipid);
    }
  }

  public async init() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.io11.output(true);
    const cam = obniz.wired("ArduCAMMini", { cs: 0, mosi: 1, miso: 2, sclk: 3, gnd: 4, vcc: 5, sda: 6, scl: 7 });
    cam.setMode("MCU2LCD");
    cam.init();
  }

  public async setSize() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.io11.output(true);
    const cam = obniz.wired("ArduCAMMini", { cs: 0, mosi: 1, miso: 2, sclk: 3, gnd: 4, vcc: 5, sda: 6, scl: 7 });
    await cam.startupWait();
    cam.setSize("1600x1200");
    obniz.wait(1000);
  }

  public async flushFIFO() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.io11.output(true);
    const cam = obniz.wired("ArduCAMMini", { cs: 0, mosi: 1, miso: 2, sclk: 3, gnd: 4, vcc: 5, sda: 6, scl: 7 });
    await cam.startupWait();
    cam.flushFIFO();
    cam.flushFIFO();
    cam.startCapture();
    while (true) {
      if (await cam.isCaptureDoneWait()) {
        break;
      }
    }
    const jpegData = await cam.readFIFOWait();
  }

  public async startCapture() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.io11.output(true);
    const cam = obniz.wired("ArduCAMMini", { cs: 0, mosi: 1, miso: 2, sclk: 3, gnd: 4, vcc: 5, sda: 6, scl: 7 });
    await cam.startupWait();
    cam.flushFIFO();
    cam.flushFIFO();
    cam.startCapture();
    while (true) {
      if (await cam.isCaptureDoneWait()) {
        break;
      }
    }
    const jpegData = await cam.readFIFOWait();
  }

  public async isCaptureDoneWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.io11.output(true);
    const cam = obniz.wired("ArduCAMMini", { cs: 0, mosi: 1, miso: 2, sclk: 3, gnd: 4, vcc: 5, sda: 6, scl: 7 });
    await cam.startupWait();
    cam.flushFIFO();
    cam.flushFIFO();
    cam.startCapture();
    while (true) {
      if (await cam.isCaptureDoneWait()) {
        break;
      }
    }
    const jpegData = await cam.readFIFOWait();
  }

  public async readFIFOWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.io11.output(true);
    const cam = obniz.wired("ArduCAMMini", { cs: 0, mosi: 1, miso: 2, sclk: 3, gnd: 4, vcc: 5, sda: 6, scl: 7 });
    await cam.startupWait();
    cam.flushFIFO();
    cam.flushFIFO();
    cam.startCapture();
    while (true) {
      if (await cam.isCaptureDoneWait()) {
        break;
      }
    }
    const jpegData = await cam.readFIFOWait();
  }
}

/**
 * https://obniz.io/ja/sdk/parts/JpegSerialCam/README.md
 */
class JpegSerialCamTest {
  public startWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      obniz.io6.output(true);
      obniz.io9.output(false);
      const cam = obniz.wired("JpegSerialCam", { vcc: 0, cam_tx: 1, cam_rx: 2, gnd: 3 });
      await cam.startWait({ baud: 38400 });
      const data = await cam.takeWait();
    };
  }

  public setSizeWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      obniz.io6.output(true);
      obniz.io9.output(false);
      const cam = obniz.wired("JpegSerialCam", { vcc: 0, cam_tx: 1, cam_rx: 2, gnd: 3 });
      await cam.startWait({ baud: 38400 });
      await cam.setSizeWait("640x480");
      const data = await cam.takeWait();
    };
  }

  public setBaudWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      obniz.io6.output(true);
      obniz.io9.output(false);
      const cam = obniz.wired("JpegSerialCam", { vcc: 0, cam_tx: 1, cam_rx: 2, gnd: 3 });
      await cam.startWait({ baud: 38400 });
      await cam.setBaudWait(115200);
      await cam.takeWait(); // baud is already changed to 115200.
    };
  }

  public takeWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      obniz.io6.output(true);
      obniz.io9.output(false);
      const cam = obniz.wired("JpegSerialCam", { vcc: 0, cam_tx: 1, cam_rx: 2, gnd: 3 });
      await cam.startWait({ baud: 38400 });
      const jpegData = await cam.takeWait();
    };
  }

  public arrayToBase64() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      obniz.io6.output(true);
      obniz.io9.output(false);
      const cam = obniz.wired("JpegSerialCam", { vcc: 0, cam_tx: 1, cam_rx: 2, gnd: 3 });
      await cam.startWait({ baud: 38400 });
      const jpegData = await cam.takeWait();
      const elm = document.getElementById("image") as HTMLImageElement;
      elm.src = "data:image/png;base64," + cam.arrayToBase64(jpegData);
    };
  }
}

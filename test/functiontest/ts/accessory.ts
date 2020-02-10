import Obniz  = require( "../../../dist/src/obniz/index");

const OBNIZ_ID = "1234-5678";

/**
 * https://obniz.io/ja/sdk/parts/USB/README.md
 */
class USBTest {
  public on() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const usb = obniz.wired("USB", { gnd: 0, vcc: 3 });
      usb.on();
    };
  }

  public off() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const usb = obniz.wired("USB", { gnd: 0, vcc: 3 });
      usb.on();
      await obniz.wait(1000);
      usb.off();
    };
  }
}

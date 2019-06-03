import * as Obniz from '../../obniz';

const OBNIZ_ID = '1234-5678';

/**
 * https://obniz.io/ja/sdk/parts/USB/README.md
 */
class USBTest {
  on() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var usb = obniz.wired('USB', { gnd: 0, vcc: 3 });
      usb.on();
    };
  }

  off() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var usb = obniz.wired('USB', { gnd: 0, vcc: 3 });
      usb.on();
      await obniz.wait(1000);
      usb.off();
    };
  }
}

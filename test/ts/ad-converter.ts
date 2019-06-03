import * as Obniz from '../../obniz';

const OBNIZ_ID = '1234-5678';

/**
 * https://obniz.io/ja/sdk/parts/hx711/README.md
 */
class HX711Test {
  getValueWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var sensor = obniz.wired('hx711', { gnd: 0, dout: 1, sck: 2, vcc: 3 });
      var value = await sensor.getValueWait(10); //10 times average
      console.log('grams:' + value);
    };
  }

  offset() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var sensor = obniz.wired('hx711', { gnd: 0, dout: 1, sck: 2, vcc: 3 });
      sensor.offset = 7000;
      sensor.scale = 2280;
      var value = await sensor.getValueWait(10); //10 times average
      console.log('grams:' + value);
    };
  }

  zeroAdjust() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var sensor = obniz.wired('hx711', { gnd: 0, dout: 1, sck: 2, vcc: 3 });
      sensor.zeroAdjust();
      sensor.scale = 2280;
      var value = await sensor.getValueWait(10); //10 times average
      console.log('grams:' + value);
    };
  }

  scale() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var sensor = obniz.wired('hx711', { gnd: 0, dout: 1, sck: 2, vcc: 3 });
      sensor.zeroAdjust();
      sensor.scale = 2280;
      var value = await sensor.getValueWait(10); //10 times average
      console.log('grams:' + value);
    };
  }

  powerDown() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var sensor = obniz.wired('hx711', { gnd: 1, dout: 1, sck: 2, vcc: 3 });

      sensor.powerDown();
      sensor.powerUp();
    };
  }

  powerUp() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var sensor = obniz.wired('hx711', { gnd: 1, dout: 1, sck: 2, vcc: 3 });
      sensor.powerDown();
      sensor.powerUp();
    };
  }
}

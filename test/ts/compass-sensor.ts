import * as Obniz from '../../obniz';

const OBNIZ_ID = '1234-5678';

/**
 * https://obniz.io/ja/sdk/parts/HMC5883L/README.md
 */
class HMC5883LTest {
  init() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var compass = obniz.wired('HMC5883L', { gnd: 1, sda: 2, scl: 3 });
      compass.init();
    };
  }

  get() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var compass = obniz.wired('HMC5883L', { gnd: 1, sda: 2, scl: 3 });
      compass.init();
      while (true) {
        var obj = await compass.get();
        console.log(obj.x, obj.y, obj.z);
      }
    };
  }
}

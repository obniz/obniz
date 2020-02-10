import Obniz  = require( "../../../dist/src/obniz/index");

const OBNIZ_ID = "1234-5678";

/**
 * https://obniz.io/ja/sdk/parts/HMC5883L/README.md
 */
class HMC5883LTest {
  public init() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const compass = obniz.wired("HMC5883L", { gnd: 1, sda: 2, scl: 3 });
      compass.init();
    };
  }

  public get() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const compass = obniz.wired("HMC5883L", { gnd: 1, sda: 2, scl: 3 });
      compass.init();
      while (true) {
        const obj = await compass.get();
        console.log(obj.x, obj.y, obj.z);
      }
    };
  }
}

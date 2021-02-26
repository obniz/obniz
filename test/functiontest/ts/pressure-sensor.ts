/* tslint:disable:class-name max-classes-per-file */

import Obniz from '../../../dist/src/obniz/index';

const OBNIZ_ID = '1234-5678';

/**
 * https://obniz.io/ja/sdk/parts/FSR-40X/README.md
 */
class FSR_40XTest {
  public onchange() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const pressure = obniz.wired('FSR40X', { pin0: 0, pin1: 1 });
      pressure.onchange = (press) => {
        console.log(press);
      };
    };
  }

  public getWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const pressure = obniz.wired('FSR40X', { pin0: 0, pin1: 1 });
      const press = await pressure.getWait();
      console.log(press);
    };
  }
}

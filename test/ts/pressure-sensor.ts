import * as Obniz from '../../obniz';

const OBNIZ_ID = '1234-5678';

/**
 * https://obniz.io/ja/sdk/parts/FSR-40X/README.md
 */
class FSR_40XTest {
  onchange() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var pressure = obniz.wired('FSR40X', { pin0: 0, pin1: 1 });
      pressure.onchange = function(press) {
        console.log(press);
      };
    };
  }

  getWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var pressure = obniz.wired('FSR40X', { pin0: 0, pin1: 1 });
      var press = await pressure.getWait();
      console.log(press);
    };
  }
}

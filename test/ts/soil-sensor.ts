import * as Obniz from '../../obniz';

const OBNIZ_ID = '1234-5678';

/**
 * https://obniz.io/ja/sdk/parts/SEN0114/README.md
 */
class SEN0114Test {
  onchange() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var sensor = obniz.wired('SEN0114', { vcc: 0, gnd: 1, output: 2 });
      sensor.onchange = function(value) {
        console.log(value);
      };
    };
  }

  getHumidityWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var sensor = obniz.wired('SEN0114', { vcc: 0, gnd: 1, output: 2 });
      var value = await sensor.getHumidityWait();
      console.log('Humidity Level:' + value);
    };
  }
}

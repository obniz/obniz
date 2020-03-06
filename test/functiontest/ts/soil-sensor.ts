/* tslint:disable:class-name max-classes-per-file */
import Obniz from "../../../dist/src/obniz/index";

const OBNIZ_ID = "1234-5678";

/**
 * https://obniz.io/ja/sdk/parts/SEN0114/README.md
 */
class SEN0114Test {
  public onchange() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const sensor = obniz.wired("SEN0114", { vcc: 0, gnd: 1, output: 2 });
      sensor.onchange = (value) => {
        console.log(value);
      };
    };
  }

  public getHumidityWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const sensor = obniz.wired("SEN0114", { vcc: 0, gnd: 1, output: 2 });
      const value = await sensor.getHumidityWait();
      console.log("Humidity Level:" + value);
    };
  }
}

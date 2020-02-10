
/* tslint:disable:class-name max-classes-per-file */
import Obniz from "../../../dist/src/obniz/index";

const OBNIZ_ID = "1234-5678";

/**
 * https://obniz.io/ja/sdk/parts/ENC03R_Module/README.md
 */
class ENC03R_ModuleTest {
  public onchange() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const enc03r = obniz.wired("ENC03R_Module", { gnd: 0, vcc: 1, out2: 2, out1: 3 });
      enc03r.onchange1 = (val) => {
        console.log("1: " + val + " (deg/sec)");
      };
      enc03r.onchange2 = (val) => {
        console.log("2: " + val + " (deg/sec)");
      };
    };
  }

  public getWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const enc03r = obniz.wired("ENC03R_Module", { gnd: 0, vcc: 1, out2: 2, out1: 3 });
      const val1 = await enc03r.get1Wait();
      const val2 = await enc03r.get1Wait();

      console.log("1: " + val1 + " (deg/sec)");
      console.log("2: " + val2 + " (deg/sec)");
    };
  }
}

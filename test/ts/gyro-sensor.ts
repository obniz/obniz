import * as Obniz from '../../obniz';

const OBNIZ_ID = '1234-5678';

/**
 * https://obniz.io/ja/sdk/parts/ENC03R_Module/README.md
 */
class ENC03R_ModuleTest {
  onchange() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var enc03r = obniz.wired('ENC03R_Module', { gnd: 0, vcc: 1, out2: 2, out1: 3 });
      enc03r.onchange1 = function(val) {
        console.log('1: ' + val + ' (deg/sec)');
      };
      enc03r.onchange2 = function(val) {
        console.log('2: ' + val + ' (deg/sec)');
      };
    };
  }

  getWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var enc03r = obniz.wired('ENC03R_Module', { gnd: 0, vcc: 1, out2: 2, out1: 3 });
      var val1 = await enc03r.get1Wait();
      var val2 = await enc03r.get1Wait();

      console.log('1: ' + val1 + ' (deg/sec)');
      console.log('2: ' + val2 + ' (deg/sec)');
    };
  }
}

import * as Obniz from '../../obniz';

const OBNIZ_ID = '1234-5678';

/**
 * https://obniz.io/ja/sdk/parts/S11059/README.md
 */
class S11059Test {
  init() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var colorSens = obniz.wired('S11059', { vcc: 0, sda: 1, scl: 2, gnd: 3 });
      colorSens.init(1, 2); // ゲイン高感度, 積分時間22.4msで初期化
    };
  }

  getVal() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var colorSens = obniz.wired('S11059', { vcc: 0, sda: 1, scl: 2, gnd: 3 });
      colorSens.init(1, 2);
      var ret = await colorSens.getVal(); // 各色の値を取得
      console.log('getVal:' + ret); // 取得した配列を表示
      var red = ret[0]; // 赤色のレベルを変数redへ代入
      var green = ret[1]; // 緑色のレベルを変数greenへ代入
      var blue = ret[2]; // 青色のレベルを変数blueへ代入
      var ir = ret[3]; // 赤外線のレベルを変数irへ代入
      // それぞれの配列を表示
      console.log('Red:' + red);
      console.log('Green:' + green);
      console.log('Blue:' + blue);
      console.log('IR:' + ir);
    };
  }
}


/* tslint:disable:class-name max-classes-per-file */
import Obniz from "../../../obniz";

const OBNIZ_ID = "1234-5678";

/**
 * https://obniz.io/ja/sdk/parts/Grove_EarHeartRate/README.md
 */
class Grove_EarHeartRateTest {
  public start() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const heartrate = obniz.wired("Grove_EarHeartRate", { gnd: 0, vcc: 1, signal: 2 });
      heartrate.start((rate) => {
        console.log(rate);
      });
    };
  }

  public getWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const heartrate = obniz.wired("Grove_EarHeartRate", { gnd: 0, vcc: 1, signal: 2 });
      const rate = await heartrate.getWait();
      console.log(rate);
    };
  }
}

/**
 * https://obniz.io/ja/sdk/parts/Grove_MP3/README.md
 */
class Grove_MP3Test {
  public initWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const mp3 = obniz.wired("Grove_MP3", { gnd: 0, vcc: 1, mp3_rx: 2, mp3_tx: 3 });
      await mp3.initWait();
    };
  }

  public setVolume() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const mp3 = obniz.wired("Grove_MP3", { gnd: 0, vcc: 1, mp3_rx: 2, mp3_tx: 3 });
      await mp3.initWait();
      mp3.setVolume(10);
    };
  }

  public volUp() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const mp3 = obniz.wired("Grove_MP3", { gnd: 0, vcc: 1, mp3_rx: 2, mp3_tx: 3 });
      await mp3.initWait();
      mp3.volUp();
    };
  }

  public volDown() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const mp3 = obniz.wired("Grove_MP3", { gnd: 0, vcc: 1, mp3_rx: 2, mp3_tx: 3 });
      await mp3.initWait();
      mp3.volDown();
    };
  }

  public play() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const mp3 = obniz.wired("Grove_MP3", { gnd: 0, vcc: 1, mp3_rx: 2, mp3_tx: 3 });
      await mp3.initWait();
      mp3.setVolume(10);
      mp3.play(1); // MP3フォルダ内の0001.mp3を再生 (/MP3/0001.mp3)
      // mp3.play(1,5) // 05フォルダ内の001.mp3を再生 (/05/001.mp3)};
    };
  }

  public stop() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const mp3 = obniz.wired("Grove_MP3", { gnd: 0, vcc: 1, mp3_rx: 2, mp3_tx: 3 });
      await mp3.initWait();
      mp3.setVolume(10);
      mp3.play(1);
      await obniz.wait(5000);
      mp3.stop();
    };
  }

  public pause() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const mp3 = obniz.wired("Grove_MP3", { gnd: 0, vcc: 1, mp3_rx: 2, mp3_tx: 3 });
      await mp3.initWait();
      mp3.setVolume(10);
      mp3.play(1);
      await obniz.wait(5000);
      mp3.pause();
    };
  }

  public resume() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const mp3 = obniz.wired("Grove_MP3", { gnd: 0, vcc: 1, mp3_rx: 2, mp3_tx: 3 });
      await mp3.initWait();
      mp3.setVolume(10);
      mp3.play(1);
      await obniz.wait(5000);
      mp3.pause();
      await obniz.wait(3000);
      mp3.resume();
    };
  }
}

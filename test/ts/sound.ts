import * as Obniz from '../../obniz';

const OBNIZ_ID = '1234-5678';

/**
 * https://obniz.io/ja/sdk/parts/Speaker/README.md
 */
class SpeakerTest {
  play() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var speaker = obniz.wired('Speaker', { signal: 0, gnd: 1 });
      speaker.play(1000); //1000hz
    };
  }

  stop() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var speaker = obniz.wired('Speaker', { signal: 0, gnd: 1 });
      speaker.play(1000); //1000hz
      await obniz.wait(1000);
      speaker.stop();
    };
  }
}

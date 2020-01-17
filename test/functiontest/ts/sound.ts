import Obniz from "../../../obniz";

const OBNIZ_ID = "1234-5678";

/**
 * https://obniz.io/ja/sdk/parts/Speaker/README.md
 */
class SpeakerTest {
  public play() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const speaker = obniz.wired("Speaker", { signal: 0, gnd: 1 });
      speaker.play(1000); // 1000hz
    };
  }

  public stop() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const speaker = obniz.wired("Speaker", { signal: 0, gnd: 1 });
      speaker.play(1000); // 1000hz
      await obniz.wait(1000);
      speaker.stop();
    };
  }
}

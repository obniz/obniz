import Obniz  = require( "../../../dist/src/obniz/index");

const OBNIZ_ID = "1234-5678";

/**
 * https://obniz.io/ja/sdk/parts/2JCIE/README.md
 */
class TEST2JCIETest {
  public findWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const omron = obniz.wired("2JCIE");
      const results = await omron.findWait();

      if (results) {
        console.log("find");
      } else {
        console.log("not find");
      }
    };
  }

  public connectWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const omron = obniz.wired("2JCIE");
      const results = await omron.findWait();

      if (results) {
        console.log("find");

        await omron.connectWait();
        const data = await omron.getLatestData();

        console.log(data);
      } else {
        console.log("not find");
      }
    };
  }

  public disconnectWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const omron = obniz.wired("2JCIE");
      const results = await omron.findWait();

      if (results) {
        console.log("find");

        await omron.connectWait();
        const data = await omron.getLatestData();

        console.log(data);

        await omron.disconnectWait();
      } else {
        console.log("not find");
      }
    };
  }

  public getLatestData() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const omron = obniz.wired("2JCIE");
      const results = await omron.findWait();

      if (results) {
        console.log("find");

        await omron.connectWait();
        const data = await omron.getLatestData();

        console.log(data);

        await omron.disconnectWait();
      } else {
        console.log("not find");
      }
    };
  }
}

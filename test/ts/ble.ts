import * as Obniz from '../../obniz';

const OBNIZ_ID = '1234-5678';

/**
 * https://obniz.io/ja/sdk/parts/2JCIE/README.md
 */
class _2JCIETest {
  findWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      let omron = obniz.wired('2JCIE');
      let results = await omron.findWait();

      if (results) {
        console.log('find');
      } else {
        console.log('not find');
      }
    };
  }

  connectWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      let omron = obniz.wired('2JCIE');
      let results = await omron.findWait();

      if (results) {
        console.log('find');

        await omron.connectWait();
        let data = await omron.getLatestData();

        console.log(data);
      } else {
        console.log('not find');
      }
    };
  }

  disconnectWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      let omron = obniz.wired('2JCIE');
      let results = await omron.findWait();

      if (results) {
        console.log('find');

        await omron.connectWait();
        let data = await omron.getLatestData();

        console.log(data);

        await omron.disconnectWait();
      } else {
        console.log('not find');
      }
    };
  }

  getLatestData() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      let omron = obniz.wired('2JCIE');
      let results = await omron.findWait();

      if (results) {
        console.log('find');

        await omron.connectWait();
        let data = await omron.getLatestData();

        console.log(data);

        await omron.disconnectWait();
      } else {
        console.log('not find');
      }
    };
  }
}

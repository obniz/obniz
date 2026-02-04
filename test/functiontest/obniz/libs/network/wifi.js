const chai = require('chai');
const expect = chai.expect;

const testUtil = require('../../../testUtil.js');

describe('obniz.libs.wifi', function () {
  beforeEach(async function () {
    await testUtil.setupObnizWait(this, null, { __firmware_ver: '3.3.0' });
  });

  afterEach(async function () {
    await testUtil.releaseObnizWait(this);
  });

  it('scanWait', function () {
    const scanResult = [
      {
        ssid: 'test-ssid',
        macAddress: '001122334455',
        rssi: -42,
      },
    ];

    return new Promise(
      function (resolve, reject) {
        this.obniz.wifi
          .scanWait()
          .then((result) => {
            expect(result).to.deep.equal(scanResult);
            resolve();
          })
          .catch(reject);

        expect(this.obniz).send([{ wifi: { scan: true } }]);
        expect(this.obniz).to.be.finished;

        setTimeout(
          function () {
            testUtil.receiveJson(this.obniz, [
              {
                wifi: {
                  scan: scanResult,
                },
              },
            ]);
          }.bind(this),
          10
        );
      }.bind(this)
    );
  });
});

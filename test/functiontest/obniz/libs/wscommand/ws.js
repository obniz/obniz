const chai = require('chai');
const expect = chai.expect;

const testUtil = require('../../../testUtil.js');

describe('ws', function () {
  beforeEach(async function () {
    await testUtil.setupObnizWait(this, null, { binary: true });
  });

  afterEach(async function () {
    await testUtil.releaseObnizWait(this);
  });

  it('reset obniz on ws disconnection', function () {
    const requestJson = [
      {
        ws: {
          reset_obniz_on_ws_disconnection: false,
        },
      },
    ];

    expect(requestJson.length).to.be.equal(1);

    const isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    const compress = this.obniz.wsCommandManager.compress(requestJson[0]);

    expect(compress).to.be.equal(null);
  });

  it('response test no.6', function () {
    const responseBinaryString = '04 03 0b 01 00 69 61 73 64 66 61 73 64 66';
    const expectJson = [
      { uart1: { data: [0, 105, 97, 115, 100, 102, 97, 115, 100, 102] } },
    ];

    const binaryArray = responseBinaryString
      .split(' ')
      .map(function (val, index) {
        return parseInt(val, 16);
      });
    const binary = new Uint8Array(binaryArray);

    const json = this.obniz.wsCommandManager.binary2Json(binary);

    const isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });

  it('ready formtat', function () {
    const expectJson = [{ ws: { ready: true } }];
    const isValidCommand = testUtil.isValidCommandResponseJson(expectJson);
    expect(isValidCommand.valid).to.be.true;
  });

  it('redirect formtat', function () {
    const expectJson = [{ ws: { redirect: 'wss://some_server.com' } }];
    const isValidCommand = testUtil.isValidCommandResponseJson(expectJson);
    expect(isValidCommand.valid).to.be.true;
  });
});

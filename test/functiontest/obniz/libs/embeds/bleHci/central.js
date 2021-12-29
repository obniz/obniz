const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

const testUtil = require('../../../../testUtil.js');

describe('ble-hci-central', function () {
  beforeEach(async function () {
    await testUtil.setupObnizWait(this, null, { __firmware_ver: '3.0.0' });
  });

  afterEach(async function () {
    await testUtil.releaseObnizWait(this);
  });

  it('init', async function () {
    await _initWaitTestWait(this.obniz);
  });

  it('init twice', async function () {
    await _initWaitTestWait(this.obniz);
    testUtil.closeAndReconnectObnizWait(this);
    await _initWaitTestWait(this.obniz);
  });

  it('write', function () {
    const commands = [
      [0x01, 0x03, 0x0c, 0x0], // reset
    ];

    for (const command of commands) {
      this.obniz.ble.hci.write(command);
      expect(this.obniz).send([
        {
          ble: {
            hci: {
              write: command,
            },
          },
        },
      ]);
    }
    expect(this.obniz).to.be.finished;
  });

  it('read', function () {
    const stub = sinon.stub();

    this.obniz.ble.hci.onread = stub;

    const results = [
      { ble: { hci: { read: { data: [0, 1, 2, 3, 4, 5, 22, 1] } } } },
    ];
    testUtil.receiveJson(this.obniz, results);

    sinon.assert.callCount(stub, 1);
    const data = stub.getCall(0).args[0];
    expect(Array.isArray(data)).to.be.true;

    expect(data).to.be.deep.equal([0, 1, 2, 3, 4, 5, 22, 1]);
    expect(this.obniz).to.be.finished;
  });

  it('scan', async function () {
    await _initWaitTestWait(this.obniz);
    await _scanStartTestWait(this.obniz);
  });

  it('scan filter', async function () {
    this.timeout(10 * 1000);
    await _initWaitTestWait(this.obniz);

    /* eslint-disable */

    //non filter
    await _scanStartTestWait(this.obniz, {});

    await _receiveAdvertisementTest(this.obniz, true, [4, 62, 43, 2, 1, 0, 1, 111, 79, 102, 162, 248, 197, 31, 2, 1, 6, 14, 255, 74, 5, 18, 215, 12, 121, 0, 250, 5, 153, 130, 244, 72, 12, 9, 78, 76, 77, 48, 48, 48, 48, 48, 53, 50, 52, 168]);
    await _receiveAdvertisementTest(this.obniz, true, [4, 62, 12, 2, 1, 4, 1, 0, 166, 134, 140, 138, 78, 0, 169]);
    await _receiveAdvertisementTest(this.obniz, true, [4, 62, 29, 2, 1, 0, 0, 20, 36, 183, 131, 21, 0, 17, 2, 1, 2, 3, 3, 231, 254, 9, 255, 0, 0, 0, 21, 131, 183, 36, 20, 186]);
    await _receiveAdvertisementTest(this.obniz, true, [4, 62, 43, 2, 1, 3, 1, 93, 73, 184, 157, 236, 6, 31, 30, 255, 6, 0, 1, 9, 32, 2, 14, 143, 137, 73, 15, 85, 248, 31, 2, 120, 92, 20, 25, 127, 68, 36, 240, 29, 92, 134, 178, 174, 139, 192]);
    await _receiveAdvertisementTest(this.obniz, true, [4, 62, 43, 2, 1, 2, 0, 200, 220, 43, 84, 171, 240, 31, 30, 255, 16, 5, 5, 5, 84, 68, 76, 111, 103, 116, 116, 97, 0, 0, 5, 0, 4, 0, 7, 8, 64, 96, 124, 106, 0, 0, 0, 0, 0, 177]);
    await _receiveAdvertisementTest(this.obniz, true, [4, 62, 12, 2, 1, 4, 0, 26, 101, 171, 137, 92, 244, 0, 184]);
    // scan resp only is not detect immediately
    await _receiveAdvertisementTest(this.obniz, false, [4, 62, 23, 2, 1, 4, 0, 35, 72, 71, 152, 36, 76, 11, 2, 10, 0, 7, 9, 80, 97, 83, 111, 82, 105, 177]);
    await _receiveAdvertisementTest(this.obniz, true, [4, 62, 39, 2, 1, 0, 0, 35, 72, 71, 152, 36, 76, 27, 2, 1, 4, 17, 6, 161, 3, 221, 115, 3, 24, 238, 155, 89, 28, 27, 58, 0, 129, 62, 35, 5, 18, 16, 0, 240, 0, 174]);

    //device address filter
    await _scanStartTestWait(this.obniz, { deviceAddress: "f45c89ab651a" }, true);
    await _receiveAdvertisementTest(this.obniz, false, [4, 62, 43, 2, 1, 0, 1, 111, 79, 102, 162, 248, 197, 31, 2, 1, 6, 14, 255, 74, 5, 18, 215, 12, 121, 0, 250, 5, 153, 130, 244, 72, 12, 9, 78, 76, 77, 48, 48, 48, 48, 48, 53, 50, 52, 168]);
    await _receiveAdvertisementTest(this.obniz, false, [4, 62, 12, 2, 1, 4, 1, 0, 166, 134, 140, 138, 78, 0, 169]);
    await _receiveAdvertisementTest(this.obniz, false, [4, 62, 29, 2, 1, 0, 0, 20, 36, 183, 131, 21, 0, 17, 2, 1, 2, 3, 3, 231, 254, 9, 255, 0, 0, 0, 21, 131, 183, 36, 20, 186]);
    await _receiveAdvertisementTest(this.obniz, false, [4, 62, 43, 2, 1, 3, 1, 93, 73, 184, 157, 236, 6, 31, 30, 255, 6, 0, 1, 9, 32, 2, 14, 143, 137, 73, 15, 85, 248, 31, 2, 120, 92, 20, 25, 127, 68, 36, 240, 29, 92, 134, 178, 174, 139, 192]);
    await _receiveAdvertisementTest(this.obniz, false, [4, 62, 43, 2, 1, 2, 0, 200, 220, 43, 84, 171, 240, 31, 30, 255, 16, 5, 5, 5, 84, 68, 76, 111, 103, 116, 116, 97, 0, 0, 5, 0, 4, 0, 7, 8, 64, 96, 124, 106, 0, 0, 0, 0, 0, 177]);
    await _receiveAdvertisementTest(this.obniz, true, [4, 62, 12, 2, 1, 4, 0, 26, 101, 171, 137, 92, 244, 0, 184]);
    await _receiveAdvertisementTest(this.obniz, false, [4, 62, 23, 2, 1, 4, 0, 35, 72, 71, 152, 36, 76, 11, 2, 10, 0, 7, 9, 80, 97, 83, 111, 82, 105, 177]);
    await _receiveAdvertisementTest(this.obniz, false, [4, 62, 39, 2, 1, 0, 0, 35, 72, 71, 152, 36, 76, 27, 2, 1, 4, 17, 6, 161, 3, 221, 115, 3, 24, 238, 155, 89, 28, 27, 58, 0, 129, 62, 35, 5, 18, 16, 0, 240, 0, 174]);

    //uuid filter
    await _scanStartTestWait(this.obniz, { uuids: ["fee7"] }, true);
    await _receiveAdvertisementTest(this.obniz, false, [4, 62, 43, 2, 1, 0, 1, 111, 79, 102, 162, 248, 197, 31, 2, 1, 6, 14, 255, 74, 5, 18, 215, 12, 121, 0, 250, 5, 153, 130, 244, 72, 12, 9, 78, 76, 77, 48, 48, 48, 48, 48, 53, 50, 52, 168]);
    await _receiveAdvertisementTest(this.obniz, false, [4, 62, 12, 2, 1, 4, 1, 0, 166, 134, 140, 138, 78, 0, 169]);
    await _receiveAdvertisementTest(this.obniz, true, [4, 62, 29, 2, 1, 0, 0, 20, 36, 183, 131, 21, 0, 17, 2, 1, 2, 3, 3, 231, 254, 9, 255, 0, 0, 0, 21, 131, 183, 36, 20, 186]);
    await _receiveAdvertisementTest(this.obniz, false, [4, 62, 43, 2, 1, 3, 1, 93, 73, 184, 157, 236, 6, 31, 30, 255, 6, 0, 1, 9, 32, 2, 14, 143, 137, 73, 15, 85, 248, 31, 2, 120, 92, 20, 25, 127, 68, 36, 240, 29, 92, 134, 178, 174, 139, 192]);
    await _receiveAdvertisementTest(this.obniz, false, [4, 62, 43, 2, 1, 2, 0, 200, 220, 43, 84, 171, 240, 31, 30, 255, 16, 5, 5, 5, 84, 68, 76, 111, 103, 116, 116, 97, 0, 0, 5, 0, 4, 0, 7, 8, 64, 96, 124, 106, 0, 0, 0, 0, 0, 177]);
    await _receiveAdvertisementTest(this.obniz, false, [4, 62, 12, 2, 1, 4, 0, 26, 101, 171, 137, 92, 244, 0, 184]);
    await _receiveAdvertisementTest(this.obniz, false, [4, 62, 39, 2, 1, 0, 0, 35, 72, 71, 152, 36, 76, 27, 2, 1, 4, 17, 6, 161, 3, 221, 115, 3, 24, 238, 155, 89, 28, 27, 58, 0, 129, 62, 35, 5, 18, 16, 0, 240, 0, 174]);

    //localnamePrefix filter
    await _scanStartTestWait(this.obniz, { localNamePrefix: "Pa" }, true);
    await _receiveAdvertisementTest(this.obniz, false, [4, 62, 43, 2, 1, 0, 1, 111, 79, 102, 162, 248, 197, 31, 2, 1, 6, 14, 255, 74, 5, 18, 215, 12, 121, 0, 250, 5, 153, 130, 244, 72, 12, 9, 78, 76, 77, 48, 48, 48, 48, 48, 53, 50, 52, 168]);
    await _receiveAdvertisementTest(this.obniz, false, [4, 62, 12, 2, 1, 4, 1, 0, 166, 134, 140, 138, 78, 0, 169]);
    await _receiveAdvertisementTest(this.obniz, false, [4, 62, 29, 2, 1, 0, 0, 20, 36, 183, 131, 21, 0, 17, 2, 1, 2, 3, 3, 231, 254, 9, 255, 0, 0, 0, 21, 131, 183, 36, 20, 186]);
    await _receiveAdvertisementTest(this.obniz, false, [4, 62, 43, 2, 1, 3, 1, 93, 73, 184, 157, 236, 6, 31, 30, 255, 6, 0, 1, 9, 32, 2, 14, 143, 137, 73, 15, 85, 248, 31, 2, 120, 92, 20, 25, 127, 68, 36, 240, 29, 92, 134, 178, 174, 139, 192]);
    await _receiveAdvertisementTest(this.obniz, false, [4, 62, 43, 2, 1, 2, 0, 200, 220, 43, 84, 171, 240, 31, 30, 255, 16, 5, 5, 5, 84, 68, 76, 111, 103, 116, 116, 97, 0, 0, 5, 0, 4, 0, 7, 8, 64, 96, 124, 106, 0, 0, 0, 0, 0, 177]);
    await _receiveAdvertisementTest(this.obniz, false, [4, 62, 12, 2, 1, 4, 0, 26, 101, 171, 137, 92, 244, 0, 184]);
    await _receiveAdvertisementTest(this.obniz, false, [4, 62, 23, 2, 1, 4, 0, 35, 72, 71, 152, 36, 76, 11, 2, 10, 0, 7, 9, 80, 97, 83, 111, 82, 105, 177]);
    await _receiveAdvertisementTest(this.obniz, true, [4, 62, 39, 2, 1, 0, 0, 35, 72, 71, 152, 36, 76, 27, 2, 1, 4, 17, 6, 161, 3, 221, 115, 3, 24, 238, 155, 89, 28, 27, 58, 0, 129, 62, 35, 5, 18, 16, 0, 240, 0, 174]);

    //localname filter
    await _scanStartTestWait(this.obniz, { localName: "Pa" }, true);
    await _receiveAdvertisementTest(this.obniz, false, [4, 62, 43, 2, 1, 0, 1, 111, 79, 102, 162, 248, 197, 31, 2, 1, 6, 14, 255, 74, 5, 18, 215, 12, 121, 0, 250, 5, 153, 130, 244, 72, 12, 9, 78, 76, 77, 48, 48, 48, 48, 48, 53, 50, 52, 168]);
    await _receiveAdvertisementTest(this.obniz, false, [4, 62, 12, 2, 1, 4, 1, 0, 166, 134, 140, 138, 78, 0, 169]);
    await _receiveAdvertisementTest(this.obniz, false, [4, 62, 29, 2, 1, 0, 0, 20, 36, 183, 131, 21, 0, 17, 2, 1, 2, 3, 3, 231, 254, 9, 255, 0, 0, 0, 21, 131, 183, 36, 20, 186]);
    await _receiveAdvertisementTest(this.obniz, false, [4, 62, 43, 2, 1, 3, 1, 93, 73, 184, 157, 236, 6, 31, 30, 255, 6, 0, 1, 9, 32, 2, 14, 143, 137, 73, 15, 85, 248, 31, 2, 120, 92, 20, 25, 127, 68, 36, 240, 29, 92, 134, 178, 174, 139, 192]);
    await _receiveAdvertisementTest(this.obniz, false, [4, 62, 43, 2, 1, 2, 0, 200, 220, 43, 84, 171, 240, 31, 30, 255, 16, 5, 5, 5, 84, 68, 76, 111, 103, 116, 116, 97, 0, 0, 5, 0, 4, 0, 7, 8, 64, 96, 124, 106, 0, 0, 0, 0, 0, 177]);
    await _receiveAdvertisementTest(this.obniz, false, [4, 62, 12, 2, 1, 4, 0, 26, 101, 171, 137, 92, 244, 0, 184]);
    await _receiveAdvertisementTest(this.obniz, false, [4, 62, 23, 2, 1, 4, 0, 35, 72, 71, 152, 36, 76, 11, 2, 10, 0, 7, 9, 80, 97, 83, 111, 82, 105, 177]);
    await _receiveAdvertisementTest(this.obniz, false, [4, 62, 39, 2, 1, 0, 0, 35, 72, 71, 152, 36, 76, 27, 2, 1, 4, 17, 6, 161, 3, 221, 115, 3, 24, 238, 155, 89, 28, 27, 58, 0, 129, 62, 35, 5, 18, 16, 0, 240, 0, 174]);

    //localname filter
    await _scanStartTestWait(this.obniz, { localName: "PaSoRi" }, true);
    await _receiveAdvertisementTest(this.obniz, false, [4, 62, 43, 2, 1, 0, 1, 111, 79, 102, 162, 248, 197, 31, 2, 1, 6, 14, 255, 74, 5, 18, 215, 12, 121, 0, 250, 5, 153, 130, 244, 72, 12, 9, 78, 76, 77, 48, 48, 48, 48, 48, 53, 50, 52, 168]);
    await _receiveAdvertisementTest(this.obniz, false, [4, 62, 12, 2, 1, 4, 1, 0, 166, 134, 140, 138, 78, 0, 169]);
    await _receiveAdvertisementTest(this.obniz, false, [4, 62, 29, 2, 1, 0, 0, 20, 36, 183, 131, 21, 0, 17, 2, 1, 2, 3, 3, 231, 254, 9, 255, 0, 0, 0, 21, 131, 183, 36, 20, 186]);
    await _receiveAdvertisementTest(this.obniz, false, [4, 62, 43, 2, 1, 3, 1, 93, 73, 184, 157, 236, 6, 31, 30, 255, 6, 0, 1, 9, 32, 2, 14, 143, 137, 73, 15, 85, 248, 31, 2, 120, 92, 20, 25, 127, 68, 36, 240, 29, 92, 134, 178, 174, 139, 192]);
    await _receiveAdvertisementTest(this.obniz, false, [4, 62, 43, 2, 1, 2, 0, 200, 220, 43, 84, 171, 240, 31, 30, 255, 16, 5, 5, 5, 84, 68, 76, 111, 103, 116, 116, 97, 0, 0, 5, 0, 4, 0, 7, 8, 64, 96, 124, 106, 0, 0, 0, 0, 0, 177]);
    await _receiveAdvertisementTest(this.obniz, false, [4, 62, 12, 2, 1, 4, 0, 26, 101, 171, 137, 92, 244, 0, 184]);
    await _receiveAdvertisementTest(this.obniz, false, [4, 62, 23, 2, 1, 4, 0, 35, 72, 71, 152, 36, 76, 11, 2, 10, 0, 7, 9, 80, 97, 83, 111, 82, 105, 177]);
    await _receiveAdvertisementTest(this.obniz, true, [4, 62, 39, 2, 1, 0, 0, 35, 72, 71, 152, 36, 76, 27, 2, 1, 4, 17, 6, 161, 3, 221, 115, 3, 24, 238, 155, 89, 28, 27, 58, 0, 129, 62, 35, 5, 18, 16, 0, 240, 0, 174]);

    //multi filter
    await _scanStartTestWait(this.obniz, { localName: "PaSoRi", uuids: ["fee7"], deviceAddress: "f45c89ab651a" }, true);
    await _receiveAdvertisementTest(this.obniz, false, [4, 62, 43, 2, 1, 0, 1, 111, 79, 102, 162, 248, 197, 31, 2, 1, 6, 14, 255, 74, 5, 18, 215, 12, 121, 0, 250, 5, 153, 130, 244, 72, 12, 9, 78, 76, 77, 48, 48, 48, 48, 48, 53, 50, 52, 168]);
    await _receiveAdvertisementTest(this.obniz, false, [4, 62, 12, 2, 1, 4, 1, 0, 166, 134, 140, 138, 78, 0, 169]);
    await _receiveAdvertisementTest(this.obniz, true, [4, 62, 29, 2, 1, 0, 0, 20, 36, 183, 131, 21, 0, 17, 2, 1, 2, 3, 3, 231, 254, 9, 255, 0, 0, 0, 21, 131, 183, 36, 20, 186]);
    await _receiveAdvertisementTest(this.obniz, false, [4, 62, 43, 2, 1, 3, 1, 93, 73, 184, 157, 236, 6, 31, 30, 255, 6, 0, 1, 9, 32, 2, 14, 143, 137, 73, 15, 85, 248, 31, 2, 120, 92, 20, 25, 127, 68, 36, 240, 29, 92, 134, 178, 174, 139, 192]);
    await _receiveAdvertisementTest(this.obniz, false, [4, 62, 43, 2, 1, 2, 0, 200, 220, 43, 84, 171, 240, 31, 30, 255, 16, 5, 5, 5, 84, 68, 76, 111, 103, 116, 116, 97, 0, 0, 5, 0, 4, 0, 7, 8, 64, 96, 124, 106, 0, 0, 0, 0, 0, 177]);
    await _receiveAdvertisementTest(this.obniz, true, [4, 62, 12, 2, 1, 4, 0, 26, 101, 171, 137, 92, 244, 0, 184]);
    await _receiveAdvertisementTest(this.obniz, false, [4, 62, 23, 2, 1, 4, 0, 35, 72, 71, 152, 36, 76, 11, 2, 10, 0, 7, 9, 80, 97, 83, 111, 82, 105, 177]);
    await _receiveAdvertisementTest(this.obniz, true, [4, 62, 39, 2, 1, 0, 0, 35, 72, 71, 152, 36, 76, 27, 2, 1, 4, 17, 6, 161, 3, 221, 115, 3, 24, 238, 155, 89, 28, 27, 58, 0, 129, 62, 35, 5, 18, 16, 0, 240, 0, 174]);

    /* eslint-enable */
  });

  it('connect', async function () {
    this.timeout(10 * 1000);
    await _initWaitTestWait(this.obniz);

    /* eslint-disable */

    //non filter
    await _scanStartTestWait(this.obniz, {});

    const peripheral = await _receiveAdvertisementTest(this.obniz, true, [4, 62, 37, 2, 1, 0, 1, 130, 168, 133, 213, 252, 115, 25, 2, 1, 26, 2, 10, 12, 7, 3, 240, 255, 241, 255, 0, 255, 10, 9, 111, 98, 110, 105, 122, 45, 66, 76, 69, 213]);
    const connectStub = sinon.stub();
    const disconnectStub = sinon.stub();
    peripheral.onconnect = connectStub;
    peripheral.ondisconnect = disconnectStub;

    const p = peripheral.connectWait({ autoDiscovery: false });
    await wait(0);

    // scan stop
    sendHciCommands(this.obniz, [1, 12, 32, 2, 0, 1]);
    await receiveHciCommandsWait(this.obniz, [4, 14, 4, 5, 12, 32, 12]);
    // connect req
    sendHciCommands(this.obniz, [1, 13, 32, 25, 16, 0, 16, 0, 0, 1, 130, 168, 133, 213, 252, 115, 0, 9, 0, 24, 0, 1, 0, 144, 1, 0, 0, 0, 0]);

    await wait(0);
    sinon.assert.callCount(connectStub, 0);
    sinon.assert.callCount(disconnectStub, 0);
    // connection established
    await receiveHciCommandsWait(this.obniz, [4, 62, 19, 1, 0, 0, 0, 0, 1, 130, 168, 133, 213, 252, 115, 12, 0, 0, 0, 200, 0, 0]);


    // exchange MTU
    sendHciCommands(this.obniz, [2, 0, 0, 7, 0, 3, 0, 4, 0, 2, 0, 1]);
    // EVT_NUMBER_OF_COMPLETED_PACKETS
    await receiveHciCommandsWait(this.obniz, [4, 19, 5, 1, 0, 0, 1, 0]);
    // MTU response
    await receiveHciCommandsWait(this.obniz, [2, 0, 32, 7, 0, 3, 0, 4, 0, 3, 0, 1]);

    await p;

    await wait(0);

    sinon.assert.callCount(connectStub, 1);
    sinon.assert.callCount(disconnectStub, 0);

    //disconnect
    await receiveHciCommandsWait(this.obniz, [4, 5, 4, 0, 0, 0, 19]);

    await wait(0);
    sinon.assert.callCount(connectStub, 1);
    sinon.assert.callCount(disconnectStub, 1);

  });


  it('connect and receive read requet', async function () {
    this.timeout(10 * 1000);
    await _initWaitTestWait(this.obniz);

    /* eslint-disable */

    //non filter
    await _scanStartTestWait(this.obniz, {});

    const peripheral = await _receiveAdvertisementTest(this.obniz, true, [4, 62, 37, 2, 1, 0, 1, 130, 168, 133, 213, 252, 115, 25, 2, 1, 26, 2, 10, 12, 7, 3, 240, 255, 241, 255, 0, 255, 10, 9, 111, 98, 110, 105, 122, 45, 66, 76, 69, 213]);
    const connectStub = sinon.stub();
    const disconnectStub = sinon.stub();
    peripheral.onconnect = connectStub;
    peripheral.ondisconnect = disconnectStub;

    const p = peripheral.connectWait({ autoDiscovery: false, mtuRequest:null  });
    await wait(0);

    // scan stop
    sendHciCommands(this.obniz, [1, 12, 32, 2, 0, 1]);
    await receiveHciCommandsWait(this.obniz, [4, 14, 4, 5, 12, 32, 12]);
    // connect req
    sendHciCommands(this.obniz, [1, 13, 32, 25, 16, 0, 16, 0, 0, 1, 130, 168, 133, 213, 252, 115, 0, 9, 0, 24, 0, 1, 0, 144, 1, 0, 0, 0, 0]);

    await wait(0);
    sinon.assert.callCount(connectStub, 0);
    sinon.assert.callCount(disconnectStub, 0);
    // connection established
    await receiveHciCommandsWait(this.obniz, [4, 62, 19, 1, 0, 0, 0, 0, 1, 130, 168, 133, 213, 252, 115, 12, 0, 0, 0, 200, 0, 0]);

    await p;

    await wait(0);

    sinon.assert.callCount(connectStub, 1);
    sinon.assert.callCount(disconnectStub, 0);



    //disconnect
    await receiveHciCommandsWait(this.obniz, [4, 5, 4, 0, 0, 0, 19]);

    await wait(0);
    sinon.assert.callCount(connectStub, 1);
    sinon.assert.callCount(disconnectStub, 1);

  });


  it('scan terminated', async function () {
    await _initWaitTestWait(this.obniz);

    const p = this.obniz.ble.scan.startWait();
    // expect(obniz).send([{ ble: { hci: { advertisement_filter: [] } } }]);  //os ver >= 3.2.0

    // expect(this.obniz).send([
    //   {
    //     ble: {
    //       hci: {
    //         write: [1, 12, 32, 2, 0, 1],
    //       },
    //     },
    //   },
    // ]);
    // no response
    testUtil.closeAndReconnectObnizWait(this);

    expect(async () => {
      await p;
    }).to.throw;

    await _initWaitTestWait(this.obniz);
  });


  async function _initWaitTestWait(obniz) {
    const p = obniz.ble.initWait();

    expect(obniz).send([
      {
        ble: {
          hci: {
            initialize: true,
          },
        },
      },
    ]);
    expect(obniz).send([
      {
        ble: {
          hci: null,
        },
      },
    ]);
    expect(obniz).send([
      {
        ble: {
          hci: {
            initialize: true,
          },
        },
      },
    ]);

    let commands = [
      [0x01, 0x03, 0x0c, 0x0], // reset
    ];

    for (let command of commands) {
      expect(obniz).send([
        {
          ble: {
            hci: {
              write: command,
            },
          },
        },
      ]);
    }

    expect(obniz).to.be.finished;

    let results = [
      {
        ble: {
          hci: {
            read: {
              data: [4, 14, 4, 5, 3, 12, 0],
            },
          },
        },
      },
    ];
    testUtil.receiveJson(obniz, results);
    await wait(0);
    let secondCommands = [
      [0x01, 0x01, 0x0c, 0x08, 0xff, 0xff, 0xfb, 0xff, 0x07, 0xf8, 0xbf, 0x3d], //setEventMaskCommand
      [0x01, 0x01, 0x20, 0x08, 0x1f, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00], //setLeEventMaskCommand
      [0x01, 0x01, 0x10, 0x00], //readLocalVersion
    ];
    sendMultiCommands(obniz, secondCommands);
    expect(obniz).to.be.finished;
    let response = [
      [4, 14, 4, 5, 0x01, 0x0c, 0],  // setEventMaskCommand comp
      [4, 14, 4, 5, 0x01, 0x20, 0], // setLeEventMaskCommand comp
      [4, 14, 12, 5, 0x01, 0x10, 0, 8, 14, 3, 8, 96, 0, 14, 3], //readLocalVersion comp
    ];
    await receiveMultiCommandsWait(obniz, response);

    sendMultiCommands(obniz, [
      [0x01, 0x6d, 0x0c, 0x02, 0x01, 0x00], //writeLeHostSupportedCommand
      [0x01, 0x6c, 0x0c, 0x00], //readLeHostSupported
    ]);
    expect(obniz).to.be.finished;
    await receiveMultiCommandsWait(obniz, [
      [4, 14, 4, 5, 0x6d, 0x0c, 0], //writeLeHostSupportedCommand comp
      [4, 14, 6, 5, 0x6c, 0x0c, 0, 1, 0], //readLeHostSupported comp
    ]);

    sendMultiCommands(obniz, [
      [0x01, 0x09, 0x10, 0x00], //readBdAddr
    ]);
    expect(obniz).to.be.finished;
    await receiveMultiCommandsWait(obniz, [
      [4, 14, 10, 5, 0x09, 0x10, 0, 214, 24, 141, 227, 80, 204], //readBdAddr
    ]);

    sendMultiCommands(obniz, [
      [0x01, 0x02, 0x20, 0x00], //leReadBufferSize
    ]);
    expect(obniz).to.be.finished;
    await receiveMultiCommandsWait(obniz, [
      [4, 14, 7, 5, 0x02, 0x20, 0, 251, 0, 10], //leReadBufferSize comp
    ]);

    sendMultiCommands(obniz, [
      [1, 12, 32, 2, 0, 1], //scan disable
    ]);
    expect(obniz).to.be.finished;
    await receiveMultiCommandsWait(obniz, [
      [4, 14, 4, 5, 12, 32, 12], //scan disable error: already disable
    ]);
    sendMultiCommands(obniz, [
      [1, 11, 32, 7, 0, 16, 0, 16, 0, 0, 0], //set scan parameter
    ]);
    expect(obniz).to.be.finished;
    await receiveMultiCommandsWait(obniz, [
      [4, 14, 4, 5, 11, 32, 0],  //set scan parameter  comp
    ]);
    await p;
  }

  async function _scanStartTestWait(obniz, target = {}, mustReset) {
    const p = obniz.ble.scan.startWait(target);
    // expect(obniz).send([{ ble: { hci: { advertisement_filter: [] } } }]);  //os ver >= 3.2.0

    if (mustReset) {
      expect(obniz).send([
        {
          ble: {
            hci: {
              write: [1, 12, 32, 2, 0, 1],
            },
          },
        },
      ]);
      testUtil.receiveJson(obniz, [
        {
          ble: { hci: { read: { data: [4, 14, 4, 5, 12, 32, 12] } } },
        },
      ]);
    }


    await wait(0);
    expect(obniz).send([
      { ble: { hci: { write: [1, 11, 32, 7, 1, 16, 0, 16, 0, 0, 0] } } },
    ]);
    testUtil.receiveJson(obniz, [
      {
        ble: { hci: { read: { data: [4, 14, 4, 5, 11, 32, 0] } } },
      },
    ]);
    await wait(1010);
    expect(obniz).send([{ ble: { hci: { write: [1, 12, 32, 2, 1, 1] } } }]);
    testUtil.receiveJson(obniz, [
      {
        ble: { hci: { read: { data: [4, 14, 4, 5, 12, 32, 0] } } },
      },
    ]);
    await p;
  }

  async function _receiveAdvertisementTest(obniz, detect, hci) {
    let stub = sinon.stub();
    obniz.ble.scan.onfind = stub;

    testUtil.receiveJson(obniz, [
      {
        ble: { hci: { read: { data: hci } } },
      },
    ]);

    //receive advertisement second
    testUtil.receiveJson(obniz, [
      {
        ble: { hci: { read: { data: hci } } },
      },
    ]);
    await wait(0);

    if (!detect) {
      sinon.assert.callCount(stub, 0);
    } else if (stub.callCount === 1) {
      // ok
      return stub.getCall(0).args[0];
    } else if (stub.callCount === 2) {
      expect(stub.getCall(0).args[0] === stub.getCall(0).args[1]).to.be.true;
    } else {
      throw new Error("advertisement must be detect");
    }

  }
});

function sendHciCommands(obniz, command) {

  expect(obniz).send([
    {
      ble: {
        hci: {
          write: command,
        },
      },
    },
  ]);
}

function sendMultiCommands(obniz, secondCommands) {

  for (let command of secondCommands) {
    expect(obniz).send([
      {
        ble: {
          hci: {
            write: command,
          },
        },
      },
    ]);
  }
}

async function receiveHciCommandsWait(obniz, command) {
  testUtil.receiveJson(obniz, [
    { "ble": { "hci": { "read": { "data": command } } } }
    ,
  ]);
  await wait(0);
}

async function receiveMultiCommandsWait(obniz, response) {
  for (let command of response) {
    testUtil.receiveJson(obniz, [
      { "ble": { "hci": { "read": { "data": command } } } }
      ,
    ]);
  }
  await wait(0);
}

function wait(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

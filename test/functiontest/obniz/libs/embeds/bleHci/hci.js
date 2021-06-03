const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

const testUtil = require('../../../../testUtil.js');

describe('ble-security', function () {
  beforeEach(async function () {
    await testUtil.setupObnizWait(this, null, { __firmware_ver: '3.0.0' });
  });

  afterEach(async function () {
    await testUtil.releaseObnizWait(this);
  });

  it('write', function () {
    this.obniz.ble.hci.write([0, 1, 2, 3, 4, 5, 22, 1]);

    expect(this.obniz).send([
      { ble: { hci: { write: [0, 1, 2, 3, 4, 5, 22, 1] } } },
    ]);
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

  it('error', function () {
    const error = this.obniz.error;
    this.obniz.error = sinon.stub();
    testUtil.receiveJson(this.obniz, [
      {
        ble: {
          error: {
            module_error_code: 0,
            error_code: 255,
            function_code: 43,
            address: '',
            service_uuid: '',
            characteristic_uuid: '',
            descriptor_uuid: '',
            message: 'error undefined',
          },
        },
      },
    ]);

    expect(this.obniz.error.callCount).to.be.equal(1);
    expect(this.obniz.error.getCall(0).args.length).to.be.equal(1);
    expect(this.obniz.error.getCall(0).args[0]).to.be.deep.equal({
      alert: 'error',
      message:
        'BLE error: error undefined (error_code: 255, module_error_code: 0, function_code: 43, address: , service_uuid: , characteristic_uuid: , descriptor_uuid: )',
    });
    this.obniz.error = error;

    expect(this.obniz).to.be.finished;
  });

  it('error2', function () {
    const error = this.obniz.error;
    this.obniz.error = sinon.stub();
    testUtil.receiveJson(this.obniz, [
      {
        ble: {
          error: {
            module_error_code: 0,
            error_code: 255,
            function_code: 43,
            address: '77e754ab8591',
            service_uuid: 'e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e',
            characteristic_uuid: '8d3591bda71140fd8f9f00535fe57179',
            descriptor_uuid: 'd822b53c',
            message: 'error undefined',
          },
        },
      },
    ]);

    expect(this.obniz.error.callCount).to.be.equal(1);
    expect(this.obniz.error.getCall(0).args.length).to.be.equal(1);
    expect(this.obniz.error.getCall(0).args[0]).to.be.deep.equal({
      alert: 'error',
      message:
        'BLE error: error undefined (error_code: 255, module_error_code: 0, function_code: 43, address: 77e754ab8591, service_uuid: e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e, characteristic_uuid: 8d3591bda71140fd8f9f00535fe57179, descriptor_uuid: d822b53c)',
    });
    this.obniz.error = error;

    expect(this.obniz).to.be.finished;
  });
});

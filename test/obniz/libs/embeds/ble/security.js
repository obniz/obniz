let chai = require('chai');
let expect = chai.expect;
let sinon = require('sinon');

let testUtil = require('../../../../testUtil.js');
chai.use(require('chai-like'));
chai.use(testUtil.obnizAssert);

describe('ble-security', function() {
  beforeEach(function(done) {
    return testUtil.setupObnizPromise(this, done);
  });

  afterEach(function(done) {
    return testUtil.releaseObnizePromise(this, done);
  });

  it('set security bonding', function() {
    this.obniz.ble.security.setAuth(['bonding']);

    expect(this.obniz).send([{ ble: { security: { auth: ['bonding'] } } }]);
    expect(this.obniz).to.be.finished;
  });

  it('set security mitm', function() {
    this.obniz.ble.security.setAuth(['mitm']);

    expect(this.obniz).send([{ ble: { security: { auth: ['mitm'] } } }]);
    expect(this.obniz).to.be.finished;
  });

  it('set security sc', function() {
    this.obniz.ble.security.setAuth(['secure_connection']);

    expect(this.obniz).send([
      { ble: { security: { auth: ['secure_connection'] } } },
    ]);
    expect(this.obniz).to.be.finished;
  });

  it('set encription none', function() {
    this.obniz.ble.security.setEncryptionLevel('none');

    expect(this.obniz).send([
      { ble: { security: { encryption_level: 'none' } } },
    ]);
    expect(this.obniz).to.be.finished;
  });
  it('set encription encryption', function() {
    this.obniz.ble.security.setEncryptionLevel('encryption');

    expect(this.obniz).send([
      { ble: { security: { encryption_level: 'encryption' } } },
    ]);
    expect(this.obniz).to.be.finished;
  });
  it('set encription mitm', function() {
    this.obniz.ble.security.setEncryptionLevel('mitm');

    expect(this.obniz).send([
      { ble: { security: { encryption_level: 'mitm' } } },
    ]);
    expect(this.obniz).to.be.finished;
  });

  it('set key type ltk', function() {
    this.obniz.ble.security.setEnableKeyTypes(['ltk']);

    expect(this.obniz).send([
      { ble: { security: { key: { type: ['ltk'] } } } },
    ]);
    expect(this.obniz).to.be.finished;
  });

  it('set key type irk', function() {
    this.obniz.ble.security.setEnableKeyTypes(['irk']);

    expect(this.obniz).send([
      { ble: { security: { key: { type: ['irk'] } } } },
    ]);
    expect(this.obniz).to.be.finished;
  });

  it('set key type csrk', function() {
    this.obniz.ble.security.setEnableKeyTypes(['csrk']);

    expect(this.obniz).send([
      { ble: { security: { key: { type: ['csrk'] } } } },
    ]);
    expect(this.obniz).to.be.finished;
  });

  it('set key type none', function() {
    this.obniz.ble.security.setEnableKeyTypes([]);

    expect(this.obniz).send([{ ble: { security: { key: { type: [] } } } }]);
    expect(this.obniz).to.be.finished;
  });

  it('set key type multi', function() {
    this.obniz.ble.security.setEnableKeyTypes(['LTK', 'IRK']);

    expect(this.obniz).send([
      { ble: { security: { key: { type: ['ltk', 'irk'] } } } },
    ]);
    expect(this.obniz).to.be.finished;
  });

  it('set key size 16', function() {
    this.obniz.ble.security.setKeyMaxSize(16);

    expect(this.obniz).send([{ ble: { security: { key: { max_size: 16 } } } }]);
    expect(this.obniz).to.be.finished;
  });

  it('set key size 7 ', function() {
    this.obniz.ble.security.setKeyMaxSize(7);

    expect(this.obniz).send([{ ble: { security: { key: { max_size: 7 } } } }]);
    expect(this.obniz).to.be.finished;
  });

  it('on scan finished', function() {
    let stub1 = sinon.stub();

    this.obniz.ble.security.onerror = stub1;

    this.obniz.ble.security.setEnableKeyTypes(['LTK', 'IRK']);
    expect(this.obniz).send([
      { ble: { security: { key: { type: ['ltk', 'irk'] } } } },
    ]);

    let results = [
      {
        ble: {
          error: {
            module_error_code: 0,
            error_code: 9,
            function_code: 37,
            address: '000000000000',
            service_uuid: null,
            characteristic_uuid: null,
            descriptor_uuid: null,
            message:
              'security param are already set on set security key type param',
          },
        },
      },
    ];

    sinon.assert.callCount(stub1, 0);

    testUtil.receiveJson(this.obniz, results);

    sinon.assert.callCount(stub1, 1);

    let params = stub1.getCall(0).args[0];
    expect(params).to.be.deep.equal({
      module_error_code: 0,
      error_code: 9,
      function_code: 37,
      address: '000000000000',
      service_uuid: null,
      characteristic_uuid: null,
      descriptor_uuid: null,
      message: 'security param are already set on set security key type param',
    });

    expect(this.obniz).to.be.finished;
  });
});

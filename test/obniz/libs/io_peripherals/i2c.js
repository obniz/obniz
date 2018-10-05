let chai = require('chai');
let expect = chai.expect;
let sinon = require('sinon');

let testUtil = require('../../../testUtil.js');
chai.use(require('chai-like'));
chai.use(testUtil.obnizAssert);

describe('obniz.libs.i2c', function() {
  beforeEach(function(done) {
    return testUtil.setupObnizPromise(this, done);
  });

  afterEach(function(done) {
    return testUtil.releaseObnizePromise(this, done);
  });

  it('start', function() {
    this.obniz.i2c0.start({
      mode: 'master',
      sda: 2,
      scl: 3,
      clock: 400000,
      pull: null,
    });
    expect(this.obniz).send([{ io2: { output_type: 'open-drain' } }]);
    expect(this.obniz).send([{ io3: { output_type: 'open-drain' } }]);
    expect(this.obniz).send([{ io2: { pull_type: 'float' } }]);
    expect(this.obniz).send([{ io3: { pull_type: 'float' } }]);
    expect(this.obniz).send([
      { i2c0: { clock: 400000, sda: 2, scl: 3, mode: 'master' } },
    ]);
    expect(this.obniz).to.be.finished;
  });

  it('startWithGnd', function() {
    this.obniz.i2c0.start({
      mode: 'master',
      sda: 2,
      scl: 3,
      clock: 400000,
      pull: null,
      gnd: 0,
    });
    expect(this.obniz).send([{ io2: { output_type: 'open-drain' } }]);
    expect(this.obniz).send([{ io3: { output_type: 'open-drain' } }]);
    expect(this.obniz).send([{ io2: { pull_type: 'float' } }]);
    expect(this.obniz).send([{ io3: { pull_type: 'float' } }]);
    expect(this.obniz).send([{ io0: false }]);
    expect(this.obniz).send([
      {
        display: {
          pin_assign: {
            '0': {
              module_name: 'i2c0',
              pin_name: 'gnd',
            },
          },
        },
      },
    ]);
    expect(this.obniz).send([
      { i2c0: { clock: 400000, sda: 2, scl: 3, mode: 'master' } },
    ]);
    expect(this.obniz).to.be.finished;
  });

  it('end', function() {
    this.obniz.i2c0.start({
      mode: 'master',
      sda: 2,
      scl: 3,
      clock: 400000,
      pull: '5v',
    });
    expect(this.obniz).send([{ io2: { output_type: 'open-drain' } }]);
    expect(this.obniz).send([{ io3: { output_type: 'open-drain' } }]);
    expect(this.obniz).send([{ io2: { pull_type: 'pull-up5v' } }]);
    expect(this.obniz).send([{ io3: { pull_type: 'pull-up5v' } }]);
    expect(this.obniz).send([
      { i2c0: { clock: 400000, sda: 2, scl: 3, mode: 'master' } },
    ]);

    this.obniz.i2c0.end();
    expect(this.obniz).send([{ i2c0: null }]);
  });

  it('write', function() {
    this.obniz.i2c0.start({
      mode: 'master',
      sda: 2,
      scl: 3,
      clock: 400000,
      pull: '5v',
    });
    expect(this.obniz).send([{ io2: { output_type: 'open-drain' } }]);
    expect(this.obniz).send([{ io3: { output_type: 'open-drain' } }]);
    expect(this.obniz).send([{ io2: { pull_type: 'pull-up5v' } }]);
    expect(this.obniz).send([{ io3: { pull_type: 'pull-up5v' } }]);
    expect(this.obniz).send([
      { i2c0: { clock: 400000, sda: 2, scl: 3, mode: 'master' } },
    ]);

    this.obniz.i2c0.write(0x50, [0x00, 0x00, 0x12]);
    expect(this.obniz).send([
      { i2c0: { address: 0x50, data: [0x00, 0x00, 0x12] } },
    ]);
  });

  it.skip('write10bit', function() {
    this.obniz.i2c0.start({
      mode: 'master',
      sda: 2,
      scl: 3,
      clock: 100000,
      pull: '3v',
    });
    expect(this.obniz).send([{ io2: { output_type: 'open-drain' } }]);
    expect(this.obniz).send([{ io3: { output_type: 'open-drain' } }]);
    expect(this.obniz).send([{ io2: { pull_type: 'pull-up5v' } }]);
    expect(this.obniz).send([{ io3: { pull_type: 'pull-up5v' } }]);
    expect(this.obniz).send([
      { i2c0: { clock: 100000, sda: 2, scl: 3, mode: 'master' } },
    ]);

    this.obniz.i2c0.write10bit(0x50, [0x00, 0x00, 0x12]);
    expect(this.obniz).send([
      {
        i2c0: {
          address: 0x50,
          address_type: '10bit',
          data: [0x00, 0x00, 0x12],
        },
      },
    ]);
  });

  it('readWait', function() {
    this.obniz.i2c0.start({
      mode: 'master',
      sda: 2,
      scl: 3,
      clock: 100000,
      pull: '3v',
    });
    expect(this.obniz).send([{ io2: { output_type: 'open-drain' } }]);
    expect(this.obniz).send([{ io3: { output_type: 'open-drain' } }]);
    expect(this.obniz).send([{ io2: { pull_type: 'pull-up3v' } }]);
    expect(this.obniz).send([{ io3: { pull_type: 'pull-up3v' } }]);
    expect(this.obniz).send([
      { i2c0: { clock: 100000, sda: 2, scl: 3, mode: 'master' } },
    ]);

    let r = this.obniz.i2c0.readWait(0x50, 3).then(
      function(value) {
        expect(value).to.be.deep.equal([0x61, 0xf2, 0x1f]);
        expect(this.obniz).to.be.finished;
      }.bind(this)
    );

    expect(this.obniz).send([{ i2c0: { address: 0x50, read: 3 } }]);
    setTimeout(
      function() {
        testUtil.receiveJson(this.obniz, [
          { i2c0: { mode: 'master', address: 0x50, data: [0x61, 0xf2, 0x1f] } },
        ]);
      }.bind(this),
      10
    );
    return r;
  });

  it.skip('readWait invalid length', function() {
    this.obniz.i2c0.start({
      mode: 'master',
      sda: 2,
      scl: 3,
      clock: 100000,
      pull: '3v',
    });
    expect(this.obniz).send([{ io2: { output_type: 'open-drain' } }]);
    expect(this.obniz).send([{ io3: { output_type: 'open-drain' } }]);
    expect(this.obniz).send([{ io2: { pull_type: 'pull-up3v' } }]);
    expect(this.obniz).send([{ io3: { pull_type: 'pull-up3v' } }]);
    expect(this.obniz).send([
      { i2c0: { clock: 100000, sda: 2, scl: 3, mode: 'master' } },
    ]);

    let r = this.obniz.i2c0.readWait(0x50, 3).then(
      function(value) {
        expect(value).to.lengthOf(3);
        expect(this.obniz).to.be.finished;
      }.bind(this)
    );

    expect(this.obniz).send([{ i2c0: { address: 0x50, read: 3 } }]);
    setTimeout(
      function() {
        testUtil.receiveJson(this.obniz, [
          { i2c0: { address: 0x50, data: [0x61, 0xf2] } },
        ]);
      }.bind(this),
      10
    );
    return r;
  });
  it.skip('readWait withothers', function() {
    this.obniz.i2c0.start({
      mode: 'master',
      sda: 2,
      scl: 3,
      clock: 100000,
      pullType: 'pull-up3v',
    });
    expect(this.obniz).send([{ io2: { output_type: 'open-drain' } }]);
    expect(this.obniz).send([{ io3: { output_type: 'open-drain' } }]);
    expect(this.obniz).send([{ io2: { pull_type: 'pull-up3v' } }]);
    expect(this.obniz).send([{ io3: { pull_type: 'pull-up3v' } }]);
    expect(this.obniz).send([
      { i2c0: { clock: 100000, sda: 2, scl: 3, mode: 'master' } },
    ]);

    let r = this.obniz.i2c0.readWait(0x50, 3).then(
      function(value) {
        expect(value).to.be.deep.equal([0x61, 0xf2, 0x1f]);
        expect(this.obniz).to.be.finished;
      }.bind(this)
    );

    expect(this.obniz).send([{ i2c0: { address: 0x50, read: 3 } }]);
    setTimeout(
      function() {
        testUtil.receiveJson(this.obniz, [
          { i2c0: { address: 0x51, data: [0xaa, 0xbb, 0xcc] } },
        ]);
        testUtil.receiveJson(this.obniz, [
          { i2c0: { address: 0x50, data: [0x61, 0xf2, 0x1f] } },
        ]);
      }.bind(this),
      10
    );
    return r;
  });

  it.skip('readWait10bit', function() {
    this.obniz.i2c0.start({
      mode: 'master',
      sda: 2,
      scl: 3,
      clock: 100000,
      pull: '3v',
    });
    expect(this.obniz).send([{ io2: { output_type: 'open-drain' } }]);
    expect(this.obniz).send([{ io3: { output_type: 'open-drain' } }]);
    expect(this.obniz).send([{ io2: { pull_type: 'pull-up3v' } }]);
    expect(this.obniz).send([{ io3: { pull_type: 'pull-up3v' } }]);
    expect(this.obniz).send([
      { i2c0: { clock: 100000, sda: 2, scl: 3, mode: 'master' } },
    ]);

    let r = this.obniz.i2c0.read10bitWait(0x50, 3).then(
      function(value) {
        expect(value).to.be.deep.equal([0x61, 0xf2, 0x1f]);
        expect(this.obniz).to.be.finished;
      }.bind(this)
    );

    expect(this.obniz).send([
      { i2c0: { address: 0x50, address_type: '10bit', read: 3 } },
    ]);
    setTimeout(
      function() {
        testUtil.receiveJson(this.obniz, [
          { i2c0: { address: 0x50, data: [0x61, 0xf2, 0x1f] } },
        ]);
      }.bind(this),
      10
    );
    return r;
  });

  it('slave start', function() {
    this.obniz.i2c0.start({
      mode: 'slave',
      sda: 2,
      scl: 3,
      slave_address: 1,
      pull: null,
    });
    expect(this.obniz).send([{ io2: { output_type: 'open-drain' } }]);
    expect(this.obniz).send([{ io3: { output_type: 'open-drain' } }]);
    expect(this.obniz).send([{ io2: { pull_type: 'float' } }]);
    expect(this.obniz).send([{ io3: { pull_type: 'float' } }]);
    expect(this.obniz).send([
      { i2c0: { slave_address: 1, sda: 2, scl: 3, mode: 'slave' } },
    ]);
    expect(this.obniz).to.be.finished;
  });

  it('slave data get', function() {
    this.obniz.i2c0.start({
      mode: 'slave',
      sda: 2,
      scl: 3,
      slave_address: 1,
      pull: null,
    });
    expect(this.obniz).send([{ io2: { output_type: 'open-drain' } }]);
    expect(this.obniz).send([{ io3: { output_type: 'open-drain' } }]);
    expect(this.obniz).send([{ io2: { pull_type: 'float' } }]);
    expect(this.obniz).send([{ io3: { pull_type: 'float' } }]);
    expect(this.obniz).send([
      { i2c0: { slave_address: 1, sda: 2, scl: 3, mode: 'slave' } },
    ]);
    expect(this.obniz).to.be.finished;

    this.obniz.i2c0.onwritten = sinon.stub();
    expect(this.obniz.i2c0.onwritten.callCount).to.be.equal(0);

    testUtil.receiveJson(this.obniz, [
      {
        i2c0: {
          mode: 'slave',
          address: 1,
          is_fragmented: true,
          data: [16, 34, 242],
        },
      },
    ]);

    expect(this.obniz.i2c0.onwritten.callCount).to.be.equal(1);
    expect(this.obniz.i2c0.onwritten.getCall(0).args.length).to.be.equal(2);

    let data = this.obniz.i2c0.onwritten.getCall(0).args[0];
    expect(data).to.be.deep.equal([16, 34, 242]);

    let address = this.obniz.i2c0.onwritten.getCall(0).args[1];
    expect(address).to.be.deep.equal(1);
  });

  it('slave data another data', function() {
    this.obniz.i2c0.start({
      mode: 'slave',
      sda: 2,
      scl: 3,
      slave_address: 1,
      pull: null,
    });
    expect(this.obniz).send([{ io2: { output_type: 'open-drain' } }]);
    expect(this.obniz).send([{ io3: { output_type: 'open-drain' } }]);
    expect(this.obniz).send([{ io2: { pull_type: 'float' } }]);
    expect(this.obniz).send([{ io3: { pull_type: 'float' } }]);
    expect(this.obniz).send([
      { i2c0: { slave_address: 1, sda: 2, scl: 3, mode: 'slave' } },
    ]);
    expect(this.obniz).to.be.finished;

    this.obniz.i2c0.onwritten = sinon.stub();
    expect(this.obniz.i2c0.onwritten.callCount).to.be.equal(0);

    testUtil.receiveJson(this.obniz, [
      {
        i2c0: {
          mode: 'slave',
          address: 2,
          is_fragmented: true,
          data: [16, 34, 242],
        },
      },
    ]);

    expect(this.obniz.i2c0.onwritten.callCount).to.be.equal(1);
    expect(this.obniz.i2c0.onwritten.getCall(0).args.length).to.be.equal(2);

    let data = this.obniz.i2c0.onwritten.getCall(0).args[0];
    expect(data).to.be.deep.equal([16, 34, 242]);

    let address = this.obniz.i2c0.onwritten.getCall(0).args[1];
    expect(address).to.be.deep.equal(2);
  });
});

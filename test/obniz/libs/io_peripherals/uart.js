let chai = require('chai');
let expect = chai.expect;
let sinon = require('sinon');

let testUtil = require('../../../testUtil.js');
chai.use(require('chai-like'));
chai.use(testUtil.obnizAssert);

describe('obniz.libs.uart', function() {
  beforeEach(function(done) {
    return testUtil.setupObnizPromise(this, done);
  });

  afterEach(function(done) {
    return testUtil.releaseObnizePromise(this, done);
  });

  it('start', function() {
    this.obniz.uart0.start({ tx: 1, rx: 2, baud: 9600, bits: 7 });
    expect(this.obniz).send([{ io2: { output_type: 'push-pull5v' } }]);
    expect(this.obniz).send([{ io1: { output_type: 'push-pull5v' } }]);
    expect(this.obniz).send([{ io2: { pull_type: 'float' } }]);
    expect(this.obniz).send([{ io1: { pull_type: 'float' } }]);

    expect(this.obniz).send([{ uart0: { tx: 1, rx: 2, baud: 9600, bits: 7 } }]);

    this.obniz.uart0.send('Hi');

    expect(this.obniz).send([{ uart0: { data: [72, 105] } }]);
    expect(this.obniz).to.be.finished;
  });

  it('startWithGnd', function() {
    this.obniz.uart0.start({ tx: 1, rx: 2, baud: 9600, bits: 7, gnd: 3 });
    expect(this.obniz).send([{ io2: { output_type: 'push-pull5v' } }]);
    expect(this.obniz).send([{ io1: { output_type: 'push-pull5v' } }]);
    expect(this.obniz).send([{ io2: { pull_type: 'float' } }]);
    expect(this.obniz).send([{ io1: { pull_type: 'float' } }]);
    expect(this.obniz).send([{ io3: false }]);
    expect(this.obniz).send([
      {
        display: {
          pin_assign: {
            '3': {
              module_name: 'uart0',
              pin_name: 'gnd',
            },
          },
        },
      },
    ]);

    expect(this.obniz).send([{ uart0: { tx: 1, rx: 2, baud: 9600, bits: 7 } }]);

    this.obniz.uart0.send('Hi');

    expect(this.obniz).send([{ uart0: { data: [72, 105] } }]);
    expect(this.obniz).to.be.finished;
  });

  it('send', function() {
    this.obniz.uart0.start({ tx: 1, rx: 2 }); // 1 is output, 2 is input
    expect(this.obniz).send([{ io2: { output_type: 'push-pull5v' } }]);
    expect(this.obniz).send([{ io1: { output_type: 'push-pull5v' } }]);
    expect(this.obniz).send([{ io2: { pull_type: 'float' } }]);
    expect(this.obniz).send([{ io1: { pull_type: 'float' } }]);

    expect(this.obniz).send([{ uart0: { tx: 1, rx: 2 } }]);

    this.obniz.uart0.send('Hi');
    expect(this.obniz).send([{ uart0: { data: [72, 105] } }]);
    this.obniz.uart0.send(0x11);
    expect(this.obniz).send([{ uart0: { data: [0x11] } }]);
    this.obniz.uart0.send([0x11, 0x45, 0x44]);
    expect(this.obniz).send([{ uart0: { data: [0x11, 0x45, 0x44] } }]);
    expect(this.obniz).to.be.finished;
  });

  it('end', function() {
    this.obniz.uart0.start({ tx: 1, rx: 2 }); // 1 is output, 2 is input
    expect(this.obniz).send([{ io2: { output_type: 'push-pull5v' } }]);
    expect(this.obniz).send([{ io1: { output_type: 'push-pull5v' } }]);
    expect(this.obniz).send([{ io2: { pull_type: 'float' } }]);
    expect(this.obniz).send([{ io1: { pull_type: 'float' } }]);
    expect(this.obniz).send([{ uart0: { tx: 1, rx: 2 } }]);

    this.obniz.uart0.send('Hi');
    expect(this.obniz).send([{ uart0: { data: [72, 105] } }]);

    this.obniz.uart0.end();
    expect(this.obniz).send([{ uart0: null }]);
    expect(this.obniz).to.be.finished;
  });

  it('onreceive', function() {
    this.obniz.uart0.start({ tx: 0, rx: 1 }); // 0 is output, 1 is input
    expect(this.obniz).send([{ io1: { output_type: 'push-pull5v' } }]);
    expect(this.obniz).send([{ io0: { output_type: 'push-pull5v' } }]);
    expect(this.obniz).send([{ io1: { pull_type: 'float' } }]);
    expect(this.obniz).send([{ io0: { pull_type: 'float' } }]);
    expect(this.obniz).send([{ uart0: { tx: 0, rx: 1 } }]);
    let stub = sinon.stub();
    this.obniz.uart0.onreceive = stub;

    testUtil.receiveJson(this.obniz, [{ uart0: { data: [78, 105, 99, 101] } }]);
    sinon.assert.callCount(stub, 1);
    expect(stub.getCall(0).args[0]).to.be.deep.equal([78, 105, 99, 101]);
    expect(stub.getCall(0).args[1]).to.be.equal('Nice');
    expect(this.obniz).to.be.finished;
  });

  it('readBytes', function() {
    this.obniz.uart0.start({ tx: 0, rx: 1 }); // 0 is output, 1 is input
    expect(this.obniz).send([{ io1: { output_type: 'push-pull5v' } }]);
    expect(this.obniz).send([{ io0: { output_type: 'push-pull5v' } }]);
    expect(this.obniz).send([{ io1: { pull_type: 'float' } }]);
    expect(this.obniz).send([{ io0: { pull_type: 'float' } }]);
    expect(this.obniz).send([{ uart0: { tx: 0, rx: 1 } }]);

    testUtil.receiveJson(this.obniz, [{ uart0: { data: [78, 105, 99, 101] } }]);
    testUtil.receiveJson(this.obniz, [{ uart0: { data: [1, 2, 3] } }]);

    expect(this.obniz.uart0.isDataExists()).to.be.true;
    expect(this.obniz.uart0.readBytes()).to.be.deep.equal([
      78,
      105,
      99,
      101,
      1,
      2,
      3,
    ]);
    expect(this.obniz).to.be.finished;
  });

  it('readText', function() {
    this.obniz.uart0.start({ tx: 0, rx: 1 }); // 0 is output, 1 is input
    expect(this.obniz).send([{ io1: { output_type: 'push-pull5v' } }]);
    expect(this.obniz).send([{ io0: { output_type: 'push-pull5v' } }]);
    expect(this.obniz).send([{ io1: { pull_type: 'float' } }]);
    expect(this.obniz).send([{ io0: { pull_type: 'float' } }]);
    expect(this.obniz).send([{ uart0: { tx: 0, rx: 1 } }]);

    testUtil.receiveJson(this.obniz, [{ uart0: { data: [78, 105, 99, 101] } }]);
    testUtil.receiveJson(this.obniz, [{ uart0: { data: [101] } }]);

    expect(this.obniz.uart0.isDataExists()).to.be.true;
    expect(this.obniz.uart0.readText()).to.be.equal('Nicee');
    expect(this.obniz).to.be.finished;
  });
});

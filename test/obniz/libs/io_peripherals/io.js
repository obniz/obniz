let chai = require('chai');
let expect = chai.expect;
let sinon = require('sinon');
let testUtil = require('../../../testUtil.js');
chai.use(require('chai-like'));
chai.use(testUtil.obnizAssert);

describe('obniz.libs.io', function() {
  beforeEach(function(done) {
    return testUtil.setupObnizPromise(this, done);
  });

  afterEach(function(done) {
    return testUtil.releaseObnizePromise(this, done);
  });

  it('output(true)', function() {
    this.obniz.io0.output(true);
    expect(this.obniz).to.be.obniz;
    expect(this.obniz).send([{ io0: true }]);
    expect(this.obniz).to.be.finished;
  });

  it('output(1)', function() {
    this.obniz.io0.output(1);
    expect(this.obniz).to.be.obniz;
    expect(this.obniz).send([{ io0: true }]);
    expect(this.obniz).to.be.finished;
  });

  it('output(0)', function() {
    this.obniz.io0.output(0);
    expect(this.obniz).to.be.obniz;
    expect(this.obniz).send([{ io0: false }]);
    expect(this.obniz).to.be.finished;
  });

  it('output-over-pin', function() {
    expect(function() {
      this.obniz.io20.output(true);
    }).to.throw();
    expect(this.obniz).to.be.finished;
  });

  it('drive 5v', function() {
    this.obniz.io1.drive('5v');
    expect(this.obniz).to.be.obniz;
    expect(this.obniz).send([{ io1: { output_type: 'push-pull5v' } }]);
    expect(this.obniz).to.be.finished;
  });

  it('drive 3v', function() {
    this.obniz.io1.drive('3v');
    expect(this.obniz).to.be.obniz;
    expect(this.obniz).send([{ io1: { output_type: 'push-pull3v' } }]);
    expect(this.obniz).to.be.finished;
  });

  it('drive open-drain', function() {
    this.obniz.io1.drive('open-drain');
    expect(this.obniz).to.be.obniz;
    expect(this.obniz).send([{ io1: { output_type: 'open-drain' } }]);
    expect(this.obniz).to.be.finished;
  });

  it('drive error at non string', function() {
    expect(function() {
      this.obniz.io1.drive(null);
    }).to.throw();
    expect(this.obniz).to.be.finished;
  });

  it('drive error at unknown string', function() {
    expect(function() {
      this.obniz.io1.drive('3.3v');
    }).to.throw();
    expect(this.obniz).to.be.finished;
  });

  it('pull 5v', function() {
    this.obniz.io3.pull('5v');
    expect(this.obniz).to.be.obniz;
    expect(this.obniz).send([{ io3: { pull_type: 'pull-up5v' } }]);
    expect(this.obniz).to.be.finished;
  });

  it('pull 3v', function() {
    this.obniz.io3.pull('3v');
    expect(this.obniz).to.be.obniz;
    expect(this.obniz).send([{ io3: { pull_type: 'pull-up3v' } }]);
    expect(this.obniz).to.be.finished;
  });

  it('pull down', function() {
    this.obniz.io3.pull('0v');
    expect(this.obniz).to.be.obniz;
    expect(this.obniz).send([{ io3: { pull_type: 'pull-down' } }]);
    expect(this.obniz).to.be.finished;
  });

  it('float', function() {
    this.obniz.io3.pull(null);
    expect(this.obniz).to.be.obniz;
    expect(this.obniz).send([{ io3: { pull_type: 'float' } }]);
    expect(this.obniz).to.be.finished;
  });

  it('pull error when undefined', function() {
    expect(function() {
      this.obniz.io1.pull();
    }).to.throw();
    expect(this.obniz).to.be.finished;
  });

  it('input', function() {
    let stub = sinon.stub();
    this.obniz.io7.input(stub);
    expect(this.obniz).to.be.obniz;
    expect(this.obniz).send([{ io7: { direction: 'input', stream: true } }]);

    testUtil.receiveJson(this.obniz, [{ io7: true }]);
    sinon.assert.callCount(stub, 1);
    expect(stub.getCall(0).args[0]).to.be.true;

    testUtil.receiveJson(this.obniz, [{ io7: false }]);
    sinon.assert.callCount(stub, 2);
    expect(stub.getCall(1).args[0]).to.be.false;

    expect(this.obniz).to.be.finished;
  });

  it('inputWaitTrue', function() {
    return new Promise(
      function(resolve, reject) {
        this.obniz.io8.inputWait().then(function(result) {
          expect(result).to.be.true;
          resolve();
        });

        expect(this.obniz).to.be.obniz;
        expect(this.obniz).send([
          { io8: { direction: 'input', stream: false } },
        ]);
        expect(this.obniz).to.be.finished;

        setTimeout(
          function() {
            testUtil.receiveJson(this.obniz, [{ io8: true }]);
          }.bind(this),
          10
        );
      }.bind(this)
    );
  });

  it('end', function() {
    this.obniz.io0.end();
    expect(this.obniz).to.be.obniz;
    expect(this.obniz).send([{ io0: null }]);
    expect(this.obniz).to.be.finished;
  });

  it('inputWaitfalse', function() {
    return new Promise(
      function(resolve, reject) {
        let success = true;
        this.obniz.io9.inputWait().then(function(result) {
          success = false;
          reject('invalid pin');
        });
        expect(this.obniz).to.be.obniz;
        expect(this.obniz).send([
          { io9: { direction: 'input', stream: false } },
        ]);
        expect(this.obniz).to.be.finished;

        setTimeout(
          function() {
            testUtil.receiveJson(this.obniz, [{ io10: true }]);
          }.bind(this),
          5
        );
        setTimeout(
          function() {
            if (success) {
              resolve();
            }
          }.bind(this),
          10
        );
      }.bind(this)
    );
  });

  it('ioAnimation', function() {
    let obniz = this.obniz;
    this.obniz.io.animation('animation-1', 'loop', [
      {
        duration: 10,
        state: function(index) {
          // index = 0
          obniz.io0.output(false);
          obniz.io1.output(true);
        },
      },
      {
        duration: 10,
        state: function(index) {
          // index = 1
          obniz.io0.output(true);
          obniz.io1.output(false);
        },
      },
    ]);
    expect(this.obniz).to.be.obniz;
    expect(this.obniz).send([
      {
        io: {
          animation: {
            name: 'animation-1',
            states: [
              {
                duration: 10,
                state: [{ io0: false }, { io1: true }],
              },
              {
                duration: 10,
                state: [{ io0: true }, { io1: false }],
              },
            ],
            status: 'loop',
          },
        },
      },
    ]);
    expect(this.obniz).to.be.finished;
  });

  it('ioAnimation-pause', function() {
    this.obniz.io.animation('animation-1', 'pause');

    expect(this.obniz).send([
      {
        io: {
          animation: {
            name: 'animation-1',
            status: 'pause',
          },
        },
      },
    ]);
  });

  it('ioAnimation-pause', function() {
    this.obniz.io.animation('anim', 'pause');

    expect(this.obniz).send([
      {
        io: {
          animation: {
            name: 'anim',
            status: 'pause',
          },
        },
      },
    ]);
  });

  it('ioAnimation-resume', function() {
    this.obniz.io.animation('a', 'resume');

    expect(this.obniz).send([
      {
        io: {
          animation: {
            name: 'a',
            status: 'resume',
          },
        },
      },
    ]);
    expect(this.obniz).to.be.finished;
  });

  it('input simple', function() {
    this.obniz.send({
      io1: 'get',
    });

    expect(this.obniz).send([
      {
        io1: 'get',
      },
    ]);

    expect(this.obniz).to.be.finished;
  });

  it('output detail', function() {
    this.obniz.send({
      io0: {
        direction: 'output',
        value: true,
      },
    });

    expect(this.obniz).send([
      {
        io0: {
          direction: 'output',
          value: true,
        },
      },
    ]);

    expect(this.obniz).to.be.finished;
  });
});

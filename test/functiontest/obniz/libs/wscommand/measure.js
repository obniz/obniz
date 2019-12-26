let chai = require('chai');
let expect = chai.expect;

let testUtil = require('../../../testUtil.js');
chai.use(require('chai-like'));
chai.use(testUtil.obnizAssert);

describe('measure', function() {
  beforeEach(function(done) {
    return testUtil.setupObnizPromise(this, done, { binary: true });
  });

  afterEach(function(done) {
    return testUtil.releaseObnizePromise(this, done);
  });

  it('measure', function() {
    let requestJson = [
      {
        measure: {
          echo: {
            io_pulse: 0,
            io_echo: 1,
            pulse: 'positive',
            pulse_width: 500,
            measure_edges: 2,
            timeout: 1000,
          },
        },
      },
    ];
    let expecteBinaryStrings = [
      '0c 00 0d 00 00 01 00 07 A1 20 01 02 00 0f 42 40',
    ];

    expect(requestJson.length).to.be.equal(1);

    let isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    let compress = this.obniz.constructor.WSCommand.compress(
      this.obniz.wscommands,
      requestJson[0]
    );

    let binaryArray = expecteBinaryStrings
      .join(' ')
      .split(' ')
      .map(function(val, index) {
        return parseInt(val, 16);
      });
    expect(binaryArray.length).to.be.above(2);
    let binary = new Uint8Array(binaryArray);

    expect(compress).to.be.deep.equal(binary);
  });

  it('response', function() {
    let responseBinaryString = 'c 0 1 0';
    let expectJson = [{ measure: { echo: [] } }];

    let binaryArray = responseBinaryString.split(' ').map(function(val, index) {
      return parseInt(val, 16);
    });
    let binary = new Uint8Array(binaryArray);

    let json = this.obniz.binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });

  it('response2', function() {
    let responseBinaryString = 'c 0 c 2 1 1 2 3 1 0 0 0 1 0 0';
    let expectJson = [
      {
        measure: {
          echo: [
            {
              edge: true,
              timing: 16909.057,
            },
            {
              edge: false,
              timing: 0.256,
            },
          ],
        },
      },
    ];

    let binaryArray = responseBinaryString.split(' ').map(function(val, index) {
      return parseInt(val, 16);
    });
    let binary = new Uint8Array(binaryArray);

    let json = this.obniz.binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });
});

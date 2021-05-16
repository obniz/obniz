const chai = require('chai');
const expect = chai.expect;

const testUtil = require('../../../testUtil.js');

describe('measure', function () {
  beforeEach(async function () {
    await testUtil.setupObnizPromise(this, null, { binary: true });
  });

  afterEach(async function () {
    await testUtil.releaseObnizPromise(this);
  });

  it('measure', function () {
    const requestJson = [
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
    const expecteBinaryStrings = [
      '0c 00 0d 00 00 01 00 07 A1 20 01 02 00 0f 42 40',
    ];

    expect(requestJson.length).to.be.equal(1);

    const isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    const compress = this.obniz.constructor.WSCommand.compress(
      this.obniz.wscommands,
      requestJson[0]
    );

    const binaryArray = expecteBinaryStrings
      .join(' ')
      .split(' ')
      .map(function (val, index) {
        return parseInt(val, 16);
      });
    expect(binaryArray.length).to.be.above(2);
    const binary = new Uint8Array(binaryArray);

    expect(compress).to.be.deep.equal(binary);
  });

  it('response', function () {
    const responseBinaryString = 'c 0 1 0';
    const expectJson = [{ measure: { echo: [] } }];

    const binaryArray = responseBinaryString
      .split(' ')
      .map(function (val, index) {
        return parseInt(val, 16);
      });
    const binary = new Uint8Array(binaryArray);

    const json = this.obniz._binary2Json(binary);

    const isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });

  it('response2', function () {
    const responseBinaryString = 'c 0 c 2 1 1 2 3 1 0 0 0 1 0 0';
    const expectJson = [
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

    const binaryArray = responseBinaryString
      .split(' ')
      .map(function (val, index) {
        return parseInt(val, 16);
      });
    const binary = new Uint8Array(binaryArray);

    const json = this.obniz._binary2Json(binary);

    const isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });
});

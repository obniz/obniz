const chai = require('chai');
const expect = chai.expect;

const testUtil = require('../../../testUtil.js');

describe('io.animation', function () {
  beforeEach(async function () {
    await testUtil.setupObnizWait(this, null, { binary: true });
  });

  afterEach(async function () {
    await testUtil.releaseObnizWait(this);
  });

  it('request ioAnimation', function () {
    compressTest(
      this.obniz,
      [
        {
          io: {
            animation: {
              name: 'animation-1',
              states: [
                { duration: 10, state: { io0: false, io1: true } },
                { duration: 10, state: { io0: true, io1: false } },
              ],
              status: 'loop',
            },
          },
        },
      ],
      [
        '01 00 36 0c 61 6e 69 6d 61 74 69 6f 6e 2d 31 00 01 00 00 00 00 00 00 00 0a 00 00 27 10 02 00 02 00 00 02 00 02 01 01 00 00 00 0a 00 00 27 10 02 00 02 00 01 02 00 02 01 00',
      ]
    );
  });

  it('request ioAnimation single array format', function () {
    compressTest(
      this.obniz,
      [
        {
          io: {
            animation: {
              name: 'animation-1',
              states: [
                { duration: 10, state: [{ io0: false, io1: true }] },
                { duration: 10, state: [{ io0: true, io1: false }] },
              ],
              status: 'loop',
            },
          },
        },
      ],
      [
        '01 00 36 0c 61 6e 69 6d 61 74 69 6f 6e 2d 31 00 01 00 00 00 00 00 00 00 0a 00 00 27 10 02 00 02 00 00 02 00 02 01 01 00 00 00 0a 00 00 27 10 02 00 02 00 01 02 00 02 01 00',
      ]
    );
  });

  it('request ioAnimation multiple array format', function () {
    compressTest(
      this.obniz,
      [
        {
          io: {
            animation: {
              name: 'animation-1',
              states: [
                { duration: 10, state: [{ io0: false }, { io1: true }] },
                { duration: 10, state: [{ io0: true }, { io1: false }] },
              ],
              status: 'loop',
            },
          },
        },
      ],
      [
        '01 00 36 0c 61 6e 69 6d 61 74 69 6f 6e 2d 31 00 01 00 00 00 00 00 00 00 0a 00 00 27 10 02 00 02 00 00 02 00 02 01 01 00 00 00 0a 00 00 27 10 02 00 02 00 01 02 00 02 01 00',
      ]
    );
  });

  it('request ioAnimation-pause', function () {
    compressTest(
      this.obniz,
      [{ io: { animation: { name: 'animation-1', status: 'pause' } } }],
      ['01 01 0d 0c 61 6e 69 6d 61 74 69 6f 6e 2d 31 00']
    );
  });

  it('request ioAnimation-pause', function () {
    compressTest(
      this.obniz,
      [{ io: { animation: { name: 'anim', status: 'pause' } } }],
      ['01 01 06 05 61 6e 69 6d 00']
    );
  });

  it('request ioAnimation-resume', function () {
    compressTest(
      this.obniz,
      [{ io: { animation: { name: 'a', status: 'resume' } } }],
      ['01 02 03 02 61 00']
    );
  });
});

function compressTest(obniz, requestJson, expecteBinarystrings) {
  const binaryArray = expecteBinarystrings[0]
    .split(' ')
    .map(function (val, index) {
      return parseInt(val, 16);
    });
  const binary = new Uint8Array(binaryArray);

  expect(requestJson.length).to.be.equal(1);

  const isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
  expect(isValidCommand.valid).to.be.true;

  const compress = obniz.wsCommandManager.compress(requestJson[0]);

  expect(compress).to.be.deep.equal(binary);
}

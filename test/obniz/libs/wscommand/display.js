var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var sinon = require('sinon');

var testUtil = require("../../../testUtil.js");
chai.use(require('chai-like'));
chai.use(testUtil.obnizAssert);

describe("display", function () {
  beforeEach(function (done) {
    return testUtil.setupObnizPromise(this, done, {binary: true});
  });

  afterEach(function (done) {
    return testUtil.releaseObnizePromise(this, done);
  });


  it("request test no.0", function () {
    let requestJson = [{"display": {"clear": true}}];
    let expecteBinaryStrings = ["08 00 00"];

    expect(requestJson.length).to.be.equal(1);

    let isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    let compress = this.obniz.constructor.WSCommand.compress(this.obniz.wscommands, requestJson[0]);


    let binaryArray = expecteBinaryStrings.join(" ").split(" ").map(function (val, index) {
      return parseInt(val, 16);
    });
    expect(binaryArray.length).to.be.above(2);
    let binary = new Uint8Array(binaryArray);

    expect(compress).to.be.deep.equal(binary);
  });


  it("request test no.2", function () {
    let requestJson = [{"display": {"text": "Pushing"}}];
    let expecteBinaryStrings = ["08 01 07 50 75 73 68 69 6e 67"];

    expect(requestJson.length).to.be.equal(1);

    let isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    let compress = this.obniz.constructor.WSCommand.compress(this.obniz.wscommands, requestJson[0]);


    let binaryArray = expecteBinaryStrings.join(" ").split(" ").map(function (val, index) {
      return parseInt(val, 16);
    });
    expect(binaryArray.length).to.be.above(2);
    let binary = new Uint8Array(binaryArray);

    expect(compress).to.be.deep.equal(binary);
  });


  it("request test no.4", function () {
    let requestJson = [{"display": {"clear": true}}];
    let expecteBinaryStrings = ["08 00 00"];

    expect(requestJson.length).to.be.equal(1);

    let isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    let compress = this.obniz.constructor.WSCommand.compress(this.obniz.wscommands, requestJson[0]);


    let binaryArray = expecteBinaryStrings.join(" ").split(" ").map(function (val, index) {
      return parseInt(val, 16);
    });
    expect(binaryArray.length).to.be.above(2);
    let binary = new Uint8Array(binaryArray);

    expect(compress).to.be.deep.equal(binary);
  });


  it("response test no.5", function () {
    let responseBinaryString = "09 00 01 03";
    let expectJson = [{"switch": {"state": "right"}}];

    let binaryArray = responseBinaryString.split(" ").map(function (val, index) {
      return parseInt(val, 16);
    });
    let binary = new Uint8Array(binaryArray);

    let json = this.obniz.binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });


  it("request test no.6", function () {
    let requestJson = [{"display": {"clear": true}}];
    let expecteBinaryStrings = ["08 00 00"];

    expect(requestJson.length).to.be.equal(1);

    let isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    let compress = this.obniz.constructor.WSCommand.compress(this.obniz.wscommands, requestJson[0]);


    let binaryArray = expecteBinaryStrings.join(" ").split(" ").map(function (val, index) {
      return parseInt(val, 16);
    });
    expect(binaryArray.length).to.be.above(2);
    let binary = new Uint8Array(binaryArray);

    expect(compress).to.be.deep.equal(binary);
  });


  it("request test no.8", function () {
    let requestJson = [{"display": {"clear": true}}];
    let expecteBinaryStrings = ["08 00 00"];

    expect(requestJson.length).to.be.equal(1);

    let isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    let compress = this.obniz.constructor.WSCommand.compress(this.obniz.wscommands, requestJson[0]);


    let binaryArray = expecteBinaryStrings.join(" ").split(" ").map(function (val, index) {
      return parseInt(val, 16);
    });
    expect(binaryArray.length).to.be.above(2);
    let binary = new Uint8Array(binaryArray);

    expect(compress).to.be.deep.equal(binary);
  });


  it("request test no.10", function () {
    let requestJson = [{"display": {"clear": true}}];
    let expecteBinaryStrings = ["08 00 00"];

    expect(requestJson.length).to.be.equal(1);

    let isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    let compress = this.obniz.constructor.WSCommand.compress(this.obniz.wscommands, requestJson[0]);


    let binaryArray = expecteBinaryStrings.join(" ").split(" ").map(function (val, index) {
      return parseInt(val, 16);
    });
    expect(binaryArray.length).to.be.above(2);
    let binary = new Uint8Array(binaryArray);

    expect(compress).to.be.deep.equal(binary);
  });


  it("request test no.12", function () {
    let requestJson = [{"display": {"clear": true}}];
    let expecteBinaryStrings = ["08 00 00"];

    expect(requestJson.length).to.be.equal(1);

    let isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    let compress = this.obniz.constructor.WSCommand.compress(this.obniz.wscommands, requestJson[0]);


    let binaryArray = expecteBinaryStrings.join(" ").split(" ").map(function (val, index) {
      return parseInt(val, 16);
    });
    expect(binaryArray.length).to.be.above(2);
    let binary = new Uint8Array(binaryArray);

    expect(compress).to.be.deep.equal(binary);
  });


  it("request test no.14", function () {
    let requestJson = [{"display": {"text": "Pushing"}}];
    let expecteBinaryStrings = ["08 01 07 50 75 73 68 69 6e 67"];

    expect(requestJson.length).to.be.equal(1);

    let isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    let compress = this.obniz.constructor.WSCommand.compress(this.obniz.wscommands, requestJson[0]);


    let binaryArray = expecteBinaryStrings.join(" ").split(" ").map(function (val, index) {
      return parseInt(val, 16);
    });
    expect(binaryArray.length).to.be.above(2);
    let binary = new Uint8Array(binaryArray);

    expect(compress).to.be.deep.equal(binary);
  });


  it("request test no.16", function () {
    let requestJson = [{"display": {"clear": true}}];
    let expecteBinaryStrings = ["08 00 00"];

    expect(requestJson.length).to.be.equal(1);

    let isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    let compress = this.obniz.constructor.WSCommand.compress(this.obniz.wscommands, requestJson[0]);


    let binaryArray = expecteBinaryStrings.join(" ").split(" ").map(function (val, index) {
      return parseInt(val, 16);
    });
    expect(binaryArray.length).to.be.above(2);
    let binary = new Uint8Array(binaryArray);

    expect(compress).to.be.deep.equal(binary);
  });


  it("request test no.17", function () {
    let requestJson = [{"display": {"clear": true}}];
    let expecteBinaryStrings = ["08 00 00"];

    expect(requestJson.length).to.be.equal(1);

    let isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    let compress = this.obniz.constructor.WSCommand.compress(this.obniz.wscommands, requestJson[0]);


    let binaryArray = expecteBinaryStrings.join(" ").split(" ").map(function (val, index) {
      return parseInt(val, 16);
    });
    expect(binaryArray.length).to.be.above(2);
    let binary = new Uint8Array(binaryArray);

    expect(compress).to.be.deep.equal(binary);
  });


  it("request test no.21", function () {
    let requestJson = [{"display": {"clear": true}}];
    let expecteBinaryStrings = ["08 00 00"];

    expect(requestJson.length).to.be.equal(1);

    let isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    let compress = this.obniz.constructor.WSCommand.compress(this.obniz.wscommands, requestJson[0]);


    let binaryArray = expecteBinaryStrings.join(" ").split(" ").map(function (val, index) {
      return parseInt(val, 16);
    });
    expect(binaryArray.length).to.be.above(2);
    let binary = new Uint8Array(binaryArray);

    expect(compress).to.be.deep.equal(binary);
  });


  it("request test no.22", function () {
    let requestJson = [{"display": {"qr": {"text": "https://obniz.io"}}}];
    let expecteBinaryStrings = ["08 02 44 00 ff ff 03 03 f3 f3 33 33 33 33 33 33 f3 f3 03 03 ff ff 0f 0f 33 33 c3 c3 03 03 0f 0f f3 f3 33 33 c3 c3 3f 3f ff ff 03 03 f3 f3 33 33 33 33 33 33 f3 f3 3 3 ff ff 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 ff ff 0 0 3f 3f 30 30 30 30 30 30 3f 3f 0 0 ff ff 3c 3c ff ff 3 3 cc cc c c c3 c3 0 0 f0 f0 c c ff ff 0 0 3f 3f 30 30 30 30 30 30 3f 3f 0 0 ff ff 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 ff ff c3 c3 ff ff 3f 3f 3f 3f cf cf 3f 3f 33 33 cf cf f0 f0 cc cc cf cf f0 f0 3f 3f fc fc c3 c3 c c 3c 3c f3 f3 33 33 f f f f 3 3 c3 c3 3 3 3f 3f ff ff 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 ff ff c c ff ff 3c 3c f3 f3 33 33 fc fc 33 33 cf cf cc cc f0 f0 f3 f3 f3 f3 cc cc 3 3 0 0 f f c3 c3 3f 3f f3 f3 0 0 3c 3c 3c 3c ff ff f f 30 30 ff ff 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 ff ff 30 30 3f 3f 3f 3f 30 30 30 30 30 30 33 33 fc fc cc cc f f f3 f3 ff ff 30 30 3c 3c 30 30 fc fc 3 3 f3 f3 33 33 f0 f0 3 3 fc fc f0 f0 ff ff 3c 3c ff ff 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 ff ff 0 0 ff ff 3 3 3 3 3 3 ff ff 0 0 ff ff ff ff f f 30 30 f0 f0 cf cf f f 3c 3c 33 33 30 30 c3 c3 c3 c3 f3 f3 f0 f0 3f 3f 33 33 cf cf 0 0 ff ff 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 3f 3f 30 30 33 33 33 33 33 33 33 33 33 33 30 30 3f 3f 33 33 30 30 30 30 33 33 30 30 30 30 3f 3f 3c 3c 30 30 3f 3f 33 33 3c 3c 3c 3c 33 33 3f 3f 3f 3f 30 30 3f 3f 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0"];

    expect(requestJson.length).to.be.equal(1);

    let isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    let compress = this.obniz.constructor.WSCommand.compress(this.obniz.wscommands, requestJson[0]);
    expect(compress).to.be.null; // use server command
  });


  it("request test no.23", function () {
    let requestJson = [{"display": {"raw": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 96, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 96, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 240, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 240, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 1, 152, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 152, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 12, 12, 0, 192, 248, 6, 60, 6, 6, 120, 0, 0, 0, 0, 0, 3, 12, 12, 0, 195, 254, 6, 254, 6, 6, 248, 0, 0, 0, 0, 0, 6, 6, 6, 1, 135, 7, 7, 135, 6, 7, 128, 0, 0, 0, 0, 0, 6, 6, 6, 1, 140, 3, 7, 3, 134, 7, 0, 0, 0, 0, 0, 0, 12, 7, 3, 3, 12, 1, 135, 1, 134, 7, 0, 0, 0, 0, 0, 0, 12, 3, 3, 3, 24, 1, 134, 1, 134, 6, 0, 0, 0, 0, 0, 0, 12, 3, 3, 3, 31, 255, 134, 1, 134, 6, 0, 0, 0, 0, 0, 0, 31, 255, 129, 134, 31, 255, 134, 1, 134, 6, 0, 0, 0, 0, 0, 0, 31, 255, 129, 134, 24, 0, 6, 1, 134, 6, 0, 0, 0, 0, 0, 0, 48, 0, 192, 204, 24, 0, 6, 1, 134, 6, 0, 0, 0, 0, 0, 0, 48, 0, 192, 204, 12, 0, 6, 1, 134, 6, 0, 0, 0, 0, 0, 0, 96, 0, 96, 204, 14, 1, 6, 1, 134, 6, 0, 0, 0, 0, 0, 0, 96, 0, 96, 120, 7, 3, 134, 1, 134, 6, 0, 0, 0, 0, 0, 0, 96, 0, 96, 120, 3, 255, 6, 1, 134, 6, 0, 0, 0, 0, 0, 0, 192, 0, 48, 48, 0, 252, 6, 1, 134, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}}];
    let expecteBinaryStrings = ["8 3 44 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 60 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 60 0 0 0 0 0 0 6 0 0 0 0 0 0 0 0 f0 0 0 0 0 0 0 6 0 0 0 0 0 0 0 0 f0 0 0 0 0 0 0 6 0 0 0 0 0 0 0 1 98 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 98 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 8 0 0 0 0 0 0 0 0 0 0 0 0 0 0 3 c c 0 c0 f8 6 3c 6 6 78 0 0 0 0 0 3 c c 0 c3 fe 6 fe 6 6 f8 0 0 0 0 0 6 6 6 1 87 7 7 87 6 7 80 0 0 0 0 0 6 6 6 1 8c 3 7 3 86 7 0 0 0 0 0 0 c 7 3 3 c 1 87 1 86 7 0 0 0 0 0 0 c 3 3 3 18 1 86 1 86 6 0 0 0 0 0 0 c 3 3 3 1f ff 86 1 86 6 0 0 0 0 0 0 1f ff 81 86 1f ff 86 1 86 6 0 0 0 0 0 0 1f ff 81 86 18 0 6 1 86 6 0 0 0 0 0 0 30 0 c0 cc 18 0 6 1 86 6 0 0 0 0 0 0 30 0 c0 cc c 0 6 1 86 6 0 0 0 0 0 0 60 0 60 cc e 1 6 1 86 6 0 0 0 0 0 0 60 0 60 78 7 3 86 1 86 6 0 0 0 0 0 0 60 0 60 78 3 ff 6 1 86 6 0 0 0 0 0 0 c0 0 30 30 0 fc 6 1 86 6 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0"];

    expect(requestJson.length).to.be.equal(1);

    let isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    let compress = this.obniz.constructor.WSCommand.compress(this.obniz.wscommands, requestJson[0]);


    let binaryArray = expecteBinaryStrings.join(" ").split(" ").map(function (val, index) {
      return parseInt(val, 16);
    });
    expect(binaryArray.length).to.be.above(2);
    let binary = new Uint8Array(binaryArray);

    expect(compress).to.be.deep.equal(binary);
  });

  it("pin name", function () {
    let requestJson =[
      {
        "display": {
          "pin_assign": {
            "0": {
              "module_name": "io",
              "pin_name": "output"
            }
          }
        }
      }
    ];
    let expecteBinaryStrings = ["8 5 0a 0 69 6F 20 6F 75 74 70 75 74"];

    expect(requestJson.length).to.be.equal(1);

    let isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    let compress = this.obniz.constructor.WSCommand.compress(this.obniz.wscommands, requestJson[0]);


    let binaryArray = expecteBinaryStrings.join(" ").split(" ").map(function (val, index) {
      return parseInt(val, 16);
    });
    expect(binaryArray.length).to.be.above(2);
    let binary = new Uint8Array(binaryArray);

    expect(compress).to.be.deep.equal(binary);
  });

  it("pin name2", function () {
    let requestJson =[
      {
        "display": {
          "pin_assign": {
            0: {
              "module_name": "io",
              "pin_name": "output"
            },
            "8": {
              "module_name": "pwm",
            },
            10: {
              "pin_name": "input"
            }
          }
        }
      }
    ];
    let expecteBinaryStrings = ["8 5 0a 0 69 6f 20 6f 75 74 70 75 74 8 5 6 8 70 77 6D 20 3F 8 5 8 a 3f 20 69 6E 70 75 74"];

    expect(requestJson.length).to.be.equal(1);

    let isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    let compress = this.obniz.constructor.WSCommand.compress(this.obniz.wscommands, requestJson[0]);


    let binaryArray = expecteBinaryStrings.join(" ").split(" ").map(function (val, index) {
      return parseInt(val, 16);
    });
    expect(binaryArray.length).to.be.above(2);
    let binary = new Uint8Array(binaryArray);

    expect(compress).to.be.deep.equal(binary);
  });


});

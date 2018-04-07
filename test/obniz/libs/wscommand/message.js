var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var sinon = require('sinon');

var testUtil = require(global.appRoot + "/test/testUtil.js");
chai.use(require('chai-like'));
chai.use(testUtil.obnizAssert);

describe("message.log", function () {
    beforeEach(function (done) {
        return testUtil.setupObnizPromise(this,done,{binary:true});
    });

    afterEach(function (done) {
        return testUtil.releaseObnizePromise(this,done);
    });


    it("test no.0",  function () {

      let requestJson  =[{"message":{"to":["1111-1111"],"data":"pressed"}}];

      expect(requestJson.length).to.be.equal(1);

      let isValidCommand = this.obniz.wscommands[0].validate("/request",requestJson);
      expect(isValidCommand.valid).to.be.true;

      let compress = this.obniz.constructor.WSCommand.compress(this.obniz.wscommands, requestJson[0]);
      expect(compress).to.be.null; // use server command


    });


    


});

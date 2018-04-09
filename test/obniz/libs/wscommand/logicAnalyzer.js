var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var sinon = require('sinon');

var testUtil = require(global.appRoot + "/test/testUtil.js");
chai.use(require('chai-like'));
chai.use(testUtil.obnizAssert);

describe("logicAnalyzer.log", function () {
    beforeEach(function (done) {
        return testUtil.setupObnizPromise(this,done,{binary:true});
    });

    afterEach(function (done) {
        return testUtil.releaseObnizePromise(this,done);
    });

    


    it("request test no.0",  function () {
        let requestJson  = [{"io1":true}];
        let expecteBinaryStrings = ["02 00 02 01 01"];

        expect(requestJson.length).to.be.equal(1);

        let isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
        expect(isValidCommand.valid).to.be.true;

        let compress = this.obniz.constructor.WSCommand.compress(this.obniz.wscommands, requestJson[0]);


        let binaryArray = expecteBinaryStrings.join(" ").split(" ").map(function(val,index){return parseInt(val, 16);});
        expect(binaryArray.length).to.be.above(2);
        let binary = new Uint8Array(binaryArray);

        expect(compress).to.be.deep.equal(binary);
    });



    


    it("request test no.1",  function () {
        let requestJson  = [{"logic_analyzer":{"io":[0],"interval":2,"duration":1000}}];
        let expecteBinaryStrings = ["0a 00 0c 01 00 00 00 07 d0 00 0f 42 40 00 00"];

        expect(requestJson.length).to.be.equal(1);

        let isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
        expect(isValidCommand.valid).to.be.true;

        let compress = this.obniz.constructor.WSCommand.compress(this.obniz.wscommands, requestJson[0]);


        let binaryArray = expecteBinaryStrings.join(" ").split(" ").map(function(val,index){return parseInt(val, 16);});
        expect(binaryArray.length).to.be.above(2);
        let binary = new Uint8Array(binaryArray);

        expect(compress).to.be.deep.equal(binary);
    });



    


    it("request test no.2",  function () {
        let requestJson  = [{"logic_analyzer":null}];
        let expecteBinaryStrings = ["0a 01 00"];

        expect(requestJson.length).to.be.equal(1);

        let isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
        expect(isValidCommand.valid).to.be.true;

        let compress = this.obniz.constructor.WSCommand.compress(this.obniz.wscommands, requestJson[0]);


        let binaryArray = expecteBinaryStrings.join(" ").split(" ").map(function(val,index){return parseInt(val, 16);});
        expect(binaryArray.length).to.be.above(2);
        let binary = new Uint8Array(binaryArray);

        expect(compress).to.be.deep.equal(binary);
    });



    


    it("request test no.3",  function () {
        let requestJson  = [{"logic_analyzer":{"io":[0],"interval":2,"duration":1000,"triger":{"value":false,"samples":3}}}];
        let expecteBinaryStrings = ["0a 00 0c 01 00 00 00 07 d0 00 0f 42 40 00 03"];

        expect(requestJson.length).to.be.equal(1);

        let isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
        expect(isValidCommand.valid).to.be.true;

        let compress = this.obniz.constructor.WSCommand.compress(this.obniz.wscommands, requestJson[0]);


        let binaryArray = expecteBinaryStrings.join(" ").split(" ").map(function(val,index){return parseInt(val, 16);});
        expect(binaryArray.length).to.be.above(2);
        let binary = new Uint8Array(binaryArray);

        expect(compress).to.be.deep.equal(binary);
    });



    


    it("response test no.4",  function () {
        let responseBinaryString = "0a 02 3e 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 3f ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff";
        let expectJson  = [{"logic_analyzer":{"data":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]}}];

        let binaryArray = responseBinaryString.split(" ").map(function(val,index){return parseInt(val, 16);});
        let binary = new Uint8Array(binaryArray);

        let json = this.obniz.binary2Json(binary);

        let isValidCommand = testUtil.isValidCommandResponseJson(json);
        expect(isValidCommand.valid).to.be.true;

        expect(json).to.be.deep.equal(expectJson);
    });



    


    it("response test no.5",  function () {
        let responseBinaryString = "0a 02 3e 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 1f ff ff ff ff ff ff ff ff ff ff";
        let expectJson  = [{"logic_analyzer":{"data":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}}];

        let binaryArray = responseBinaryString.split(" ").map(function(val,index){return parseInt(val, 16);});
        let binary = new Uint8Array(binaryArray);

        let json = this.obniz.binary2Json(binary);

        let isValidCommand = testUtil.isValidCommandResponseJson(json);
        expect(isValidCommand.valid).to.be.true;

        expect(json).to.be.deep.equal(expectJson);
    });



    


});

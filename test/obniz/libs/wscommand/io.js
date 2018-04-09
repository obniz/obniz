var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var sinon = require('sinon');

var testUtil = require(global.appRoot + "/test/testUtil.js");
chai.use(require('chai-like'));
chai.use(testUtil.obnizAssert);

describe("io.log", function () {
    beforeEach(function (done) {
        return testUtil.setupObnizPromise(this,done,{binary:true});
    });

    afterEach(function (done) {
        return testUtil.releaseObnizePromise(this,done);
    });

    


    it("request test no.0",  function () {
        let requestJson  = [{"io0":true}];
        let expecteBinaryStrings = ["02 00 02 00 01"];

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
        let requestJson  = [{"io7":{"direction":"input","stream":true}}];
        let expecteBinaryStrings = ["02 01 01 07"];

        expect(requestJson.length).to.be.equal(1);

        let isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
        expect(isValidCommand.valid).to.be.true;

        let compress = this.obniz.constructor.WSCommand.compress(this.obniz.wscommands, requestJson[0]);


        let binaryArray = expecteBinaryStrings.join(" ").split(" ").map(function(val,index){return parseInt(val, 16);});
        expect(binaryArray.length).to.be.above(2);
        let binary = new Uint8Array(binaryArray);

        expect(compress).to.be.deep.equal(binary);
    });



    


    it("response test no.2",  function () {
        let responseBinaryString = "02 01 02 07 00";
        let expectJson  = [{"io7":false}];

        let binaryArray = responseBinaryString.split(" ").map(function(val,index){return parseInt(val, 16);});
        let binary = new Uint8Array(binaryArray);

        let json = this.obniz.binary2Json(binary);

        let isValidCommand = testUtil.isValidCommandResponseJson(json);
        expect(isValidCommand.valid).to.be.true;

        expect(json).to.be.deep.equal(expectJson);
    });



    


    it("response test no.3",  function () {
        let responseBinaryString = "02 01 02 07 01";
        let expectJson  = [{"io7":true}];

        let binaryArray = responseBinaryString.split(" ").map(function(val,index){return parseInt(val, 16);});
        let binary = new Uint8Array(binaryArray);

        let json = this.obniz.binary2Json(binary);

        let isValidCommand = testUtil.isValidCommandResponseJson(json);
        expect(isValidCommand.valid).to.be.true;

        expect(json).to.be.deep.equal(expectJson);
    });



    


    it("response test no.4",  function () {
        let responseBinaryString = "02 01 02 07 00";
        let expectJson  = [{"io7":false}];

        let binaryArray = responseBinaryString.split(" ").map(function(val,index){return parseInt(val, 16);});
        let binary = new Uint8Array(binaryArray);

        let json = this.obniz.binary2Json(binary);

        let isValidCommand = testUtil.isValidCommandResponseJson(json);
        expect(isValidCommand.valid).to.be.true;

        expect(json).to.be.deep.equal(expectJson);
    });



    


    it("response test no.5",  function () {
        let responseBinaryString = "02 01 02 07 01";
        let expectJson  = [{"io7":true}];

        let binaryArray = responseBinaryString.split(" ").map(function(val,index){return parseInt(val, 16);});
        let binary = new Uint8Array(binaryArray);

        let json = this.obniz.binary2Json(binary);

        let isValidCommand = testUtil.isValidCommandResponseJson(json);
        expect(isValidCommand.valid).to.be.true;

        expect(json).to.be.deep.equal(expectJson);
    });



    


    it("response test no.6",  function () {
        let responseBinaryString = "02 01 02 07 00";
        let expectJson  = [{"io7":false}];

        let binaryArray = responseBinaryString.split(" ").map(function(val,index){return parseInt(val, 16);});
        let binary = new Uint8Array(binaryArray);

        let json = this.obniz.binary2Json(binary);

        let isValidCommand = testUtil.isValidCommandResponseJson(json);
        expect(isValidCommand.valid).to.be.true;

        expect(json).to.be.deep.equal(expectJson);
    });



    


    it("response test no.7",  function () {
        let responseBinaryString = "02 01 02 07 01";
        let expectJson  = [{"io7":true}];

        let binaryArray = responseBinaryString.split(" ").map(function(val,index){return parseInt(val, 16);});
        let binary = new Uint8Array(binaryArray);

        let json = this.obniz.binary2Json(binary);

        let isValidCommand = testUtil.isValidCommandResponseJson(json);
        expect(isValidCommand.valid).to.be.true;

        expect(json).to.be.deep.equal(expectJson);
    });



    


    it("response test no.8",  function () {
        let responseBinaryString = "02 01 02 07 00";
        let expectJson  = [{"io7":false}];

        let binaryArray = responseBinaryString.split(" ").map(function(val,index){return parseInt(val, 16);});
        let binary = new Uint8Array(binaryArray);

        let json = this.obniz.binary2Json(binary);

        let isValidCommand = testUtil.isValidCommandResponseJson(json);
        expect(isValidCommand.valid).to.be.true;

        expect(json).to.be.deep.equal(expectJson);
    });



    


    it("response test no.9",  function () {
        let responseBinaryString = "02 01 02 07 01";
        let expectJson  = [{"io7":true}];

        let binaryArray = responseBinaryString.split(" ").map(function(val,index){return parseInt(val, 16);});
        let binary = new Uint8Array(binaryArray);

        let json = this.obniz.binary2Json(binary);

        let isValidCommand = testUtil.isValidCommandResponseJson(json);
        expect(isValidCommand.valid).to.be.true;

        expect(json).to.be.deep.equal(expectJson);
    });



    


    it("response test no.10",  function () {
        let responseBinaryString = "02 01 02 07 00";
        let expectJson  = [{"io7":false}];

        let binaryArray = responseBinaryString.split(" ").map(function(val,index){return parseInt(val, 16);});
        let binary = new Uint8Array(binaryArray);

        let json = this.obniz.binary2Json(binary);

        let isValidCommand = testUtil.isValidCommandResponseJson(json);
        expect(isValidCommand.valid).to.be.true;

        expect(json).to.be.deep.equal(expectJson);
    });



    


    it("response test no.11",  function () {
        let responseBinaryString = "02 01 02 07 01";
        let expectJson  = [{"io7":true}];

        let binaryArray = responseBinaryString.split(" ").map(function(val,index){return parseInt(val, 16);});
        let binary = new Uint8Array(binaryArray);

        let json = this.obniz.binary2Json(binary);

        let isValidCommand = testUtil.isValidCommandResponseJson(json);
        expect(isValidCommand.valid).to.be.true;

        expect(json).to.be.deep.equal(expectJson);
    });



    


    it("response test no.12",  function () {
        let responseBinaryString = "02 01 02 07 00";
        let expectJson  = [{"io7":false}];

        let binaryArray = responseBinaryString.split(" ").map(function(val,index){return parseInt(val, 16);});
        let binary = new Uint8Array(binaryArray);

        let json = this.obniz.binary2Json(binary);

        let isValidCommand = testUtil.isValidCommandResponseJson(json);
        expect(isValidCommand.valid).to.be.true;

        expect(json).to.be.deep.equal(expectJson);
    });



    


    it("response test no.13",  function () {
        let responseBinaryString = "02 01 02 07 01";
        let expectJson  = [{"io7":true}];

        let binaryArray = responseBinaryString.split(" ").map(function(val,index){return parseInt(val, 16);});
        let binary = new Uint8Array(binaryArray);

        let json = this.obniz.binary2Json(binary);

        let isValidCommand = testUtil.isValidCommandResponseJson(json);
        expect(isValidCommand.valid).to.be.true;

        expect(json).to.be.deep.equal(expectJson);
    });






  it("request output shortcut",  function () {
    let requestJson  = [{"io0":true}];
    let expecteBinaryStrings = ["02 00 02 00 01"];

    expect(requestJson.length).to.be.equal(1);

    let isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    let compress = this.obniz.constructor.WSCommand.compress(this.obniz.wscommands, requestJson[0]);


    let binaryArray = expecteBinaryStrings.join(" ").split(" ").map(function(val,index){return parseInt(val, 16);});
    expect(binaryArray.length).to.be.above(2);
    let binary = new Uint8Array(binaryArray);

    expect(compress).to.be.deep.equal(binary);
  });






  it("request output direction&amp;value",  function () {
    let requestJson  = [{"io0":{"direction":"output","value":true}}];
    let expecteBinaryStrings = ["02 00 02 00 01"];

    expect(requestJson.length).to.be.equal(1);

    let isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    let compress = this.obniz.constructor.WSCommand.compress(this.obniz.wscommands, requestJson[0]);


    let binaryArray = expecteBinaryStrings.join(" ").split(" ").map(function(val,index){return parseInt(val, 16);});
    expect(binaryArray.length).to.be.above(2);
    let binary = new Uint8Array(binaryArray);

    expect(compress).to.be.deep.equal(binary);
  });






  it("request output_type push-pull5v",  function () {
    let requestJson  = [{"io1":{"output_type":"push-pull5v"}}];
    let expecteBinaryStrings = ["02 03 02 01 00"];

    expect(requestJson.length).to.be.equal(1);

    let isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    let compress = this.obniz.constructor.WSCommand.compress(this.obniz.wscommands, requestJson[0]);


    let binaryArray = expecteBinaryStrings.join(" ").split(" ").map(function(val,index){return parseInt(val, 16);});
    expect(binaryArray.length).to.be.above(2);
    let binary = new Uint8Array(binaryArray);

    expect(compress).to.be.deep.equal(binary);
  });






  it("request output_type push-pull3v",  function () {
    let requestJson  = [{"io1":{"output_type":"push-pull3v"}}];
    let expecteBinaryStrings = ["02 03 02 01 02"];

    expect(requestJson.length).to.be.equal(1);

    let isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    let compress = this.obniz.constructor.WSCommand.compress(this.obniz.wscommands, requestJson[0]);


    let binaryArray = expecteBinaryStrings.join(" ").split(" ").map(function(val,index){return parseInt(val, 16);});
    expect(binaryArray.length).to.be.above(2);
    let binary = new Uint8Array(binaryArray);

    expect(compress).to.be.deep.equal(binary);
  });






  it("request output_type open-drain",  function () {
    let requestJson  = [{"io2":{"output_type":"open-drain"}}];
    let expecteBinaryStrings = ["02 03 02 02 03"];

    expect(requestJson.length).to.be.equal(1);

    let isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    let compress = this.obniz.constructor.WSCommand.compress(this.obniz.wscommands, requestJson[0]);


    let binaryArray = expecteBinaryStrings.join(" ").split(" ").map(function(val,index){return parseInt(val, 16);});
    expect(binaryArray.length).to.be.above(2);
    let binary = new Uint8Array(binaryArray);

    expect(compress).to.be.deep.equal(binary);
  });






  it("request pull-up5v",  function () {
    let requestJson  = [{"io3":{"pull_type":"pull-up5v"}}];
    let expecteBinaryStrings = ["02 04 02 03 03"];

    expect(requestJson.length).to.be.equal(1);

    let isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    let compress = this.obniz.constructor.WSCommand.compress(this.obniz.wscommands, requestJson[0]);


    let binaryArray = expecteBinaryStrings.join(" ").split(" ").map(function(val,index){return parseInt(val, 16);});
    expect(binaryArray.length).to.be.above(2);
    let binary = new Uint8Array(binaryArray);

    expect(compress).to.be.deep.equal(binary);
  });






  it("request pull-up3v",  function () {
    let requestJson  = [{"io4":{"pull_type":"pull-up3v"}}];
    let expecteBinaryStrings = ["02 04 02 04 01"];

    expect(requestJson.length).to.be.equal(1);

    let isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    let compress = this.obniz.constructor.WSCommand.compress(this.obniz.wscommands, requestJson[0]);


    let binaryArray = expecteBinaryStrings.join(" ").split(" ").map(function(val,index){return parseInt(val, 16);});
    expect(binaryArray.length).to.be.above(2);
    let binary = new Uint8Array(binaryArray);

    expect(compress).to.be.deep.equal(binary);
  });






  it("request pull-down",  function () {
    let requestJson  = [{"io5":{"pull_type":"pull-down"}}];
    let expecteBinaryStrings = ["02 04 02 05 02"];

    expect(requestJson.length).to.be.equal(1);

    let isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    let compress = this.obniz.constructor.WSCommand.compress(this.obniz.wscommands, requestJson[0]);


    let binaryArray = expecteBinaryStrings.join(" ").split(" ").map(function(val,index){return parseInt(val, 16);});
    expect(binaryArray.length).to.be.above(2);
    let binary = new Uint8Array(binaryArray);

    expect(compress).to.be.deep.equal(binary);
  });






  it("request float",  function () {
    let requestJson  = [{"io6":{"pull_type":"float"}}];
    let expecteBinaryStrings = ["02 04 02 06 00"];

    expect(requestJson.length).to.be.equal(1);

    let isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    let compress = this.obniz.constructor.WSCommand.compress(this.obniz.wscommands, requestJson[0]);


    let binaryArray = expecteBinaryStrings.join(" ").split(" ").map(function(val,index){return parseInt(val, 16);});
    expect(binaryArray.length).to.be.above(2);
    let binary = new Uint8Array(binaryArray);

    expect(compress).to.be.deep.equal(binary);
  });






  it("request input shortcut",  function () {
    let requestJson  = [{"io7":"get"}];
    let expecteBinaryStrings = ["02 02 01 07"];

    expect(requestJson.length).to.be.equal(1);

    let isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    let compress = this.obniz.constructor.WSCommand.compress(this.obniz.wscommands, requestJson[0]);


    let binaryArray = expecteBinaryStrings.join(" ").split(" ").map(function(val,index){return parseInt(val, 16);});
    expect(binaryArray.length).to.be.above(2);
    let binary = new Uint8Array(binaryArray);

    expect(compress).to.be.deep.equal(binary);
  });






  it("request input object",  function () {
    let requestJson  = [{"io7":{"direction":"input","stream":true}}];
    let expecteBinaryStrings = ["02 01 01 07"];

    expect(requestJson.length).to.be.equal(1);

    let isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    let compress = this.obniz.constructor.WSCommand.compress(this.obniz.wscommands, requestJson[0]);


    let binaryArray = expecteBinaryStrings.join(" ").split(" ").map(function(val,index){return parseInt(val, 16);});
    expect(binaryArray.length).to.be.above(2);
    let binary = new Uint8Array(binaryArray);

    expect(compress).to.be.deep.equal(binary);
  });






  it("request inputWait",  function () {
    let requestJson  = [{"io8":{"direction":"input","stream":false}}];
    let expecteBinaryStrings = ["02 02 01 08"];

    expect(requestJson.length).to.be.equal(1);

    let isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    let compress = this.obniz.constructor.WSCommand.compress(this.obniz.wscommands, requestJson[0]);


    let binaryArray = expecteBinaryStrings.join(" ").split(" ").map(function(val,index){return parseInt(val, 16);});
    expect(binaryArray.length).to.be.above(2);
    let binary = new Uint8Array(binaryArray);

    expect(compress).to.be.deep.equal(binary);
  });






  it("request ioAnimation",  function () {
    let requestJson  = [{"io":{"animation":{"name":"animation-1","states":[{"duration":10,"state":{"io0":false,"io1":true}},{"duration":10,"state":{"io0":true,"io1":false}}],"status":"loop"}}}];

    expect(requestJson.length).to.be.equal(1);

    let isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    let compress = this.obniz.constructor.WSCommand.compress(this.obniz.wscommands, requestJson[0]);
    expect(compress).to.be.null; // use server command
  });






  it("request ioAnimation-pause",  function () {
    let requestJson  = [{"io":{"animation":{"name":"animation-1","status":"pause"}}}];
    let expecteBinaryStrings = ["01 01 0d 0c 61 6e 69 6d 61 74 69 6f 6e 2d 31 00"];

    expect(requestJson.length).to.be.equal(1);

    let isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    let compress = this.obniz.constructor.WSCommand.compress(this.obniz.wscommands, requestJson[0]);
    expect(compress).to.be.null; // use server command
  });






  it("request ioAnimation-pause",  function () {
    let requestJson  = [{"io":{"animation":{"name":"anim","status":"pause"}}}];
    let expecteBinaryStrings = ["01 01 06 05 61 6e 69 6d 00"];

    expect(requestJson.length).to.be.equal(1);

    let isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    let compress = this.obniz.constructor.WSCommand.compress(this.obniz.wscommands, requestJson[0]);
    expect(compress).to.be.null; // use server command
  });






  it("request ioAnimation-resume",  function () {
    let requestJson  = [{"io":{"animation":{"name":"a","status":"resume"}}}];
    let expecteBinaryStrings = ["01 02 03 02 61 00"];

    expect(requestJson.length).to.be.equal(1);

    let isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    let compress = this.obniz.constructor.WSCommand.compress(this.obniz.wscommands, requestJson[0]);
    expect(compress).to.be.null; // use server command
  });






  it("response input",  function () {
    let responseBinaryString = "02 01 02 07 01";
    let expectJson  = [{"io7":true}];

    let binaryArray = responseBinaryString.split(" ").map(function(val,index){return parseInt(val, 16);});
    let binary = new Uint8Array(binaryArray);

    let json = this.obniz.binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });




});

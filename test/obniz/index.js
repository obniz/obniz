var chai = require('chai');
var assert = chai.assert;
var sinon = require('sinon');

var projectBaseUrl = "../../";
//require(projectBaseUrl + "/obniz/libs/io_.js");
//var Obniz = require(projectBaseUrl + "/obniz/index.js");
var Obniz = require(projectBaseUrl + "index.js");


describe("obniz.index", function () {
  beforeEach(function () {
    sinon.stub(console, 'error');
  });
  afterEach(function () {
    console.error.restore(); // Unwraps the spy
  });

  it("instance", function () {
    var obniz = new Obniz("OBNIZ_ID_HERE");
    assert(obniz instanceof Obniz, "create instance");
    assert(console.error.calledOnce, "call once");
    assert(console.error.calledWith("invalid obniz id"), "display error");
  });   
    
});
var chai = require('chai');
var assert = chai.assert;
require('mocha-sinon');
var Obniz = require("../../index.js");


describe("obniz.index", function() {
  beforeEach(function() {
    this.sinon.stub(console, 'error');
  });
  
    it("instance", function() {
        var obniz = new Obniz("OBNIZ_ID_HERE");
        assert(obniz instanceof Obniz , "create instance");
        assert( console.error.calledOnce , "call once") ;
        assert( console.error.calledWith("invalid obniz id"), "display error") ;
    });

});
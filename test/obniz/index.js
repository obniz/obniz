var chai = require('chai');
var assert = chai.assert;
var Obniz = require("../../index.js");


describe("obniz", function() {
    it("instance", function() {
        var obniz = new Obniz("OBNIZ_ID_HERE");
        assert.strictEqual(obniz, null);
    });

});
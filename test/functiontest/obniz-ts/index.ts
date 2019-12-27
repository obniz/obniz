import assert = require("assert");
import chai = require("chai");
import chaiLike = require("chai-like");
import sinon = require("sinon");
import testUtil = require("../testUtil");

const expect = chai.expect;

chai.use(chaiLike);
chai.use(testUtil.obnizAssert);

describe("Moneyクラスのテスト", () => {
  it("test", () => {
    const error = sinon.stub(console, "error");
    const log = sinon.stub(console, "log");
    const obniz = testUtil.createObniz(3000, "OBNIZ_ID_HERE");
    expect(obniz).to.be.obniz();
    sinon.assert.calledOnce(error);
    sinon.assert.calledWith(error, "invalid obniz id");
    error.restore(); // Unwraps the spy
    log.restore(); // Unwraps the spy
  });

});

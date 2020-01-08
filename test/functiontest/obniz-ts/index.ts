import assert = require("assert");
import chai = require("chai");
import chaiLike = require("chai-like");
import sinon = require("sinon");
import testUtil = require("../testUtil");

const expect = chai.expect;

chai.use(chaiLike);
chai.use(testUtil.obnizAssert);

describe("ts", () => {
  it("test", () => {
    const a = 1 + 1;
    expect(a).to.be.equal(2);
  });

});

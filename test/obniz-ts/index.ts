import assert = require('assert');
import sinon = require("sinon");

import chai = require('chai');
const expect = chai.expect;
import testUtil = require("../testUtil");
chai.use(require('chai-like'));
chai.use(testUtil.obnizAssert);

describe('Moneyクラスのテスト', () => {
    it('test', function () {
        let error = sinon.stub(console, 'error');
        let log = sinon.stub(console, 'log');
        let obniz = testUtil.createObniz(3000, 'OBNIZ_ID_HERE');
        expect(obniz).to.be.obniz;
        sinon.assert.calledOnce(error) ;
        sinon.assert.calledWith(error, 'invalid obniz id');
        error.restore(); // Unwraps the spy
        log.restore(); // Unwraps the spy
    });

});
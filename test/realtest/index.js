const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const sinon = require('sinon');
const path = require('path');
const fs = require('fs');

const Obniz = require('../../index.js');

var obnizA_ID = "10760979";
var obnizB_ID = "00978479";

console.log(`obniz ${obnizA_ID} ${obnizB_ID}つかうよ!\n２つを"同じ"電源に繋いでね。`)

describe("obniz", async function () {


  var obnizA;
  var obnizB;

  beforeEach(function (done) {

    obnizA = new Obniz(obnizA_ID);
    // obnizA.debugprint = true;
    obnizA.onconnect = () => {
      obnizB = new Obniz(obnizB_ID);
      // obnizB.debugprint = true;
      obnizB.onconnect = ()=>{
        done();
      }
    }

  });

  afterEach(function () {
    // obnizA.close();
    // obnizB.close();
  });

  const files = fs.readdirSync(path.join(__dirname, 'tests'));
  for (let i=0; i<files.length; i++) {
    if (files[i].indexOf(".js") >=0) {
      it("tests/"+files[i], function () {
        const test = require(path.join(__dirname, 'tests', files[i]))
        test({obnizA, obnizB});
      });
    }
  }

});

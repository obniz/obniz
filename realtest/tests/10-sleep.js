const chai = require('chai');
const expect = chai.expect;
const config = require('../config.js');
/*
Sleep test

1. A:5v output B:5v check
2. A:10s sleep (poweroff = 0v) B:Read 0v check
3. A:sleep end 5v output B:5v check 
*/

let obnizA, obnizB;

describe('10-sleep', function() {
  this.timeout(40000);

  before(function() {
    return new Promise(resolve => {
      config.waitForConenct(() => {
        obnizA = config.obnizA;
        obnizB = config.obnizB;
        resolve();
      });
    });
  });

  //step1
  it('setup', async function() {
    if (obnizA.hw !== 'obnizb2') {
      return;
    }
    obnizA.getIO(0).output(true);
    await obnizA.pingWait();
    let valB = await obnizB.getIO(0).inputWait();
    expect(valB, `expected io0 ${valB} is must be true`).to.be.equal(true);
  });

  //step2
  it('sleep', async function() {
    if (obnizA.hw !== 'obnizb2') {
      return;
    }
    obnizA.sleepSeconds(5);
    obnizB.getIO(0).pull('0v');
    obnizB.getIO(0).drive('open-drain');
    await wait(3000); //sleep = Wait 3 seconds because we can't verify if the command was executed offline
    config.close(obnizA);
    let voltage = await obnizB.getAD(0).getWait();
    expect(voltage, `expected io0 ${voltage} is  0 ~ 2`).to.be.within(0, 2);
  });

  //step3
  it('wakeup', async function() {
    if (obnizA.hw !== 'obnizb2') {
      return;
    }
    await reconnect();
    await wait(1000);
    await obnizA.pingWait();
    obnizA.getIO(0).output(true);
    await obnizA.pingWait();
    let valB = await obnizB.getIO(0).inputWait();
    expect(valB, `expected io0 ${valB} is must be true`).to.be.equal(true);
    obnizA.getIO(0).end();
  });

  //step4
  it('sleepIO sleep', async function() {
    if (obnizA.hw !== 'obnizb2') {
      return;
    }
    obnizA.sleepIoTrigger(true);
    config.close(obnizA);
    await wait(3000); //sleep = Wait 3 seconds because we can't verify if the command was executed offline
    obnizB.getIO(0).output(true); //wake up
    await obnizB.pingWait();
    obnizB.getIO(0).end();
    await reconnect();
    await wait(1000);
    await obnizA.pingWait();
    obnizA.getIO(0).output(true);
    await obnizA.pingWait();
    let valB = await obnizB.getIO(0).inputWait();
    expect(valB, `expected io0 ${valB} is must be true`).to.be.equal(true);
    obnizA.getIO(0).end();
  });
});

function reconnect() {
  return new Promise(resolve => {
    config.reboot(() => {
      obnizA = config.obnizA;
      obnizB = config.obnizB;
      console.error('reboot finished');
      resolve();
    }, false);
  });
}

function wait(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

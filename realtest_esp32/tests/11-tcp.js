const chai = require('chai');
const expect = chai.expect;
const config = require('../config.js');
const TextDecoder = require('text-encoding').TextDecoder;
const net = require('net');

const express = require('express');
const path = require('path');
const app = express();
app.listen(process.env.PORT || 3001);
app.use(express.static(path.join(__dirname, 'web')));
const useIp = '192.168.8.33';

const fs = require('fs');

let checkBoard;

describe('10-tcp', function() {
  this.timeout(10000);

  before(function() {
    return new Promise(resolve => {
      config.waitForConenct(() => {
        checkBoard = config.checkBoard;
        checkBoard.tcp0.onconnection = state => {
          console.log(state);
        };
        resolve();
      });
    });
  });

  it.skip('tcp connect error', async function() {
    let res = await checkBoard.tcp0.connectWait(80, 'obniz.i');
    expect(res).to.deep.equal(3);
    checkBoard.tcp0.close();

    //close wait
    while (checkBoard.tcp0.isUsed()) {
      await wait(10);
    }
  });

  it.skip('tcp connect ok', async function() {
    let res = await checkBoard.tcp0.connectWait(80, 'obniz.io');
    expect(res).to.deep.equal(0);
    checkBoard.tcp0.close();

    //close wait
    while (checkBoard.tcp0.isUsed()) {
      await wait(10);
    }
  });

  it.skip('tcp socket close', async function() {
    let socketState;
    socketState = checkBoard.tcp0.isUsed();
    expect(socketState, 'socket start').to.be.false;

    let res = await checkBoard.tcp0.connectWait(80, 'obniz.io');
    expect(res).to.deep.equal(0);

    socketState = checkBoard.tcp0.isUsed();
    expect(socketState, 'socket open').to.be.true;
    checkBoard.tcp0.write(
      'GET / HTTP/1.0\r\n' + 'Connection:close\r\n' + 'Host:obniz.io\r\n\r\n'
    );
    await checkBoard.tcp0.readWait();
    // let boardData = await checkBoard.tcp0.readWait();
    // boardData = new TextDecoder('utf-8').decode(new Uint8Array(boardData));
    //console.log(boardData);

    socketState = checkBoard.tcp0.isUsed();
    expect(socketState, 'socket close').to.be.false;

    //close wait
    while (checkBoard.tcp0.isUsed()) {
      await wait(10);
    }
  });

  it.skip('tcp get', async function() {
    await checkBoard.tcp0.connectWait(80, 'obniz.io');
    checkBoard.tcp0.write(
      'GET / HTTP/1.0\r\n' + 'Connection:close\r\n' + 'Host:obniz.io\r\n\r\n'
    );
    let jsData = await getServerData(
      80,
      'obniz.io',
      'GET / HTTP/1.0\r\n' + 'Connection:close\r\n' + 'Host:obniz.io\r\n\r\n'
    );
    jsData = new TextDecoder('utf-8').decode(new Uint8Array(jsData));
    //console.log(jsData);

    let boardData = await checkBoard.tcp0.readWait();
    boardData = new TextDecoder('utf-8').decode(new Uint8Array(boardData));
    //console.log(boardData);
    expect(boardData).to.be.equals(jsData);

    //close wait
    while (checkBoard.tcp0.isUsed()) {
      await wait(10);
    }
  });

  it.skip('tcp port', async function() {
    await checkBoard.tcp0.connectWait(3001, useIp);
    checkBoard.tcp0.write(
      'GET / HTTP/1.0\r\n' +
        'Connection:close\r\n' +
        'Host:' +
        useIp +
        '\r\n\r\n'
    );
    let boardData = await checkBoard.tcp0.readWait();
    boardData = new TextDecoder('utf-8').decode(new Uint8Array(boardData));
    console.log(boardData);
    let jsData = await getServerData(
      3001,
      useIp,
      'GET / HTTP/1.0\r\n' +
        'Connection:close\r\n' +
        'Host:' +
        useIp +
        '\r\n\r\n'
    );
    jsData = new TextDecoder('utf-8').decode(new Uint8Array(jsData));
    console.log(jsData);

    expect(boardData).to.be.equals(jsData);

    //close wait
    while (checkBoard.tcp0.isUsed()) {
      await wait(10);
    }
  });
  it('tcp image', async function() {
    await checkBoard.tcp0.connectWait(3001, useIp);
    checkBoard.tcp0.write(
      'GET /obniz.png HTTP/1.0\r\n' +
        'Connection:close\r\n' +
        'Host:' +
        useIp +
        '\r\n\r\n'
    );
    let boardData = [];
    while (checkBoard.tcp0.isUsed()) {
      boardData = boardData.concat(await checkBoard.tcp0.readWait());
      //boardData = await checkBoard.tcp0.readWait();
      //console.log(boardData);
    }
    boardData = new Uint8Array(boardData);
    //console.log(boardData);
    console.log(boardData.length);
    let jsData = await getServerData(
      3001,
      useIp,
      'GET /obniz.png HTTP/1.0\r\n' +
        'Connection:close\r\n' +
        'Host:' +
        useIp +
        '\r\n\r\n'
    );
    jsData = new Uint8Array(jsData);
    console.log('jsData');
    //console.log(jsData);
    console.log(jsData.length);

    try {
      fs.writeFileSync(path.join(__dirname, 'net.txt'), jsData);
      console.log('write end');
    } catch (e) {
      console.log(e);
    }
    try {
      fs.writeFileSync(path.join(__dirname, 'obniz.txt'), boardData);
      console.log('write end');
    } catch (e) {
      console.log(e);
    }
    expect(boardData).to.be.equals(jsData);

    //close wait
    while (checkBoard.tcp0.isUsed()) {
      await wait(10);
    }
  });
});

async function getServerData(port, domain, writeData) {
  let client = new net.Socket();
  client.connect(
    { port: port, host: domain },
    () => {
      client.write(writeData);
    }
  );
  return new Promise(function(resolve, reject) {
    client.on('data', data => {
      resolve(data);
    });
  });
}

function wait(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

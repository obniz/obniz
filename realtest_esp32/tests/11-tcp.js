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
const useIp = config.LOCAL_IP;

let checkBoard;
const MAX_TCP_CONNECTION = 8;
let tcpArray = [];

describe('10-tcp', function() {
  this.timeout(20000);

  before(function() {
    return new Promise(resolve => {
      config.waitForConenct(() => {
        checkBoard = config.checkBoard;
        // checkBoard.tcp0.onconnection = state => {
        //   console.log(state);
        // };
        resolve();
      });
    });
  });

  it('tcp connect error', async function() {
    let res = await checkBoard.tcp0.connectWait(80, 'obniz.i');
    expect(res).to.deep.equal(3);
    checkBoard.tcp0.close();

    //close wait
    while (checkBoard.tcp0.isUsed()) {
      await wait(10);
    }
  });

  it('tcp connect ok', async function() {
    let res = await checkBoard.tcp0.connectWait(80, 'obniz.io');
    expect(res).to.deep.equal(0);
    checkBoard.tcp0.close();

    //close wait
    while (checkBoard.tcp0.isUsed()) {
      await wait(10);
    }
  });

  it('tcp socket close', async function() {
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

    //close wait
    while (checkBoard.tcp0.isUsed()) {
      await wait(10);
    }

    socketState = checkBoard.tcp0.isUsed();
    expect(socketState, 'socket close').to.be.false;

    //close wait
    while (checkBoard.tcp0.isUsed()) {
      await wait(10);
    }
  });

  it('tcp get', async function() {
    await checkBoard.tcp0.connectWait(80, 'obniz.io');
    checkBoard.tcp0.write(
      'GET / HTTP/1.0\r\n' + 'Connection:close\r\n' + 'Host:obniz.io\r\n\r\n'
    );
    let jsData = await getServerData(
      80,
      'obniz.io',
      'GET / HTTP/1.0\r\n' + 'Connection:close\r\n' + 'Host:obniz.io\r\n\r\n'
    );
    jsData = new TextDecoder('utf-8').decode(bodyParser(jsData));
    //console.log(jsData);

    let boardData = await checkBoard.tcp0.readWait();
    boardData = new TextDecoder('utf-8').decode(bodyParser(boardData));
    //console.log(boardData);
    expect(boardData).to.be.equals(jsData);

    //close wait
    while (checkBoard.tcp0.isUsed()) {
      await wait(10);
    }
  });

  it('tcp port', async function() {
    await checkBoard.tcp0.connectWait(3001, useIp);
    checkBoard.tcp0.write(
      'GET / HTTP/1.0\r\n' +
        'Connection:close\r\n' +
        'Host:' +
        useIp +
        '\r\n\r\n'
    );
    let boardData = await checkBoard.tcp0.readWait();
    boardData = new TextDecoder('utf-8').decode(bodyParser(boardData));
    //console.log(boardData);
    let jsData = await getServerData(
      3001,
      useIp,
      'GET / HTTP/1.0\r\n' +
        'Connection:close\r\n' +
        'Host:' +
        useIp +
        '\r\n\r\n'
    );
    jsData = new TextDecoder('utf-8').decode(bodyParser(jsData));
    expect(boardData).to.be.equals(jsData);

    //close wait
    while (checkBoard.tcp0.isUsed()) {
      await wait(10);
    }
  });

  it('tcp image', async function() {
    await checkBoard.tcp0.connectWait(3001, useIp);
    checkBoard.tcp0.write(
      'GET /obniz_big.png HTTP/1.0\r\n' +
        'Connection:close\r\n' +
        'Host:' +
        useIp +
        '\r\n\r\n'
    );
    let boardData = [];
    checkBoard.tcp0.onreceive = data => {
      boardData = boardData.concat(data);
      //console.log(boardData.length);
    };
    while (checkBoard.tcp0.isUsed()) {
      await wait(1);
    }
    checkBoard.tcp0.onreceive = null;
    boardData = bodyParser(boardData);

    let jsData = await getServerData(
      3001,
      useIp,
      'GET /obniz_big.png HTTP/1.0\r\n' +
        'Connection:close\r\n' +
        'Host:' +
        useIp +
        '\r\n\r\n'
    );
    jsData = bodyParser(jsData);

    expect(boardData).to.deep.equals(jsData);

    //close wait
    while (checkBoard.tcp0.isUsed()) {
      await wait(10);
    }
  });

  it('tcp mult connect', async function() {
    for (let i = 0; i < MAX_TCP_CONNECTION; i++) {
      tcpArray.push(checkBoard.getFreeTcp());
      await tcpArray[i].connectWait(3001, useIp);
    }
  });

  it('tcp mult read', async function() {
    let jsData = await getServerData(
      3001,
      useIp,
      'GET / HTTP/1.0\r\n' +
        'Connection:close\r\n' +
        'Host:' +
        useIp +
        '\r\n\r\n'
    );
    jsData = bodyParser(jsData);
    for (let i = 0; i < MAX_TCP_CONNECTION; i++) {
      tcpArray[i].write(
        'GET / HTTP/1.0\r\n' +
          'Connection:close\r\n' +
          'Host:' +
          useIp +
          '\r\n\r\n'
      );
      let boardData = await tcpArray[i].readWait();
      boardData = bodyParser(boardData);
      expect(boardData, 'tcp mult read connection : ' + i).to.deep.equals(
        jsData
      );
    }

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

function bodyParser(data) {
  data = new Uint8Array(data);
  let lfpos = data.indexOf(0x0a);
  while (lfpos != -1) {
    let nextpos = data.indexOf(0x0a, lfpos + 1);
    if (nextpos - lfpos == 2) {
      return data.slice(nextpos + 1);
    }
    lfpos = nextpos;
  }
  console.error('body notfound');
  return null;
}

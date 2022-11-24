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
const tcpArray = [];

describe('11-tcp', function () {
  this.timeout(30000 * (config.json.long_timeout || 1));

  before(async function () {
    if (process.env.IGNORE_TCP_TEST === 'true') {
      this.skip();
      return;
    }
    await config.waitForConenct();
    checkBoard = config.checkBoard;
    // checkBoard.tcp0.onconnection = state => {
    //   console.log(state);
    // };
    for (let i = 0; i < MAX_TCP_CONNECTION; i++) {
      const tcp = checkBoard['tcp' + i];
      if (tcp.isUsed()) {
        tcp.close();
        await checkBoard.pingWait();
      }
    }
  });

  afterEach(async () => {
    for (let i = 0; i < MAX_TCP_CONNECTION; i++) {
      const tcp = checkBoard['tcp' + i];
      if (tcp.isUsed()) {
        tcp.close();
        await checkBoard.pingWait();
      }
    }
  });

  it('tcp connect error', async () => {
    const res = await checkBoard.tcp0.connectWait(80, 'obniz.i');
    expect(res).to.deep.within(3, 4);
    await checkBoard.pingWait();
    checkBoard.tcp0.close();
    // close wait
    while (checkBoard.tcp0.isUsed()) {
      await wait(10);
    }
  });

  it('tcp connect ok', async () => {
    const res = await checkBoard.tcp0.connectWait(80, 'obniz.io');
    await checkBoard.pingWait();
    expect(res).to.deep.equal(0);
    checkBoard.tcp0.close();

    await checkBoard.pingWait();
    // close wait
    while (checkBoard.tcp0.isUsed()) {
      await wait(10);
    }
  });

  it('tcp socket close', async () => {
    let socketState;
    socketState = checkBoard.tcp0.isUsed();
    expect(socketState, 'socket start').to.be.false;

    const res = await checkBoard.tcp0.connectWait(80, 'obniz.io');
    expect(res).to.deep.equal(0);

    socketState = checkBoard.tcp0.isUsed();
    expect(socketState, 'socket open').to.be.true;
    checkBoard.tcp0.write(
      'GET / HTTP/1.0\r\n' + 'Connection:close\r\n' + 'Host:obniz.io\r\n\r\n'
    );
    await checkBoard.tcp0.readWait();
    // let boardData = await checkBoard.tcp0.readWait();
    // boardData = new TextDecoder('utf-8').decode(new Uint8Array(boardData));
    // console.log(boardData);

    await checkBoard.pingWait();
    // close wait
    while (checkBoard.tcp0.isUsed()) {
      await wait(10);
    }

    socketState = checkBoard.tcp0.isUsed();
    expect(socketState, 'socket close').to.be.false;

    // close wait
    while (checkBoard.tcp0.isUsed()) {
      await wait(10);
    }
  });

  it('tcp get', async () => {
    await checkBoard.tcp0.connectWait(80, 'obniz.io');
    checkBoard.tcp0.write(
      'GET / HTTP/1.0\r\n' + 'Connection:close\r\n' + 'Host:obniz.io\r\n\r\n'
    );
    let jsData = await getServerDataWait(
      80,
      'obniz.io',
      'GET / HTTP/1.0\r\n' + 'Connection:close\r\n' + 'Host:obniz.io\r\n\r\n'
    );
    jsData = new TextDecoder('utf-8').decode(bodyParser(jsData));
    // console.log(jsData);

    let boardData = await checkBoard.tcp0.readWait();
    boardData = new TextDecoder('utf-8').decode(bodyParser(boardData));
    // console.log(boardData);
    expect(boardData).to.be.equals(jsData);

    await checkBoard.pingWait();
    // close wait
    while (checkBoard.tcp0.isUsed()) {
      await wait(10);
    }
  });

  it('tcp port', async function () {
    if (!useIp) {
      this.skip();
    }
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
    // console.log(boardData);
    let jsData = await getServerDataWait(
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

    await checkBoard.pingWait();
    // close wait
    while (checkBoard.tcp0.isUsed()) {
      await wait(10);
    }
  });

  it('tcp image', async function () {
    if (!useIp) {
      this.skip();
    }
    await checkBoard.tcp0.connectWait(3001, useIp);
    checkBoard.tcp0.write(
      'GET /obniz_big.png HTTP/1.0\r\n' +
        'Connection:close\r\n' +
        'Host:' +
        useIp +
        '\r\n\r\n'
    );
    let boardData = [];
    checkBoard.tcp0.onreceive = (data) => {
      boardData = boardData.concat(data);
      // console.log(boardData.length);
    };
    await checkBoard.pingWait();
    while (checkBoard.tcp0.isUsed()) {
      await wait(1);
    }
    checkBoard.tcp0.onreceive = null;
    boardData = bodyParser(boardData);

    let jsData = await getServerDataWait(
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

    await checkBoard.pingWait();
    // close wait
    while (checkBoard.tcp0.isUsed()) {
      await wait(10);
    }
  });

  it('tcp mult connect', async function () {
    if (!useIp) {
      this.skip();
    }
    for (let i = 0; i < MAX_TCP_CONNECTION; i++) {
      tcpArray.push(checkBoard.getFreeTcp());
      await tcpArray[i].connectWait(3001, useIp);
    }
    let jsData = await getServerDataWait(
      3001,
      useIp,
      'GET / HTTP/1.0\r\n' +
        'Connection:close\r\n' +
        'Host:' +
        useIp +
        '\r\n\r\n'
    );
    jsData = bodyParser(jsData);
    // console.log(jsData);
    for (let i = 0; i < MAX_TCP_CONNECTION; i++) {
      tcpArray[i].write(
        'GET / HTTP/1.0\r\n' +
          'Connection:close\r\n' +
          'Host:' +
          useIp +
          '\r\n\r\n'
      );
      //    console.log("wait");
      let boardData = await tcpArray[i].readWait();
      boardData = bodyParser(boardData);
      expect(boardData, 'tcp mult read connection : ' + i).to.deep.equals(
        jsData
      );
      // console.log(boardData);
    }

    await checkBoard.pingWait();
    // close wait
    while (checkBoard.tcp0.isUsed()) {
      await wait(10);
    }
  });
});

const getServerDataWait = async (port, domain, writeData) => {
  const client = new net.Socket();
  client.connect({ port, host: domain }, () => {
    client.write(writeData);
  });
  return new Promise((resolve) => {
    client.on('data', (data) => {
      resolve(data);
    });
  });
};

const wait = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const bodyParser = (data) => {
  data = new Uint8Array(data);
  let lfpos = data.indexOf(0x0a);
  while (lfpos !== -1) {
    const nextpos = data.indexOf(0x0a, lfpos + 1);
    if (nextpos - lfpos === 2) {
      return data.slice(nextpos + 1);
    }
    lfpos = nextpos;
  }
  console.error('body notfound');
  return null;
};

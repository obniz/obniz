// const Obniz = require('obniz');
const Obniz = require('../../../../index.js'); // local
const fetch = require('node-fetch');
const { preProcessFile } = require('typescript');
const { EventEmitter } = require('stream');
const { escapeRegExp } = require('lodash');
const mesh_led = Obniz.getPartsClass('MESH_100TH');

const obnizId = '00000000';

const obniz = new Obniz(obnizId, {
  access_token: null,
});

// Connected. 接続完了
obniz.onconnect = async () => {
  console.log(`connected obniz ${obniz.id}`);
  try {
    await obniz.ble.initWait();
    obniz.ble.scan.onfind = async (peripheral) => {
      if (!mesh_led.isMESHblock(peripheral)) {
        // console.log('No MESH Block : ' + peripheral.localName);
        return;
      }
      console.log('obniz.ble.scan.onfind : ' + peripheral.localName + ' : ' + peripheral.rssi);
      const LED_block = new mesh_led(peripheral);
      await LED_block.connectWait();
      await LED_block.wirteFeatureWait();
      await LED_block.lightup(255, 0, 0, 4000, 256, 256, 1);
    };
    await obniz.ble.scan.startWait();
  } catch (e) {
    if (e.name === 'ObnizOfflineError') {
      // just disconnected. waiting for new connection establishment.
    } else {
      console.error(e);
    }
  }
};

// Disconnected. 切断。
obniz.onclose = async () => {
  console.log(`connection lost for obniz ${obniz.id}`);
};


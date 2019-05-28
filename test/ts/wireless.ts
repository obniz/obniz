import * as Obniz from '../../obniz';

const OBNIZ_ID = '1234-5678';

/**
 * https://obniz.io/ja/sdk/parts/RN42/README.md
 */
class RN42Test {
  send() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var rn42 = obniz.wired('RN42', { tx: 1, rx: 2 });
      rn42.send('Hello');
    };
  }

  onreceive() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var rn42 = obniz.wired('RN42', { tx: 1, rx: 2 });
      rn42.onreceive = function(data, text) {
        console.log(text);
      };
    };
  }

  config() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var rn42 = obniz.wired('RN42', { tx: 1, rx: 2 });
      rn42.config({
        display_name: 'obniz',
        master_slave: 'slave',
        profile: 'HID',
        auth: 'just-work',
        power: 16
      });
    };
  }

  enterCommandMode() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var rn42 = obniz.wired('RN42', { tx: 1, rx: 2 });
      rn42.enterCommandMode();
      rn42.sendCommand('SM,0');
    };
  }

  sendCommand() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var rn42 = obniz.wired('RN42', { tx: 1, rx: 2 });
      rn42.enterCommandMode();
      rn42.sendCommand('SM,0');
    };
  }

  config_get_setting() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var rn42 = obniz.wired('RN42', { tx: 1, rx: 2 });
      rn42.onreceive = function(data, text) {
        console.log(text);
      };
      rn42.enterCommandMode();
      rn42.config_get_setting();
    };
  }

  config_get_extendSetting() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var rn42 = obniz.wired('RN42', { tx: 1, rx: 2 });
      rn42.onreceive = function(data, text) {
        console.log(text);
      };
      rn42.enterCommandMode();
      rn42.config_get_setting();
    };
  }
}

/**
 * https://obniz.io/ja/sdk/parts/XBee/README.md
 */
class XBeeTest {
  configWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      obniz.io11.output(true);
      obniz.io8.output(false);
      var xbee = obniz.wired('XBee', { tx: 9, rx: 10 });
      await xbee.configWait({
        destination_address: '52',
        source_address: '51'
      });
    };
  }

  send() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      obniz.io11.output(true);
      obniz.io8.output(false);
      var xbee = obniz.wired('XBee', { tx: 9, rx: 10 });
      xbee.send('Hi');
      xbee.send(0x11);
      xbee.send([0x11, 0x45, 0x44]);
      xbee.send({ success: true });
    };
  }

  onreceive() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      obniz.io11.output(true);
      obniz.io8.output(false);
      var xbee = obniz.wired('XBee', { tx: 9, rx: 10 });
      xbee.onreceive = function(data, text) {
        console.log('recieved : ' + text);
      };
    };
  }
}

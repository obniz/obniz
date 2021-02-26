/* tslint:disable:class-name max-classes-per-file */

import Obniz from '../../../dist/src/obniz/index';

const OBNIZ_ID = '1234-5678';

/**
 * https://obniz.io/ja/sdk/parts/RN42/README.md
 */
class RN42Test {
  public send() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const rn42 = obniz.wired('RN42', { tx: 1, rx: 2 });
      rn42.send('Hello');
    };
  }

  public onreceive() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const rn42 = obniz.wired('RN42', { tx: 1, rx: 2 });
      rn42.onreceive = (data, text) => {
        console.log(text);
      };
    };
  }

  public config() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const rn42 = obniz.wired('RN42', { tx: 1, rx: 2 });
      rn42.config({
        display_name: 'obniz',
        master_slave: 'slave',
        profile: 'HID',
        auth: 'just-work',
        power: 16,
      });
    };
  }

  public enterCommandMode() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const rn42 = obniz.wired('RN42', { tx: 1, rx: 2 });
      rn42.enterCommandMode();
      rn42.sendCommand('SM,0');
    };
  }

  public sendCommand() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const rn42 = obniz.wired('RN42', { tx: 1, rx: 2 });
      rn42.enterCommandMode();
      rn42.sendCommand('SM,0');
    };
  }

  public config_get_setting() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const rn42 = obniz.wired('RN42', { tx: 1, rx: 2 });
      rn42.onreceive = (data, text) => {
        console.log(text);
      };
      rn42.enterCommandMode();
      rn42.config_get_setting();
    };
  }

  public config_get_extendSetting() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const rn42 = obniz.wired('RN42', { tx: 1, rx: 2 });
      rn42.onreceive = (data, text) => {
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
  public configWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      obniz.io11!.output(true);
      obniz.io8!.output(false);
      const xbee = obniz.wired('XBee', { tx: 9, rx: 10 });
      await xbee.configWait({
        destination_address: '52',
        source_address: '51',
      });
    };
  }

  public send() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      obniz.io11!.output(true);
      obniz.io8!.output(false);
      const xbee = obniz.wired('XBee', { tx: 9, rx: 10 });
      xbee.send('Hi');
      xbee.send(0x11);
      xbee.send([0x11, 0x45, 0x44]);
      xbee.send({ success: true });
    };
  }

  public onreceive() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      obniz.io11!.output(true);
      obniz.io8!.output(false);
      const xbee = obniz.wired('XBee', { tx: 9, rx: 10 });
      xbee.onreceive = (data: any, text: string) => {
        console.log('recieved : ' + text);
      };
    };
  }
}

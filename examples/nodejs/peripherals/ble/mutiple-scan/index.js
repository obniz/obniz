const Obniz = require('obniz');
const fetch = require('node-fetch');

// Scan Targets
// We recommend to you hosted app.
// スキャンに使うobnizID一覧
// このexampleではコード内に記載されていますが、ホステッドアプリを作り、クラウドから一覧を取得することを推奨します。
// https://obniz.com/ja/doc/guides/hosted-app/about
const obnizList = ['00000000', '00000000'];

// Token that being granted to control above devices.
// 上記のデバイスにアクセスできるキー(文字列)。obnizにアクセストークンが発行されていなければ不要。
const accessToken = null;

for (const obnizId of obnizList) {
  // instantiate
  const obniz = new Obniz(obnizId, {
    access_token: accessToken,
  });

  // Connected. 接続完了
  obniz.onconnect = async () => {
    console.log(`connected obniz ${obniz.id}`);
    try {
      await obniz.ble.initWait();
      await continueScan(obniz);
    } catch (e) {
      if (e.name === 'ObnizOfflineError') {
        // just disconnected. waiting for new connection establishment.
      } else {
        // you should handle other errors.
        console.error(e);
      }
    }
  };

  // Disconnected. 切断。
  obniz.onclose = async () => {
    console.log(`connection lost for obniz ${obniz.id}`);
  };
}

async function continueScan(obniz) {
  while (obniz.connectionState === 'connected') {
    // Scannning
    const founded = await scanFor(obniz, 60);
    // send to API.
    try {
      await reportAPI(founded);
    } catch (e) {
      // API Error. You should decide to stop process or just ignore as temporary error.
      console.error(e);
    }
  }
}

async function scanFor(obniz, seconds) {
  // scan specified seconds
  return await new Promise(async (resolve, reject) => {
    // All Founded;
    const foundBeacons = [];
    obniz.ble.scan.onfind = async peripheral => {
      // Beacon Found
      console.log(
        `obniz ${obniz.id} Found beacon localName=${peripheral.localName}`
      );
      foundBeacons.push({
        time: Date.now(),
        address: peripheral.address,
        adv_data: peripheral.adv_data,
        rssi: peripheral.rssi,
      });
    };

    obniz.ble.scan.onfinish = async (peripherals, error) => {
      if (error) {
        reject(error);
        return;
      }
      console.log(
        `obniz ${obniz.id} scan finished founds=${peripherals.length}`
      );
      if (foundBeacons.length === 0) {
        // possible. but something strange.
        obniz.reboot();
        reject(new Error(`obniz ${obniz.id} no beacon found. went reboot`));
      }
      resolve(foundBeacons);
    };

    try {
      // No Device Filter
      await obniz.ble.scan.startAllWait(null, {
        duplicate: true,
        duration: seconds,
        activeScan: true,
        filterOnDevice: false,
      });
    } catch (e) {
      // scan failed. something went wrong. reboot a device.
      if (e.name !== 'ObnizOfflineError') {
        // send a reboot command;
        obniz.reboot();
      }
      reject(e);
    }
  });
}

async function reportAPI(founded) {
  // Example of Reportting API
  const response = await fetch(`http://localhost/api`, {
    method: 'post',
    body: JSON.stringify({
      founded,
    }),
    headers: { 'Content-Type': 'application/json' },
  });
  console.log(`API Response Status=${response.status}`);
  if (response.ok) {
    // res.status >= 200 && res.status < 300
    // const json = await response.json();
  } else {
    throw new Error(`Status=${response.status} to post API`);
  }
}

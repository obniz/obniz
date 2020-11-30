const Obniz = require('obniz');
const fetch = require('node-fetch');
const getSdk = require('obniz-cloud-sdk').getSdk;

const AppToken = 'apptoken_**********';

async function getAllInstalls(token) {
  const sdk = getSdk(token);
  const allInstalls = [];
  let skip = 0;
  let failCount = 0;
  while (true) {
    try {
      const result = await sdk.app({ skip });
      for (const edge of result.app.installs.edges) {
        allInstalls.push(edge.node);
      }
      if (!result.app.installs.pageInfo.hasNextPage) {
        break;
      }
      skip += result.app.installs.edges.length;
    } catch (e) {
      console.error(e);
      if (++failCount > 10) {
        throw e;
      }
      await new Promise(resolve => setTimeout(resolve, failCount * 1000));
    }
  }
  return allInstalls;
}

async function start() {
  // Load app installed obniz list
  const installedObnizes = await getAllInstalls(AppToken);
  for (const installed of installedObnizes) {
    console.log(
      `obnizID ${installed.id}(osversion=${installed.osVersion}) description=${installed.description} installConfigs=${installed.configs}`
    );
    // instantiate
    const obniz = new Obniz(installed.id, {
      access_token: installed.access_token,
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

start();

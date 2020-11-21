const Obniz = require('obniz');
const getSdk = require('obniz-cloud-sdk').getSdk;
const MQTT = require('./mqtt');
const mqtt = new MQTT({});

let mustReports = [];

const AppToken = 'apptoken_******';

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

  // start reporting.
  repeatReport();
}

async function continueScan(obniz) {
  while (obniz.connectionState === 'connected') {
    await new Promise(async (resolve, reject) => {
      // All Founded;
      obniz.ble.scan.onfind = async peripheral => {
        const ibeacon = peripheral.iBeacon;
        if (ibeacon) {
          const beacon = {
            uuid: ibeacon.uuid,
            major: ibeacon.major,
            minor: ibeacon.minor,
            rssi: peripheral.rssi,
            address: peripheral.address,
          };
          onFoundBeacon(beacon, obniz);
        }
      };

      obniz.ble.scan.onfinish = async (peripherals, error) => {
        if (error) {
          reject(error);
          return;
        }
        console.log(
          `obniz ${obniz.id} scan finished founds=${peripherals.length}`
        );
        if (peripherals.length === 0) {
          // possible. but something strange.
          obniz.reboot();
          reject(new Error(`obniz ${obniz.id} no beacon found. went reboot`));
        }
        resolve();
      };

      try {
        // No Device Filter
        await obniz.ble.scan.startAllWait(null, {
          duplicate: true,
          duration: 60,
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
}

function onFoundBeacon(beacon, obniz) {
  console.log(
    `obniz ${obniz.id} Found beacon uuid=${beacon.uuid} ${beacon.major}:${beacon.minor} RSSI=${beacon.rssi}`
  );
  let shouldAdd = true;
  for (const report of mustReports) {
    // discard duplicate
    if (
      report.uuid === beacon.uuid &&
      report.major === beacon.major &&
      report.minor === beacon.minor
    ) {
      // // 強い値で上書きが必要な場合はこのようにする
      // if (report.rssi < beacon.rssi) {
      //   // より強いものがいたらその値で上書き
      //   report.rssi = beacon.rssi;
      // }
      shouldAdd = false;
    }
  }
  if (shouldAdd) {
    beacon.obniz_id = obniz.id;
    mustReports.push(beacon);
  }
}

function repeatReport() {
  const date = new Date();
  try {
    for (const beacon of mustReports) {
      mqtt
        .publish(
          `root/mytopic`,
          `${beacon.obniz_id}-${beacon.address.toUpperCase()}-${beacon.rssi}`
        )
        .then(() => {})
        .catch(e => {
          // discard when error;
          console.error(e);
        });
    }
    mustReports = [];
  } catch (e) {
    console.error(e);
  }

  const now = new Date();
  setTimeout(() => {
    repeatReport();
  }, 30 * 1000 - (now.getTime() - date.getTime())); // every 30 seconds
}

start();

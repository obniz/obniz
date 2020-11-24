const Obniz = require('obniz');
const getSdk = require('obniz-cloud-sdk').getSdk;

const AppToken =
  'apptoken_Tmj2JMXVXgLBYW6iDlBzQph7L6uwcBYqRmW2NvnKk_kQeiwvnRCnUJePUrsTRtXW';

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
    };

    // Disconnected. 切断。
    obniz.onclose = async () => {
      console.log(`connection lost for obniz ${obniz.id}`);
    };
  }
}

start();

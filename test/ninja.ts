import Obniz from "../dist/src/obniz/index";

const log4js = require("log4js");

const logger = log4js.getLogger();
logger.level = "debug";

const obniz = new Obniz("51160603");
obniz.debugprint = true;

const targets = [
  {
    localName: "NLM00000524",
  },
  {
    localName: "NLM00000553",
  },
  {
    localName: "NLM00000521",
  },
  {
    localName: "NLM00000500",
  },
];

const _peripherals: any = [];

obniz.onconnect = async () => {
  logger.info(`connected to obniz`);

  await obniz.ble!.initWait();
  loop().then(() => {});
};

obniz.onclose = async () => {
  logger.warn(`closed from obniz`);
};

async function loop() {
  try {
    if (obniz.connectionState !== "connected") {
      return;
    }

    // ==========
    // ad系
    // ==========
    const needScan = true;
    if (needScan) {
      let peripherals: any = [];

      await new Promise(async (resolve, reject) => {
        const timeout = setTimeout(() => {
          logger.error(`onfinsh never called`);
          process.exit(1);
        }, 40 * 1000); // バグのために用意

        obniz.ble!.scan.onfinish = async (founded: any) => {
          peripherals = founded;
          clearTimeout(timeout);
          resolve();
          logger.debug(`scan finished count=${peripherals.length}`);
          if (peripherals.length === 0) {
            logger.error(`found count=0!!!`);
            process.exit(1);
          }
        };

        logger.debug(`scan start`);
        try {
          await obniz.ble!.scan.startWait(null, { duplicate: false, duration: 10 });
        } catch (e) {
          reject(e);
        }
      });

      if (_peripherals.length !== targets.length) {
        logger.info(`Missing. Current = ${_peripherals.length}`);
      }

      for (const found of peripherals) {
        let shuoldConnect = false;
        for (const t of targets) {
          if (found.localName === t.localName) {
            shuoldConnect = true;
            break;
          }
        }
        for (const p of _peripherals) {
          if (p.localName === found.localName) {
            shuoldConnect = false;
            break;
          }
        }
        if (shuoldConnect) {
          try {
            await connectFounded(found);
          } catch (e) {
            logger.error(`FAILD ${found.localName}`);
            console.error(e);
          }
        }
      }
    } // need scan
  } catch (e) {
    logger.error(e);
  }
  setTimeout(loop, 10);
}

async function connectFounded(peripheral: any) {
  logger.debug(`connect ${peripheral.localName}`);
  peripheral.ondisconnect = (reason: any) => {
    logger.log(`disconnected reason ${reason}`);
    for (let i = 0; i < _peripherals.length; i++) {
      if (_peripherals[i] === peripheral) {
        _peripherals.splice(i, 1);
        break;
      }
    }
  };
  await peripheral.connectWait();
  _peripherals.push(peripheral);
  logger.info(`connected ${peripheral.localName}`);
}

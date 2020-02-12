
/* tslint:disable:class-name max-classes-per-file */

import Obniz from "../../../dist/src/obniz/index";

const OBNIZ_ID = "1234-5678";

/**
 * https://obniz.io/ja/sdk/parts/GP2Y0A21YK0F/README.md
 */
class GP2Y0A21YK0FTest {
  public start() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const sensor = obniz.wired("GP2Y0A21YK0F", { vcc: 0, gnd: 1, signal: 2 });
      sensor.start((distance) => {
        console.log("distance " + distance + " mm");
      });
    };
  }

  public getWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const sensor = obniz.wired("GP2Y0A21YK0F", { vcc: 0, gnd: 1, signal: 2 });

      while (1) {
        const val = await sensor.getWait();
        console.log("distance " + val);
        await obniz.wait(1000);
      }
    };
  }
  public unit() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const sensor = obniz.wired("GP2Y0A21YK0F", { vcc: 0, gnd: 1, signal: 2 });
      sensor.unit("inch");
      sensor.start((distance) => {
        console.log("distance " + distance + " inch");
      });
    };
  }
}

/**
 * https://obniz.io/ja/sdk/parts/HC-SR04/README.md
 */
class HC_SR04Test {
  public measure() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const hcsr04 = obniz.wired("HC-SR04", { gnd: 0, echo: 1, trigger: 2, vcc: 3 });
      hcsr04.measure((distance) => {
        console.log("distance " + distance + " mm");
      });
    };
  }

  public measureWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const hcsr04 = obniz.wired("HC-SR04", { gnd: 0, echo: 1, trigger: 2, vcc: 3 });
      while (true) {
        let avg = 0;
        let count = 0;
        for (let i = 0; i < 3; i++) {
          // measure three time. and calculate average
          const val = await hcsr04.measureWait();
          if (val) {
            count++;
            avg += val;
          }
        }
        if (count > 1) {
          avg /= count;
        }
        console.log(avg);
        await obniz.wait(100);
      }
    };
  }

  public temp() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const hcsr04 = obniz.wired("HC-SR04", { gnd: 0, echo: 1, trigger: 2, vcc: 3 });
      hcsr04.temp = 36;
      const distance = await hcsr04.measureWait();
      console.log("distance " + distance + " mm");
    };
  }

  public reset_alltime() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const hcsr04 = obniz.wired("HC-SR04", { gnd: 0, echo: 1, trigger: 2, vcc: 3 });
      hcsr04.reset_alltime = true;
      const distance = await hcsr04.measureWait();
      console.log("distance " + distance + " mm");
    };
  }

  public unit() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const hcsr04 = obniz.wired("HC-SR04", { gnd: 0, echo: 1, trigger: 2, vcc: 3 });
      hcsr04.unit("inch");
      hcsr04.measure((distance) => {
        console.log("distance " + distance + " inch");
      });
    };
  }
}

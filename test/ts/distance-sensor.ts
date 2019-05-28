import * as Obniz from '../../obniz';

const OBNIZ_ID = '1234-5678';

/**
 * https://obniz.io/ja/sdk/parts/GP2Y0A21YK0F/README.md
 */
class GP2Y0A21YK0FTest {
  start() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var sensor = obniz.wired('GP2Y0A21YK0F', { vcc: 0, gnd: 1, signal: 2 });
      sensor.start(function(distance) {
        console.log('distance ' + distance + ' mm');
      });
    };
  }

  getWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var sensor = obniz.wired('GP2Y0A21YK0F', { vcc: 0, gnd: 1, signal: 2 });

      while (1) {
        var val = await sensor.getWait();
        console.log('distance ' + val);
        await obniz.wait(1000);
      }
    };
  }
  unit() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var sensor = obniz.wired('GP2Y0A21YK0F', { vcc: 0, gnd: 1, signal: 2 });
      sensor.unit('inch');
      sensor.start(function(distance) {
        console.log('distance ' + distance + ' inch');
      });
    };
  }
}

/**
 * https://obniz.io/ja/sdk/parts/HC-SR04/README.md
 */
class HC_SR04Test {
  measure() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var hcsr04 = obniz.wired('HC-SR04', { gnd: 0, echo: 1, trigger: 2, vcc: 3 });
      hcsr04.measure(function(distance) {
        console.log('distance ' + distance + ' mm');
      });
    };
  }

  measureWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const hcsr04 = obniz.wired('HC-SR04', { gnd: 0, echo: 1, trigger: 2, vcc: 3 });
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

  temp() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var hcsr04 = obniz.wired('HC-SR04', { gnd: 0, echo: 1, trigger: 2, vcc: 3 });
      hcsr04.temp = 36;
      var distance = await hcsr04.measureWait();
      console.log('distance ' + distance + ' mm');
    };
  }

  reset_alltime() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var hcsr04 = obniz.wired('HC-SR04', { gnd: 0, echo: 1, trigger: 2, vcc: 3 });
      hcsr04.reset_alltime = true;
      var distance = await hcsr04.measureWait();
      console.log('distance ' + distance + ' mm');
    };
  }

  unit() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var hcsr04 = obniz.wired('HC-SR04', { gnd: 0, echo: 1, trigger: 2, vcc: 3 });
      hcsr04.unit('inch');
      hcsr04.measure(function(distance) {
        console.log('distance ' + distance + ' inch');
      });
    };
  }
}

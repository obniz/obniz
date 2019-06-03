import * as Obniz from '../../obniz';

const OBNIZ_ID = '1234-5678';

/**
 * https://obniz.io/ja/sdk/parts/MQ2/README.md
 */
class MQ2Test {
  startHeating() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var mq2 = obniz.wired('MQ2', { vcc: 3, gnd: 2, do: 1, ao: 0 });
      mq2.startHeating();
    };
  }

  heatWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var mq2 = obniz.wired('MQ2', { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq2.heatWait();
      mq2.onchangeanalog = function(voltage) {
        console.log(voltage);
      };
    };
  }

  onchangeanalog() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var mq2 = obniz.wired('MQ2', { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq2.heatWait();
      mq2.onchangeanalog = function(voltage) {
        console.log(voltage);
      };
    };
  }

  onexceedvoltage() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var mq2 = obniz.wired('MQ2', { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq2.heatWait();
      mq2.voltageLimit = 1.0;
      mq2.onexceedvoltage = function(voltage) {
        console.log(voltage);
      };
    };
  }

  voltageLimit() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var mq2 = obniz.wired('MQ2', { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq2.heatWait();
      mq2.voltageLimit = 1.0;
      mq2.onexceedvoltage = function(voltage) {
        console.log(voltage);
      };
    };
  }

  onchangedigital() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var mq2 = obniz.wired('MQ2', { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq2.heatWait();
      mq2.onchangedigital = function(value) {
        console.log(value);
      };
    };
  }
}

/**
 * https://obniz.io/ja/sdk/parts/MQ3/README.md
 */
class MQ3Test {
  startHeating() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var mq3 = obniz.wired('MQ3', { vcc: 3, gnd: 2, do: 1, ao: 0 });
      mq3.startHeating();
    };
  }

  heatWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var mq3 = obniz.wired('MQ3', { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq3.heatWait();
      mq3.onchangeanalog = function(voltage) {
        console.log(voltage);
      };
    };
  }

  onchangeanalog() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var mq3 = obniz.wired('MQ3', { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq3.heatWait();
      mq3.onchangeanalog = function(voltage) {
        console.log(voltage);
      };
    };
  }

  onexceedvoltage() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var mq3 = obniz.wired('MQ3', { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq3.heatWait();
      mq3.voltageLimit = 1.0;
      mq3.onexceedvoltage = function(voltage) {
        console.log(voltage);
      };
    };
  }

  voltageLimit() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var mq3 = obniz.wired('MQ3', { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq3.heatWait();
      mq3.voltageLimit = 1.0;
      mq3.onexceedvoltage = function(voltage) {
        console.log(voltage);
      };
    };
  }

  onchangedigital() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var mq3 = obniz.wired('MQ3', { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq3.heatWait();
      mq3.onchangedigital = function(value) {
        console.log(value);
      };
    };
  }
}

/**
 * https://obniz.io/ja/sdk/parts/MQ4/README.md
 */
class MQ4Test {
  startHeating() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var mq4 = obniz.wired('MQ4', { vcc: 3, gnd: 2, do: 1, ao: 0 });
      mq4.startHeating();
    };
  }

  heatWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var mq4 = obniz.wired('MQ4', { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq4.heatWait();
      mq4.onchangeanalog = function(voltage) {
        console.log(voltage);
      };
    };
  }

  onchangeanalog() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var mq4 = obniz.wired('MQ4', { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq4.heatWait();
      mq4.onchangeanalog = function(voltage) {
        console.log(voltage);
      };
    };
  }

  onexceedvoltage() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var mq4 = obniz.wired('MQ4', { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq4.heatWait();
      mq4.voltageLimit = 1.0;
      mq4.onexceedvoltage = function(voltage) {
        console.log(voltage);
      };
    };
  }

  voltageLimit() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var mq4 = obniz.wired('MQ4', { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq4.heatWait();
      mq4.voltageLimit = 1.0;
      mq4.onexceedvoltage = function(voltage) {
        console.log(voltage);
      };
    };
  }

  onchangedigital() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var mq4 = obniz.wired('MQ4', { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq4.heatWait();
      mq4.onchangedigital = function(value) {
        console.log(value);
      };
    };
  }
}

/**
 * https://obniz.io/ja/sdk/parts/MQ5/README.md
 */
class MQ5Test {
  startHeating() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var mq5 = obniz.wired('MQ5', { vcc: 3, gnd: 2, do: 1, ao: 0 });
      mq5.startHeating();
    };
  }

  heatWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var mq5 = obniz.wired('MQ5', { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq5.heatWait();
      mq5.onchangeanalog = function(voltage) {
        console.log(voltage);
      };
    };
  }

  onchangeanalog() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var mq5 = obniz.wired('MQ5', { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq5.heatWait();
      mq5.onchangeanalog = function(voltage) {
        console.log(voltage);
      };
    };
  }

  onexceedvoltage() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var mq5 = obniz.wired('MQ5', { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq5.heatWait();
      mq5.voltageLimit = 1.0;
      mq5.onexceedvoltage = function(voltage) {
        console.log(voltage);
      };
    };
  }

  voltageLimit() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var mq5 = obniz.wired('MQ5', { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq5.heatWait();
      mq5.voltageLimit = 1.0;
      mq5.onexceedvoltage = function(voltage) {
        console.log(voltage);
      };
    };
  }

  onchangedigital() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var mq5 = obniz.wired('MQ5', { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq5.heatWait();
      mq5.onchangedigital = function(value) {
        console.log(value);
      };
    };
  }
}

/**
 * https://obniz.io/ja/sdk/parts/MQ6/README.md
 */
class MQ6Test {
  startHeating() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var mq6 = obniz.wired('MQ6', { vcc: 3, gnd: 2, do: 1, ao: 0 });
      mq6.startHeating();
    };
  }

  heatWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var mq6 = obniz.wired('MQ6', { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq6.heatWait();
      mq6.onchangeanalog = function(voltage) {
        console.log(voltage);
      };
    };
  }

  onchangeanalog() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var mq6 = obniz.wired('MQ6', { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq6.heatWait();
      mq6.onchangeanalog = function(voltage) {
        console.log(voltage);
      };
    };
  }

  onexceedvoltage() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var mq6 = obniz.wired('MQ6', { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq6.heatWait();
      mq6.voltageLimit = 1.0;
      mq6.onexceedvoltage = function(voltage) {
        console.log(voltage);
      };
    };
  }

  voltageLimit() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var mq6 = obniz.wired('MQ6', { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq6.heatWait();
      mq6.voltageLimit = 1.0;
      mq6.onexceedvoltage = function(voltage) {
        console.log(voltage);
      };
    };
  }

  onchangedigital() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var mq6 = obniz.wired('MQ6', { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq6.heatWait();
      mq6.onchangedigital = function(value) {
        console.log(value);
      };
    };
  }
}

/**
 * https://obniz.io/ja/sdk/parts/MQ7/README.md
 */
class MQ7Test {
  startHeating() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var mq7 = obniz.wired('MQ7', { vcc: 3, gnd: 2, do: 1, ao: 0 });
      mq7.startHeating();
    };
  }

  heatWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var mq7 = obniz.wired('MQ7', { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq7.heatWait();
      mq7.onchangeanalog = function(voltage) {
        console.log(voltage);
      };
    };
  }

  onchangeanalog() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var mq7 = obniz.wired('MQ7', { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq7.heatWait();
      mq7.onchangeanalog = function(voltage) {
        console.log(voltage);
      };
    };
  }

  onexceedvoltage() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var mq7 = obniz.wired('MQ7', { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq7.heatWait();
      mq7.voltageLimit = 1.0;
      mq7.onexceedvoltage = function(voltage) {
        console.log(voltage);
      };
    };
  }

  voltageLimit() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var mq7 = obniz.wired('MQ7', { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq7.heatWait();
      mq7.voltageLimit = 1.0;
      mq7.onexceedvoltage = function(voltage) {
        console.log(voltage);
      };
    };
  }

  onchangedigital() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var mq7 = obniz.wired('MQ7', { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq7.heatWait();
      mq7.onchangedigital = function(value) {
        console.log(value);
      };
    };
  }
}

/**
 * https://obniz.io/ja/sdk/parts/MQ8/README.md
 */
class MQ8Test {
  startHeating() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var mq8 = obniz.wired('MQ8', { vcc: 3, gnd: 2, do: 1, ao: 0 });
      mq8.startHeating();
    };
  }

  heatWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var mq8 = obniz.wired('MQ8', { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq8.heatWait();
      mq8.onchangeanalog = function(voltage) {
        console.log(voltage);
      };
    };
  }

  onchangeanalog() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var mq8 = obniz.wired('MQ8', { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq8.heatWait();
      mq8.onchangeanalog = function(voltage) {
        console.log(voltage);
      };
    };
  }

  onexceedvoltage() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var mq8 = obniz.wired('MQ8', { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq8.heatWait();
      mq8.voltageLimit = 1.0;
      mq8.onexceedvoltage = function(voltage) {
        console.log(voltage);
      };
    };
  }

  voltageLimit() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var mq8 = obniz.wired('MQ8', { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq8.heatWait();
      mq8.voltageLimit = 1.0;
      mq8.onexceedvoltage = function(voltage) {
        console.log(voltage);
      };
    };
  }

  onchangedigital() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var mq8 = obniz.wired('MQ8', { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq8.heatWait();
      mq8.onchangedigital = function(value) {
        console.log(value);
      };
    };
  }
}

/**
 * https://obniz.io/ja/sdk/parts/MQ9/README.md
 */
class MQ9Test {
  startHeating() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var mq9 = obniz.wired('MQ9', { vcc: 3, gnd: 2, do: 1, ao: 0 });
      mq9.startHeating();
    };
  }

  heatWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var mq9 = obniz.wired('MQ9', { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq9.heatWait();
      mq9.onchangeanalog = function(voltage) {
        console.log(voltage);
      };
    };
  }

  onchangeanalog() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var mq9 = obniz.wired('MQ9', { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq9.heatWait();
      mq9.onchangeanalog = function(voltage) {
        console.log(voltage);
      };
    };
  }

  onexceedvoltage() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var mq9 = obniz.wired('MQ9', { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq9.heatWait();
      mq9.voltageLimit = 1.0;
      mq9.onexceedvoltage = function(voltage) {
        console.log(voltage);
      };
    };
  }

  voltageLimit() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var mq9 = obniz.wired('MQ9', { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq9.heatWait();
      mq9.voltageLimit = 1.0;
      mq9.onexceedvoltage = function(voltage) {
        console.log(voltage);
      };
    };
  }

  onchangedigital() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var mq9 = obniz.wired('MQ9', { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq9.heatWait();
      mq9.onchangedigital = function(value) {
        console.log(value);
      };
    };
  }
}

/**
 * https://obniz.io/ja/sdk/parts/MQ135/README.md
 */
class MQ1Test35 {
  startHeating() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var mq135 = obniz.wired('MQ135', { vcc: 3, gnd: 2, do: 1, ao: 0 });
      mq135.startHeating();
    };
  }

  heatWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var mq135 = obniz.wired('MQ135', { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq135.heatWait();
      mq135.onchangeanalog = function(voltage) {
        console.log(voltage);
      };
    };
  }

  onchangeanalog() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var mq135 = obniz.wired('MQ135', { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq135.heatWait();
      mq135.onchangeanalog = function(voltage) {
        console.log(voltage);
      };
    };
  }

  onexceedvoltage() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var mq135 = obniz.wired('MQ135', { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq135.heatWait();
      mq135.voltageLimit = 1.0;
      mq135.onexceedvoltage = function(voltage) {
        console.log(voltage);
      };
    };
  }

  voltageLimit() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var mq135 = obniz.wired('MQ135', { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq135.heatWait();
      mq135.voltageLimit = 1.0;
      mq135.onexceedvoltage = function(voltage) {
        console.log(voltage);
      };
    };
  }

  onchangedigital() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      var mq135 = obniz.wired('MQ135', { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq135.heatWait();
      mq135.onchangedigital = function(value) {
        console.log(value);
      };
    };
  }
}

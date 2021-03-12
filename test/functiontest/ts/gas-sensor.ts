/* tslint:disable:class-name max-classes-per-file */
import Obniz from "../../../dist/src/obniz/index";

const OBNIZ_ID = "1234-5678";

/**
 * https://obniz.io/ja/sdk/parts/MQ2/README.md
 */
class MQ2Test {
  public startHeating() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const mq2 = obniz.wired("MQ2", { vcc: 3, gnd: 2, do: 1, ao: 0 });
      mq2.startHeating();
    };
  }

  public heatWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const mq2 = obniz.wired("MQ2", { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq2.heatWait();
      mq2.onchangeanalog = (voltage) => {
        console.log(voltage);
      };
    };
  }

  public onchangeanalog() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const mq2 = obniz.wired("MQ2", { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq2.heatWait();
      mq2.onchangeanalog = (voltage) => {
        console.log(voltage);
      };
    };
  }

  public onexceedvoltage() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const mq2 = obniz.wired("MQ2", { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq2.heatWait();
      mq2.voltageLimit = 1.0;
      mq2.onexceedvoltage = (voltage) => {
        console.log(voltage);
      };
    };
  }

  public voltageLimit() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const mq2 = obniz.wired("MQ2", { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq2.heatWait();
      mq2.voltageLimit = 1.0;
      mq2.onexceedvoltage = (voltage) => {
        console.log(voltage);
      };
    };
  }

  public onchangedigital() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const mq2 = obniz.wired("MQ2", { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq2.heatWait();
      mq2.onchangedigital = (value) => {
        console.log(value);
      };
    };
  }
}

/**
 * https://obniz.io/ja/sdk/parts/MQ3/README.md
 */
class MQ3Test {
  public startHeating() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const mq3 = obniz.wired("MQ3", { vcc: 3, gnd: 2, do: 1, ao: 0 });
      mq3.startHeating();
    };
  }

  public heatWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const mq3 = obniz.wired("MQ3", { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq3.heatWait();
      mq3.onchangeanalog = (voltage) => {
        console.log(voltage);
      };
    };
  }

  public onchangeanalog() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const mq3 = obniz.wired("MQ3", { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq3.heatWait();
      mq3.onchangeanalog = (voltage) => {
        console.log(voltage);
      };
    };
  }

  public onexceedvoltage() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const mq3 = obniz.wired("MQ3", { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq3.heatWait();
      mq3.voltageLimit = 1.0;
      mq3.onexceedvoltage = (voltage) => {
        console.log(voltage);
      };
    };
  }

  public voltageLimit() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const mq3 = obniz.wired("MQ3", { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq3.heatWait();
      mq3.voltageLimit = 1.0;
      mq3.onexceedvoltage = (voltage) => {
        console.log(voltage);
      };
    };
  }

  public onchangedigital() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const mq3 = obniz.wired("MQ3", { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq3.heatWait();
      mq3.onchangedigital = (value) => {
        console.log(value);
      };
    };
  }
}

/**
 * https://obniz.io/ja/sdk/parts/MQ4/README.md
 */
class MQ4Test {
  public startHeating() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const mq4 = obniz.wired("MQ4", { vcc: 3, gnd: 2, do: 1, ao: 0 });
      mq4.startHeating();
    };
  }

  public heatWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const mq4 = obniz.wired("MQ4", { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq4.heatWait();
      mq4.onchangeanalog = (voltage) => {
        console.log(voltage);
      };
    };
  }

  public onchangeanalog() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const mq4 = obniz.wired("MQ4", { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq4.heatWait();
      mq4.onchangeanalog = (voltage) => {
        console.log(voltage);
      };
    };
  }

  public onexceedvoltage() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const mq4 = obniz.wired("MQ4", { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq4.heatWait();
      mq4.voltageLimit = 1.0;
      mq4.onexceedvoltage = (voltage) => {
        console.log(voltage);
      };
    };
  }

  public voltageLimit() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const mq4 = obniz.wired("MQ4", { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq4.heatWait();
      mq4.voltageLimit = 1.0;
      mq4.onexceedvoltage = (voltage) => {
        console.log(voltage);
      };
    };
  }

  public onchangedigital() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const mq4 = obniz.wired("MQ4", { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq4.heatWait();
      mq4.onchangedigital = (value) => {
        console.log(value);
      };
    };
  }
}

/**
 * https://obniz.io/ja/sdk/parts/MQ5/README.md
 */
class MQ5Test {
  public startHeating() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const mq5 = obniz.wired("MQ5", { vcc: 3, gnd: 2, do: 1, ao: 0 });
      mq5.startHeating();
    };
  }

  public heatWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const mq5 = obniz.wired("MQ5", { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq5.heatWait();
      mq5.onchangeanalog = (voltage) => {
        console.log(voltage);
      };
    };
  }

  public onchangeanalog() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const mq5 = obniz.wired("MQ5", { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq5.heatWait();
      mq5.onchangeanalog = (voltage) => {
        console.log(voltage);
      };
    };
  }

  public onexceedvoltage() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const mq5 = obniz.wired("MQ5", { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq5.heatWait();
      mq5.voltageLimit = 1.0;
      mq5.onexceedvoltage = (voltage) => {
        console.log(voltage);
      };
    };
  }

  public voltageLimit() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const mq5 = obniz.wired("MQ5", { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq5.heatWait();
      mq5.voltageLimit = 1.0;
      mq5.onexceedvoltage = (voltage) => {
        console.log(voltage);
      };
    };
  }

  public onchangedigital() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const mq5 = obniz.wired("MQ5", { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq5.heatWait();
      mq5.onchangedigital = (value) => {
        console.log(value);
      };
    };
  }
}

/**
 * https://obniz.io/ja/sdk/parts/MQ6/README.md
 */
class MQ6Test {
  public startHeating() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const mq6 = obniz.wired("MQ6", { vcc: 3, gnd: 2, do: 1, ao: 0 });
      mq6.startHeating();
    };
  }

  public heatWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const mq6 = obniz.wired("MQ6", { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq6.heatWait();
      mq6.onchangeanalog = (voltage) => {
        console.log(voltage);
      };
    };
  }

  public onchangeanalog() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const mq6 = obniz.wired("MQ6", { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq6.heatWait();
      mq6.onchangeanalog = (voltage) => {
        console.log(voltage);
      };
    };
  }

  public onexceedvoltage() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const mq6 = obniz.wired("MQ6", { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq6.heatWait();
      mq6.voltageLimit = 1.0;
      mq6.onexceedvoltage = (voltage) => {
        console.log(voltage);
      };
    };
  }

  public voltageLimit() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const mq6 = obniz.wired("MQ6", { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq6.heatWait();
      mq6.voltageLimit = 1.0;
      mq6.onexceedvoltage = (voltage) => {
        console.log(voltage);
      };
    };
  }

  public onchangedigital() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const mq6 = obniz.wired("MQ6", { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq6.heatWait();
      mq6.onchangedigital = (value) => {
        console.log(value);
      };
    };
  }
}

/**
 * https://obniz.io/ja/sdk/parts/MQ7/README.md
 */
class MQ7Test {
  public startHeating() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const mq7 = obniz.wired("MQ7", { vcc: 3, gnd: 2, do: 1, ao: 0 });
      mq7.startHeating();
    };
  }

  public heatWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const mq7 = obniz.wired("MQ7", { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq7.heatWait();
      mq7.onchangeanalog = (voltage) => {
        console.log(voltage);
      };
    };
  }

  public onchangeanalog() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const mq7 = obniz.wired("MQ7", { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq7.heatWait();
      mq7.onchangeanalog = (voltage) => {
        console.log(voltage);
      };
    };
  }

  public onexceedvoltage() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const mq7 = obniz.wired("MQ7", { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq7.heatWait();
      mq7.voltageLimit = 1.0;
      mq7.onexceedvoltage = (voltage) => {
        console.log(voltage);
      };
    };
  }

  public voltageLimit() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const mq7 = obniz.wired("MQ7", { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq7.heatWait();
      mq7.voltageLimit = 1.0;
      mq7.onexceedvoltage = (voltage) => {
        console.log(voltage);
      };
    };
  }

  public onchangedigital() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const mq7 = obniz.wired("MQ7", { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq7.heatWait();
      mq7.onchangedigital = (value) => {
        console.log(value);
      };
    };
  }
}

/**
 * https://obniz.io/ja/sdk/parts/MQ8/README.md
 */
class MQ8Test {
  public startHeating() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const mq8 = obniz.wired("MQ8", { vcc: 3, gnd: 2, do: 1, ao: 0 });
      mq8.startHeating();
    };
  }

  public heatWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const mq8 = obniz.wired("MQ8", { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq8.heatWait();
      mq8.onchangeanalog = (voltage) => {
        console.log(voltage);
      };
    };
  }

  public onchangeanalog() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const mq8 = obniz.wired("MQ8", { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq8.heatWait();
      mq8.onchangeanalog = (voltage) => {
        console.log(voltage);
      };
    };
  }

  public onexceedvoltage() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const mq8 = obniz.wired("MQ8", { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq8.heatWait();
      mq8.voltageLimit = 1.0;
      mq8.onexceedvoltage = (voltage) => {
        console.log(voltage);
      };
    };
  }

  public voltageLimit() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const mq8 = obniz.wired("MQ8", { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq8.heatWait();
      mq8.voltageLimit = 1.0;
      mq8.onexceedvoltage = (voltage) => {
        console.log(voltage);
      };
    };
  }

  public onchangedigital() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const mq8 = obniz.wired("MQ8", { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq8.heatWait();
      mq8.onchangedigital = (value) => {
        console.log(value);
      };
    };
  }
}

/**
 * https://obniz.io/ja/sdk/parts/MQ9/README.md
 */
class MQ9Test {
  public startHeating() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const mq9 = obniz.wired("MQ9", { vcc: 3, gnd: 2, do: 1, ao: 0 });
      mq9.startHeating();
    };
  }

  public heatWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const mq9 = obniz.wired("MQ9", { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq9.heatWait();
      mq9.onchangeanalog = (voltage) => {
        console.log(voltage);
      };
    };
  }

  public onchangeanalog() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const mq9 = obniz.wired("MQ9", { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq9.heatWait();
      mq9.onchangeanalog = (voltage) => {
        console.log(voltage);
      };
    };
  }

  public onexceedvoltage() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const mq9 = obniz.wired("MQ9", { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq9.heatWait();
      mq9.voltageLimit = 1.0;
      mq9.onexceedvoltage = (voltage) => {
        console.log(voltage);
      };
    };
  }

  public voltageLimit() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const mq9 = obniz.wired("MQ9", { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq9.heatWait();
      mq9.voltageLimit = 1.0;
      mq9.onexceedvoltage = (voltage) => {
        console.log(voltage);
      };
    };
  }

  public onchangedigital() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const mq9 = obniz.wired("MQ9", { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq9.heatWait();
      mq9.onchangedigital = (value) => {
        console.log(value);
      };
    };
  }
}

/**
 * https://obniz.io/ja/sdk/parts/MQ135/README.md
 */
class MQ1Test35 {
  public startHeating() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const mq135 = obniz.wired("MQ135", { vcc: 3, gnd: 2, do: 1, ao: 0 });
      mq135.startHeating();
    };
  }

  public heatWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const mq135 = obniz.wired("MQ135", { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq135.heatWait();
      mq135.onchangeanalog = (voltage) => {
        console.log(voltage);
      };
    };
  }

  public onchangeanalog() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const mq135 = obniz.wired("MQ135", { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq135.heatWait();
      mq135.onchangeanalog = (voltage) => {
        console.log(voltage);
      };
    };
  }

  public onexceedvoltage() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const mq135 = obniz.wired("MQ135", { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq135.heatWait();
      mq135.voltageLimit = 1.0;
      mq135.onexceedvoltage = (voltage) => {
        console.log(voltage);
      };
    };
  }

  public voltageLimit() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const mq135 = obniz.wired("MQ135", { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq135.heatWait();
      mq135.voltageLimit = 1.0;
      mq135.onexceedvoltage = (voltage) => {
        console.log(voltage);
      };
    };
  }

  public onchangedigital() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const mq135 = obniz.wired("MQ135", { vcc: 3, gnd: 2, do: 1, ao: 0 });
      await mq135.heatWait();
      mq135.onchangedigital = (value) => {
        console.log(value);
      };
    };
  }
}


/* tslint:disable:class-name max-classes-per-file */
import Obniz  = require( "../../../dist/src/obniz/index");

const OBNIZ_ID = "1234-5678";

/**
 * https://obniz.io/ja/sdk/parts/LM35DZ/README.md
 */
class LM35DZTest {
  public onchange() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const tempsens = obniz.wired("LM35DZ", { gnd: 0, output: 1, vcc: 2 });
      tempsens.onchange = (temp) => {
        console.log(temp);
      };
    };
  }

  public getWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const tempsens = obniz.wired("LM35DZ", { gnd: 0, output: 1, vcc: 2 });
      const temp = await tempsens.getWait();
      console.log(temp);
    };
  }
}

/**
 * https://obniz.io/ja/sdk/parts/LM60/README.md
 */
class LM60Test {
  public onchange() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const tempsens = obniz.wired("LM60", { gnd: 0, output: 1, vcc: 2 });
      tempsens.onchange = (temp) => {
        console.log(temp);
      };
    };
  }

  public getWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const tempsens = obniz.wired("LM60", { gnd: 0, output: 1, vcc: 2 });
      const temp = await tempsens.getWait();
      console.log(temp);
    };
  }
}

/**
 * https://obniz.io/ja/sdk/parts/LM61/README.md
 */
class LM61Test {
  public onchange() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const tempsens = obniz.wired("LM61", { gnd: 0, output: 1, vcc: 2 });
      tempsens.onchange = (temp) => {
        console.log(temp);
      };
    };
  }

  public getWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const tempsens = obniz.wired("LM61", { gnd: 0, output: 1, vcc: 2 });
      const temp = await tempsens.getWait();
      console.log(temp);
    };
  }
}

/**
 * https://obniz.io/ja/sdk/parts/LMT87/README.md
 */
class LMT87Test {
  public onchange() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const tempsens = obniz.wired("LMT87", { gnd: 0, output: 1, vcc: 2 });
      tempsens.onchange = (temp) => {
        console.log(temp);
      };
    };
  }

  public getWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const tempsens = obniz.wired("LMT87", { gnd: 0, output: 1, vcc: 2 });
      const temp = await tempsens.getWait();
      console.log(temp);
    };
  }
}

/**
 * https://obniz.io/ja/sdk/parts/MCP9700/README.md
 */
class MCP9700Test {
  public onchange() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const tempsens = obniz.wired("MCP9700", { gnd: 0, output: 1, vcc: 2 });
      tempsens.onchange = (temp) => {
        console.log(temp);
      };
    };
  }

  public getWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const tempsens = obniz.wired("MCP9700", { gnd: 0, output: 1, vcc: 2 });
      const temp = await tempsens.getWait();
      console.log(temp);
    };
  }
}

/**
 * https://obniz.io/ja/sdk/parts/MCP9701/README.md
 */
class MCP9701Test {
  public onchange() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const tempsens = obniz.wired("MCP9701", { gnd: 0, output: 1, vcc: 2 });
      tempsens.onchange = (temp) => {
        console.log(temp);
      };
    };
  }

  public getWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const tempsens = obniz.wired("MCP9701", { gnd: 0, output: 1, vcc: 2 });
      const temp = await tempsens.getWait();
      console.log(temp);
    };
  }
}

class S8100BTest {}

class S8120CTest {}

class ADT7410Test {}

/**
 * https://obniz.io/ja/sdk/parts/AMG8833/README.md
 */
class AMG8833Test {
  public getAllPixWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const grideye = obniz.wired("AMG8833", { vcc: 0, gnd: 1, sda: 2, scl: 3 });
      const temps = await grideye.getAllPixWait();
      console.log("temperature:" + temps);

      const canvas = document.getElementById("canvas") as HTMLCanvasElement;
      const ctx = canvas.getContext("2d")!;
      const width = canvas.width;
      const height = canvas.height;

      for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
          const temp = temps[x * 8 + y];
          const h = -80 + (temp - 29) * 25;
          ctx.fillStyle = "hsl(" + h + ", 100%, 50%)";
          ctx.fillRect((width / 8) * x, (height / 8) * y, width / 8, height / 8);
        }
      }
    };
  }

  public getOnePixWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const grideye = obniz.wired("AMG8833", { vcc: 0, gnd: 1, sda: 2, scl: 3 });
      const temp = await grideye.getOnePixWait(10);
      console.log("temperature:" + temp);
    };
  }
}

/**
 * https://obniz.io/ja/sdk/parts/BME280/README.md
 */
class BME280Test {
  public wired() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const i2c = obniz.getFreeI2C();
      i2c.start({ mode: "master", sda: 2, scl: 3, clock: 100000 });
      const bme280 = obniz.wired("BME280", { vio: 0, gnd: 1, i2c });
    };
  }

  public applyCalibration() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const bme280 = obniz.wired("BME280", { vio: 0, vcore: 1, gnd: 2, csb: 3, sdi: 4, sck: 5, sdo: 6 });
      await bme280.applyCalibration();
    };
  }

  public setIIRStrength() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const bme280 = obniz.wired("BME280", { vio: 0, vcore: 1, gnd: 2, csb: 3, sdi: 4, sck: 5, sdo: 6 });
      await bme280.applyCalibration();
      await bme280.setIIRStrength(1); // start using minimum IIR
    };
  }

  public getAllWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const bme280 = obniz.wired("BME280", { vio: 0, vcore: 1, gnd: 2, csb: 3, sdi: 4, sck: 5, sdo: 6 });
      await bme280.applyCalibration();
      const obj = await bme280.getAllWait();
      console.log("temp: " + obj.temperature + " degree");
      console.log("humidity: " + obj.humidity + " %");
      console.log("pressure: " + obj.pressure + " hPa");
    };
  }

  public calcAltitude() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const bme280 = obniz.wired("BME280", { vio: 0, vcore: 1, gnd: 2, csb: 3, sdi: 4, sck: 5, sdo: 6 });
      await bme280.applyCalibration();
      const obj = await bme280.getAllWait();
      const airPressure = obj.pressure;
      const hight_in_m = bme280.calcAltitude(airPressure);
      console.log("altitude: " + hight_in_m + " m");
    };
  }
}

/**
 * https://obniz.io/ja/sdk/parts/D6T44L/README.md
 */
class D6T44LTest {
  public getAllPixWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const d6t = obniz.wired("D6T44L", { gnd: 0, vcc: 1, sda: 2, scl: 3 });
      const temps = await d6t.getAllPixWait();
      console.log("temperature:" + temps);

      const canvas = document.getElementById("canvas") as HTMLCanvasElement;
      const ctx = canvas.getContext("2d")!;
      const width = canvas.width;
      const height = canvas.height;

      for (let x = 0; x < 4; x++) {
        for (let y = 0; y < 4; y++) {
          const temp = temps[x * 4 + y];
          const h = -80 + (temp - 29) * 25;
          ctx.fillStyle = "hsl(" + h + ", 100%, 50%)";
          ctx.fillRect((width / 4) * x, (height / 4) * y, width / 4, height / 4);
        }
      }
    };
  }

  public getOnePixWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const d6t = obniz.wired("D6T44L", { gnd: 0, vcc: 1, sda: 2, scl: 3 });
      const temp = await d6t.getOnePixWait(10);
      console.log("temperature:" + temp);
    };
  }
}

class S_5851ATest {}

/**
 * https://obniz.io/ja/sdk/parts/SHT31/README.md
 */
class SHT31Test {
  public getTempWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const sensor = obniz.wired("SHT31", { vcc: 0, sda: 1, scl: 2, adr: 3, gnd: 4, addressmode: 5 });
      const temp = await sensor.getTempWait();
      const humd = await sensor.getHumidWait();
      console.log("temperature:" + temp);
      console.log("humidity:" + humd);
    };
  }

  public getHumdWait() {
    const obniz = new Obniz(OBNIZ_ID);
    obniz.onconnect = async () => {
      const sensor = obniz.wired("SHT31", { vcc: 0, sda: 1, scl: 2, adr: 3, gnd: 4, addressmode: 5 });
      const temp = await sensor.getTempWait();
      const humd = await sensor.getHumidWait();
      console.log("temperature:" + temp);
      console.log("humidity:" + humd);
    };
  }
}

class ADT7310Test {}

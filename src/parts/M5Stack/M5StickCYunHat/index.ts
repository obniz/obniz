import Obniz from "../../../obniz";
import PeripheralI2C from "../../../obniz/libs/io_peripherals/i2c";
import ObnizUtil from "../../../obniz/libs/utils/util";
import ObnizPartsInterface, {ObnizPartsInfo} from "../../../obniz/ObnizPartsInterface";
import {I2cPartsAbstructOptions} from "../../i2cParts";
import BMP280 from "../../PressureSensor/BMP280";
import SHT20 from "../../TemperatureSensor/i2c/SHT20";

export interface YunHatOptions extends I2cPartsAbstructOptions {
}

export default class YunHat implements ObnizPartsInterface {

  public static info(): ObnizPartsInfo {
    return {
      name: "YunHat",
    };
  }

  private static _generateHsvColor(h: number, s: number, v: number) {
    const C: number = v * s;
    const Hp: number = h / 60;
    const X: number = C * (1 - Math.abs((Hp % 2) - 1));

    let R: number = 0;
    let G: number = 0;
    let B: number = 0;
    if (0 <= Hp && Hp < 1) {
      [R, G, B] = [C, X, 0];
    }
    if (1 <= Hp && Hp < 2) {
      [R, G, B] = [X, C, 0];
    }
    if (2 <= Hp && Hp < 3) {
      [R, G, B] = [0, C, X];
    }
    if (3 <= Hp && Hp < 4) {
      [R, G, B] = [0, X, C];
    }
    if (4 <= Hp && Hp < 5) {
      [R, G, B] = [X, 0, C];
    }
    if (5 <= Hp && Hp < 6) {
      [R, G, B] = [C, 0, X];
    }

    const m: number = v - C;
    [R, G, B] = [R + m, G + m, B + m];

    R = Math.floor(R * 255);
    G = Math.floor(G * 255);
    B = Math.floor(B * 255);

    return {red: R, green: G, blue: B};
  }

  public requiredKeys: string[];
  public keys: string[];
  public params: any;

  public ioKeys: string[];

  protected obniz!: Obniz;
  protected i2c!: PeripheralI2C;
  protected sht20!: SHT20;
  protected bmp280!: BMP280;

  // ホントは14個あるが全部制御するとバグる
  private LED_LEN = 13;

  constructor() {
    this.requiredKeys = [];
    this.keys = [
      "sda",
      "scl",
      "i2c",
    ];

    this.ioKeys = ["sda", "scl"];
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;

    this.params.clock = 100 * 1000; // for i2c
    this.params.mode = "master"; // for i2c
    this.params.pull = "3v"; // for i2c
    this.i2c = obniz.getI2CWithConfig(this.params);
    this.sht20 = obniz.wired("SHT20",  {i2c: this.i2c});
    this.bmp280 = obniz.wired("BMP280",  {i2c: this.i2c});
    this.bmp280.applyCalibration();
  }

  // public setColorCode(ledNum: number, colorCode: string) {
  //   const hexConvert = (hex: string) => {
  //     if (hex.slice(0, 1) === "#") {
  //       hex = hex.slice(1);
  //     }
  //     if (hex.length === 3) {
  //       hex = hex.slice(0, 1) + hex.slice(0, 1) + hex.slice(1, 2) + hex.slice(1, 2) + hex.slice(2, 3) + hex.slice(2, 3);
  //     }
  //
  //     return [hex.slice(0, 2), hex.slice(2, 4), hex.slice(4, 6)].map((str) => {
  //       return parseInt(str, 16);
  //     });
  //   };
  //   const color: number[] = hexConvert(colorCode);
  //   this.rgb(color[0], color[1], color[2]);
  // }

  public rgb(red: number, green: number, blue: number): void {
    ObnizUtil.assertNumber(0, 255, "red", red);
    ObnizUtil.assertNumber(0, 255, "green", green);
    ObnizUtil.assertNumber(0, 255, "blue", blue);
    const leds: Array<[number, number, number]> = [];
    for (let i = 0; i < this.LED_LEN; i++) {
      leds.push([red, green, blue]);
    }
    this.rgbs(leds);
  }

  public hsv(hue: number, saturation: number, value: number) {
    ObnizUtil.assertNumber(0, 300, "hue", hue);
    ObnizUtil.assertNumber(0, 1, "saturation", saturation);
    ObnizUtil.assertNumber(0, 1, "value", value);
    const color = YunHat._generateHsvColor(hue, saturation, value);
    this.rgb(color.red, color.green, color.blue);
  }

  public rgbs(array: Array<[number, number, number]>) {
    if (array.length <= this.LED_LEN ) {
      array.forEach((value, index) => {
        this.i2c.write(0x38, [0x01, index, Math.floor(value[0]), Math.floor(value[1]), Math.floor(value[2])]);
      });
    }
}

  public hsvs(array: Array<[number, number, number]>) {
    const leds: Array<[number, number, number]> = array.map((value, index) => {
      const color = YunHat._generateHsvColor(value[0], value[1], value[2]);
      return [color.red, color.green, color.blue];
    });
    this.rgbs(leds);
  }

  public async getLightWait(): Promise<number> {
    this.i2c.write(0x38, [0x00]);
    const d = await this.i2c.readWait(0x38, 2);
    return d[1] << 8 | d[0];
  }

  public async getTempWait(): Promise<number> {
    return await this.sht20.getTempWait();
  }

  public async getHumidWait(): Promise<number> {
    return await this.sht20.getHumidWait();
  }

  public async getPressureWait(): Promise<number> {
    return await this.bmp280.getPressureWait();
  }
}

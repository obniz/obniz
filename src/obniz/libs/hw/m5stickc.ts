/**
 * @packageDocumentation
 * @module ObnizCore.Hardware
 */

import ObnizDevice from "../../ObnizDevice";

import InfraredLED from "../../../parts/Infrared/InfraredLED";
import LED from "../../../parts/Light/LED";
import Button from "../../../parts/MovementSensor/Button";

import I2C from "../../../obniz/libs/io_peripherals/i2c";
import PeripheralI2C from "../../../obniz/libs/io_peripherals/i2c";
import IO from "../../../obniz/libs/io_peripherals/io";
import MPU6886 from "../../../parts/MovementSensor/MPU6886";
import SH200Q from "../../../parts/MovementSensor/SH200Q";
import AXP192 from "../../../parts/Power/AXP192";
import ObnizBLE from "../embeds/ble/ble";
import ObnizBLEHci from "../embeds/bleHci/ble";
import Display from "../embeds/display";
import PeripheralAD from "../io_peripherals/ad";
import PeripheralPWM from "../io_peripherals/pwm";
import PeripheralSPI from "../io_peripherals/spi";
import PeripheralUART from "../io_peripherals/uart";
import LogicAnalyzer from "../measurements/logicanalyzer";
import ObnizMeasure from "../measurements/measure";

export class M5StickC extends ObnizDevice {
  /**
   * @category Embeds
   */
  public buttonA!: Button;

  /**
   * @category Embeds
   */
  public buttonB!: Button;

  /**
   * @category Embeds
   */
  public ir!: InfraredLED;

  /**
   * @category Embeds
   */
  public imu?: MPU6886 | SH200Q;

  /**
   * @category Embeds
   */
  public axp!: AXP192;

  /**
   * @category Embeds
   */
  public led!: LED;

  /**
   * @ignore
   */
  public io1!: never;

  /**
   * @ignore
   */
  public io2!: never;
  /**
   * @ignore
   */
  public io3!: never;

  /**
   * @ignore
   */
  public io4!: never;

  /**
   * @ignore
   */
  public io5!: never;

  /**
   * @ignore
   */
  public io6!: never;

  /**
   * @ignore
   */
  public io7!: never;

  /**
   * @ignore
   */
  public io8!: never;

  /**
   * @ignore
   */
  public io9!: never;

  /**
   * @ignore
   */
  public io10!: never;

  /**
   * @ignore
   */
  public io11!: never;

  /**
   * @category Peripherals
   */
  public io26!: IO;

  /**
   * @category Peripherals
   */
  public io32!: IO;

  /**
   * @category Peripherals
   */
  public io33!: IO;

  /**
   * @category Peripherals
   */
  public io34!: IO;

  /**
   * @category Peripherals
   */
  public io36!: IO;

  /**
   * @ignore
   */
  public ad0!: never;

  /**
   * @ignore
   */
  public ad1!: never;
  /**
   * @ignore
   */
  public ad2!: never;

  /**
   * @ignore
   */
  public ad3!: never;

  /**
   * @ignore
   */
  public ad4!: never;

  /**
   * @ignore
   */
  public ad5!: never;

  /**
   * @ignore
   */
  public ad6!: never;

  /**
   * @ignore
   */
  public ad7!: never;

  /**
   * @ignore
   */
  public ad8!: never;

  /**
   * @ignore
   */
  public ad9!: never;

  /**
   * @ignore
   */
  public ad10!: never;

  /**
   * @ignore
   */
  public ad11!: never;

  /**
   * @category Peripherals
   */
  public ad32!: PeripheralAD;

  /**
   * @category Peripherals
   */
  public ad33!: PeripheralAD;

  /**
   * @category Peripherals
   */
  public ad34!: PeripheralAD;

  /**
   * @category Peripherals
   */
  public ad35!: PeripheralAD;

  /**
   * @category Peripherals
   */
  public ad36!: PeripheralAD;

  /**
   * @category Peripherals
   */
  public pwm0!: PeripheralPWM;

  /**
   * @category Peripherals
   */
  public pwm1!: PeripheralPWM;

  /**
   * @category Peripherals
   */
  public pwm2!: PeripheralPWM;

  /**
   * @category Peripherals
   */
  public pwm3!: PeripheralPWM;

  /**
   * @category Peripherals
   */
  public pwm4!: PeripheralPWM;

  /**
   * @category Peripherals
   */
  public pwm5!: PeripheralPWM;

  /**
   * @category Peripherals
   */
  public uart0!: PeripheralUART;

  /**
   * @category Peripherals
   */
  public uart1!: PeripheralUART;

  /**
   *
   *
   * @category Peripherals
   */
  public spi0!: PeripheralSPI;

  /**
   * @category Peripherals
   */
  public spi1!: PeripheralSPI;

  /**
   * @category Peripherals
   */
  public i2c0!: PeripheralI2C;

  /**
   * This is used by system. Please use i2c0.
   * @category Peripherals
   */
  public i2c1!: PeripheralI2C;

  /**
   * @category Measurement
   */
  public logicAnalyzer!: LogicAnalyzer;

  /**
   * @category Measurement
   */
  public measure!: ObnizMeasure;

  /**
   * @category Embeds
   */
  public display!: Display;

  /**
   * @ignore
   */
  public switch!: never;

  /**
   * If obnizOS ver >= 3.0.0, automatically load [[ObnizCore.Components.Ble.Hci.ObnizBLE|ObnizHciBLE]],
   * and obnizOS ver < 3.0.0 load [[ObnizCore.Components.Ble.old.ObnizBLE|ObnizOldBLE]],
   * @category Embeds
   */
  public ble!: ObnizBLE | ObnizBLEHci;

  // protected io13!: IO; // LCD
  // protected io15?: IO; // LCD
  // protected io18!: IO; // LCD
  protected io21!: IO; // internal I2C
  protected io22!: IO; // internal I2c
  // protected io23!: IO; // LCD
  protected io27!: IO; // axp
  protected io37!: IO; // ButtonA
  protected io39!: IO; // ButtonB

  private _m5i2c!: I2C;

  constructor(id: string, options?: any) {
    super(id, options);
  }

  public gyroWait(): Promise<{ x: number; y: number; z: number }> {
    const supportedIMUNameArr = ["MPU6886", "SH200Q"];
    if (!supportedIMUNameArr.includes(this.imu!.constructor.name)) {
      throw new Error(`gyroWait is supported only on M5stickC with ${supportedIMUNameArr.join()}`);
    }
    return this.imu!.getGyroWait();
  }

  public accelerationWait(): Promise<{ x: number; y: number; z: number }> {
    const supportedIMUNameArr = ["MPU6886", "SH200Q"];
    if (!supportedIMUNameArr.includes(this.imu!.constructor.name)) {
      throw new Error(`accelerationWait is supported only on M5stickC with ${supportedIMUNameArr.join()}`);
    }
    return this.imu!.getAccelWait();
  }

  public setupIMUWait(imuName: "MPU6886" | "SH200Q" = "MPU6886"): Promise<MPU6886 | SH200Q> {
    const i2c = this._m5i2c!;
    const onerror = i2c.onerror;
    this.imu = this.wired(imuName, { i2c });

    // @ts-ignore
    this.imu._reset = () => {};
    const p1 = this.imu.whoamiWait();
    const p2 = new Promise((resolve, reject) => {
      i2c.onerror = reject;
    });
    return Promise.race([p1, p2]).then(async (val) => {
      // restore
      i2c.onerror = onerror;
      if (!val) {
        throw new Error(`Cannot find IMU (${imuName}) on this M5StickC`);
      }
      switch (imuName) {
        case "SH200Q":
          await (this.imu as SH200Q).initWait();
          break;
        case "MPU6886":
          (this.imu as MPU6886).init();
          break;
        default:
          break;
      }
      return this.imu!;
    });
  }

  protected _prepareComponents() {
    // @ts-ignore
    super._prepareComponents();

    if (this.hw !== "m5stickc") {
      this.showAlertUI("Obniz.M5StickC only support ObnizOS for M5StickC. Your device is not ObnizOS for M5StickC.");
      return;
    }

    if (this.ir) {
      // already wired parts
      return;
    }

    this.ir = this.wired("InfraredLED", { anode: 9 });
    this.led = this.wired("LED", { cathode: 10 });
    this.buttonA = this.wired("Button", { signal: 37 });
    this.buttonB = this.wired("Button", { signal: 39 });

    const i2cParams = {
      sda: 21,
      scl: 22,
      clock: 100000,
      pull: "3v",
      mode: "master",
    };

    this._m5i2c = this.i2c1;
    this._m5i2c.start(i2cParams as any);
    this.axp = this.wired("AXP192", { i2c: this._m5i2c });
    this.led!.off();
  }
}

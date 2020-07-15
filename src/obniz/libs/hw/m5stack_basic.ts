/**
 * @packageDocumentation
 * @module ObnizCore.Hardware
 */

import ObnizDevice from "../../ObnizDevice";

import Button from "../../../parts/MovementSensor/Button";

import PeripheralI2C from "../../../obniz/libs/io_peripherals/i2c";
import IO from "../../../obniz/libs/io_peripherals/io";
import ObnizBLEHci from "../embeds/bleHci/ble";
import Display from "../embeds/display";
import PeripheralAD from "../io_peripherals/ad";
import PeripheralGrove from "../io_peripherals/grove";
import PeripheralPWM from "../io_peripherals/pwm";
import PeripheralSPI from "../io_peripherals/spi";
import PeripheralUART from "../io_peripherals/uart";
import LogicAnalyzer from "../measurements/logicanalyzer";
import ObnizMeasure from "../measurements/measure";

export class M5StackBasic extends ObnizDevice {
  /**
   * Embeded Left Button on M5Stack.
   * @category Embeds
   */
  public buttonA!: Button;

  /**
   * Embeded Center Button on M5Stack.
   * @category Embeds
   */
  public buttonB!: Button;

  /**
   * Embeded Right Button on M5Stack.
   * @category Embeds
   */
  public buttonC!: Button;

  /**
   * @category Peripherals
   */
  public io0!: IO;

  /**
   * @ignore
   */
  public io1!: never;

  /**
   * @category Peripherals
   */
  public io2!: IO;

  /**
   * @ignore
   */
  public io3!: never;

  /**
   * @category Peripherals
   */
  public io4!: IO;

  /**
   * @category Peripherals
   */
  public io5!: IO;

  /**
   * @category Peripherals
   */
  public io12!: IO;

  /**
   * @category Peripherals
   */
  public io13!: IO;

  /**
   * @category Peripherals
   */
  public io15!: IO;

  /**
   * @category Peripherals
   */
  public io16!: IO;

  /**
   * @category Peripherals
   */
  public io17!: IO;

  /**
   * @category Peripherals
   */
  public io19!: IO;

  /**
   * @category Peripherals
   */
  public io21!: IO;

  /**
   * @category Peripherals
   */
  public io22!: IO;

  /**
   * @category Peripherals
   */
  public io25!: IO;

  /**
   * @category Peripherals
   */
  public io26!: IO;

  /**
   * @category Peripherals
   */
  public io34!: IO;

  /**
   * @category Peripherals
   */
  public io35!: IO;

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
   * @ignore
   */
  public ad32!: never;

  /**
   * @ignore
   */
  public ad33!: never;

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
   * @category Peripherals
   */
  public grove0!: PeripheralGrove;

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
   * and obnizOS ver < 3.0.0 throw unsupported error,
   * @category Embeds
   */
  public ble!: ObnizBLEHci;

  protected io32!: IO; // LCD
  protected io33!: IO; // LCD
  protected io27!: IO; // LCD
  protected io14!: IO; // LCD
  protected io18!: IO; // LCD
  protected io23!: IO; // LCD
  protected io37!: IO; // ButtonA
  protected io38!: IO; // ButtonB
  protected io39!: IO; // ButtonC

  constructor(id: string, options?: any) {
    super(id, options);
  }

  protected async _beforeOnConnect() {
    super._beforeOnConnect();

    this.buttonA = this.wired("Button", { signal: 39 });
    this.buttonB = this.wired("Button", { signal: 38 });
    this.buttonC = this.wired("Button", { signal: 37 });
  }

  protected _prepareComponents() {
    // @ts-ignore
    super._prepareComponents();

    if (this.hw !== "m5stack_basic") {
      throw new Error(
        "Obniz.M5StackBasic only support ObnizOS for M5Stack Basic. Your device is not ObnizOS for M5Stack Basic.",
      );
    }
  }
}

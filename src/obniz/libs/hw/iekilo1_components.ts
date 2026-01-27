/**
 * @packageDocumentation
 * @module ObnizCore.Hardware
 */

import { MCP23S08 } from '../embeds/mcp23s08';
import { ObnizDevice } from '../../ObnizDevice';

export enum KiloInterface {
  None = 0,
  Relay_On = 1 << 0,
  RS232_On = 1 << 1,
  RS485_On = 1 << 2,
  CANBus_On = 1 << 3,
}

export class IntelligentEdgeKiloComponent {
  protected obniz: ObnizDevice;

  public mcp23s08!: MCP23S08;

  protected isDirectionFlashed = false;

  public RS232_TX = 3;
  public RS232_RX = 4;

  public RS485_TX = 4;
  public RS485_RX = 3;
  public RS485_DE = 7;

  public CANBUS_TX = 5;
  public CANBUS_RX = 6;

  constructor(obniz: ObnizDevice) {
    this.obniz = obniz;
  }

  public prepare() {
    if (this.obniz.hw !== 'iekilo1') {
      throw new Error(
        'Obniz.IntelligentEdgeKilo only support ObnizOS for Intelligent Edge Kilo Your device is not ObnizOS for Intelligent Edge Kilo.'
      );
    }
    const firstTime = !this.mcp23s08;
    const reconnected = this.mcp23s08 && this.obniz.spi0!.isUsed() === false;
    if (firstTime || reconnected) {
      const spi = this.obniz.spi0!;
      spi.start({
        mode: 'master',
        mosi: 20,
        miso: 21,
        clk: 19,
        cs: 8,
        frequency: 100 * 1000,
      });
      this.mcp23s08 = new MCP23S08();
      this.mcp23s08.wired(this.obniz, spi);

      // Initial values
      this.mcp23s08.io0.value = false;
      this.mcp23s08.io1.value = false;
      this.mcp23s08.io2.value = true;
      this.mcp23s08.io3.value = true;
      this.mcp23s08.io4.value = true;
      this.mcp23s08.io5.value = false;
    }
  }

  /**
   * Powering on Each Interface.
   * RS232, RS485, CANBus, Relay. But RS232 and RS485 cannot be enabled at the same time.
   *
   * @param mode Powring on each interface.
   */
  public powerOnInterface(mode: KiloInterface) {
    const mcp = this.mcp23s08;

    const is232On = mcp.io1.value === true;
    const is485On = mcp.io3.value === false;

    if (is232On && (mode & KiloInterface.RS485_On) !== 0) {
      throw new Error('RS232 and RS485 cannot be enabled at the same time');
    }
    if (is485On && (mode & KiloInterface.RS232_On) !== 0) {
      throw new Error('RS232 and RS485 cannot be enabled at the same time');
    }

    // IO0: RS232FORCEON H: normal operation without autodown
    // IO1: RS232FORCEOFF L: PowerOFF H: Operation
    // IO2: RS232EN  L: Operation H:OFF
    // IO3: 485RE   L: work H: Standby
    // IO4: CANSTBY L: work H: Standby
    // IO5: RELAY
    // IO6: x
    // IO7: (input)RS232INV

    if (!this.isDirectionFlashed) {
      // Everything Off State
      mcp.io0.direction = MCP23S08.MCP23S08_IO_DIRECTION.OUTPUT;
      mcp.io1.direction = MCP23S08.MCP23S08_IO_DIRECTION.OUTPUT;
      mcp.io2.direction = MCP23S08.MCP23S08_IO_DIRECTION.OUTPUT;
      mcp.io3.direction = MCP23S08.MCP23S08_IO_DIRECTION.OUTPUT;
      mcp.io4.direction = MCP23S08.MCP23S08_IO_DIRECTION.OUTPUT;
      mcp.io5.direction = MCP23S08.MCP23S08_IO_DIRECTION.OUTPUT;
      mcp.io6.direction = MCP23S08.MCP23S08_IO_DIRECTION.INPUT;
      mcp.io7.direction = MCP23S08.MCP23S08_IO_DIRECTION.INPUT;
      mcp.flush('direction'); // or mcp.flush("direction"); for no wait.
      this.isDirectionFlashed = true;
    }

    if (mode & KiloInterface.Relay_On) {
      mcp.io5.value = true;
    }

    // rs485 recevei Enable
    if (mode & KiloInterface.RS485_On) {
      mcp.io0.value = false;
      mcp.io1.value = false;
      mcp.io2.value = true;
      mcp.io3.value = false;
    } else if (mode & KiloInterface.RS232_On) {
      mcp.io0.value = true;
      mcp.io1.value = true;
      mcp.io2.value = false;
      mcp.io3.value = true;
    }

    // CAN Enable
    if (mode & KiloInterface.CANBus_On) {
      mcp.io4.value = false;
    }

    // flash
    mcp.flush('gpio'); // or mcp.flush("direction"); for no wait.
  }

  /**
   * Powering off all interfaces.
   */
  public powerOffAllInterfaces() {
    const mcp = this.mcp23s08;
    mcp.io0.value = false;
    mcp.io1.value = false;
    mcp.io2.value = true;
    mcp.io3.value = true;
    mcp.io4.value = true;
    mcp.io5.value = false;
    mcp.flush('gpio'); // or mcp.flush("direction"); for no wait.
  }

  /**
   * Check RS232 is having 232 leve linput.
   * Attention! This function never works with FORCE ON. this is standard situation.
   *
   * @returns true: RS232 is having rs232 leve signal. false: RS232 is not having target wait.
   */
  public async isRS232HavingTargetWait(): Promise<boolean> {
    const mcp = this.mcp23s08;
    await mcp.readAllGPIOWait();
    return mcp.io7.value;
  }

  /**
   * Conversion method from ad0 voltage to input supply voltage.
   *
   * @param inputVoltage ad0 voltage.
   * @returns Input Supply Voltage.
   */
  protected inputVoltageToVoltage(inputVoltage: number) {
    return parseFloat(((inputVoltage / 11.0) * 111.0).toFixed(3));
  }

  /**
   * Step is 8.12mV(12bit)
   * voltage. measurable range is 0 to 33.3v.
   */
  public startMonitoringPowerSupply(callbaack: (voltage: number) => void) {
    // 100kohm + 11kohm for 1%.
    this.obniz.ad0!.start((ad0Level) => {
      const inputVoltage = this.inputVoltageToVoltage(ad0Level);
      callbaack(inputVoltage);
    });
  }

  /**
   * Step is 8.12mV(12bit)
   *
   * @returns voltage. measurable range is 0 to 33.3v.
   */
  public async getPowerSupplyVoltageWait(): Promise<number> {
    const ad0Level = await this.obniz.ad0!.getWait();
    return this.inputVoltageToVoltage(ad0Level);
  }

  /**
   * Setting relay state.
   *
   * @param state true for on.
   */
  public setRelay(state: boolean) {
    const mcp = this.mcp23s08;
    mcp.io5.value = state;
    mcp.flush('gpio');
  }
}

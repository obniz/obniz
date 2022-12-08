/**
 * @packageDocumentation
 * @module ObnizCore
 */
import { ObnizBLE as ObnizHciBLE } from './libs/embeds/bleHci/ble';
import { Display } from './libs/embeds/display';
import { ObnizSwitch } from './libs/embeds/switch';
import { PeripheralAD } from './libs/io_peripherals/ad';
import { DriveType } from './libs/io_peripherals/common';
import { Directive as PeripheralDirective } from './libs/io_peripherals/directive';
import { PeripheralI2C } from './libs/io_peripherals/i2c';
import { PeripheralIO } from './libs/io_peripherals/io';
import { PeripheralPWM } from './libs/io_peripherals/pwm';
import { PeripheralSPI } from './libs/io_peripherals/spi';
import { PeripheralUART } from './libs/io_peripherals/uart';
import { LogicAnalyzer } from './libs/measurements/logicanalyzer';
import { ObnizMeasure } from './libs/measurements/measure';
import { WiFi } from './libs/network/wifi';
import { Plugin } from './libs/plugin/plugin';
import { ObnizParts } from './ObnizParts';
import { ObnizOptions } from './ObnizOptions';
export declare type PeripheralName = 'pwm' | 'uart' | 'spi' | 'i2c' | 'tcp';
export declare abstract class ObnizComponents extends ObnizParts {
    /**
     * @category Peripherals
     */
    io?: PeripheralDirective;
    /**
     * @category Peripherals
     */
    io0?: PeripheralIO;
    /**
     * @category Peripherals
     */
    io1?: PeripheralIO;
    /**
     * @category Peripherals
     */
    io2?: PeripheralIO;
    /**
     * @category Peripherals
     */
    io3?: PeripheralIO;
    /**
     * @category Peripherals
     */
    io4?: PeripheralIO;
    /**
     * @category Peripherals
     */
    io5?: PeripheralIO;
    /**
     * @category Peripherals
     */
    io6?: PeripheralIO;
    /**
     * @category Peripherals
     */
    io7?: PeripheralIO;
    /**
     * @category Peripherals
     */
    io8?: PeripheralIO;
    /**
     * @category Peripherals
     */
    io9?: PeripheralIO;
    /**
     * @category Peripherals
     */
    io10?: PeripheralIO;
    /**
     * @category Peripherals
     */
    io11?: PeripheralIO;
    /**
     * @category Peripherals
     */
    ad0?: PeripheralAD;
    /**
     * @category Peripherals
     */
    ad1?: PeripheralAD;
    /**
     * @category Peripherals
     */
    ad2?: PeripheralAD;
    /**
     * @category Peripherals
     */
    ad3?: PeripheralAD;
    /**
     * @category Peripherals
     */
    ad4?: PeripheralAD;
    /**
     * @category Peripherals
     */
    ad5?: PeripheralAD;
    /**
     * @category Peripherals
     */
    ad6?: PeripheralAD;
    /**
     * @category Peripherals
     */
    ad7?: PeripheralAD;
    /**
     * @category Peripherals
     */
    ad8?: PeripheralAD;
    /**
     * @category Peripherals
     */
    ad9?: PeripheralAD;
    /**
     * @category Peripherals
     */
    ad10?: PeripheralAD;
    /**
     * @category Peripherals
     */
    ad11?: PeripheralAD;
    /**
     * @category Peripherals
     */
    pwm0?: PeripheralPWM;
    /**
     * @category Peripherals
     */
    pwm1?: PeripheralPWM;
    /**
     * @category Peripherals
     */
    pwm2?: PeripheralPWM;
    /**
     * @category Peripherals
     */
    pwm3?: PeripheralPWM;
    /**
     * @category Peripherals
     */
    pwm4?: PeripheralPWM;
    /**
     * @category Peripherals
     */
    pwm5?: PeripheralPWM;
    /**
     * @category Peripherals
     */
    uart0?: PeripheralUART;
    /**
     * @category Peripherals
     */
    uart1?: PeripheralUART;
    /**
     * @category Peripherals
     */
    spi0?: PeripheralSPI;
    /**
     * @category Peripherals
     */
    spi1?: PeripheralSPI;
    /**
     * @category Peripherals
     */
    i2c0?: PeripheralI2C;
    /**
     * @category Measurement
     */
    logicAnalyzer?: LogicAnalyzer;
    /**
     * @category Measurement
     */
    measure?: ObnizMeasure;
    /**
     * @category Embeds
     */
    display?: Display;
    /**
     * @category Embeds
     */
    switch?: ObnizSwitch;
    /**
     * If obnizOS ver >= 3.0.0, automatically load [[ObnizCore.Components.Ble.Hci.ObnizBLE|ObnizHciBLE]],
     * and obnizOS ver < 3.0.0 throw unsupported Error,
     *
     * @category Embeds
     */
    ble?: ObnizHciBLE;
    /**
     * @category network
     */
    wifi?: WiFi;
    /**
     * @category plugin
     */
    plugin?: Plugin;
    protected _hwDefinition: any;
    protected pongObservers: any;
    protected _allComponentKeys: any;
    protected _hw_peripherals: any;
    constructor(id: string, options?: ObnizOptions);
    /**
     * Output pin Vcc and Gnd
     *
     * @param vcc
     * @param gnd
     * @param drive
     */
    setVccGnd(vcc: number | null | undefined, gnd: number | null | undefined, drive: DriveType): void;
    /**
     * Get IO module from pin no
     *
     * @param io
     */
    getIO(io: number): PeripheralIO;
    /**
     * GET AD module from pin no
     *
     * @param io
     */
    getAD(io: number): PeripheralAD;
    /**
     * It returns unused PWM module.
     */
    getFreePwm(): PeripheralPWM;
    /**
     * It returns unused I2C module.
     */
    getFreeI2C(): PeripheralI2C;
    /**
     * It returns setuped I2C module .
     *
     * @param config
     */
    getI2CWithConfig(config: any): PeripheralI2C;
    /**
     * It returns unused SPI module.
     */
    getFreeSpi(): PeripheralSPI;
    /**
     * It returns setuped SPI module.
     *
     * @param config
     */
    getSpiWithConfig(config: any): PeripheralSPI;
    /**
     * It returns unused UART module.
     */
    getFreeUart(): PeripheralUART;
    /**
     * It returns unused TCP module.
     */
    getFreeTcp(): any;
    hasExtraInterface(interfaceName: string): boolean;
    getExtraInterface(interfaceName: string): any;
    protected _close(): void;
    protected _callOnConnect(): void;
    protected _prepareComponents(): void;
    protected _resetComponents(): void;
    protected _notifyToModule(obj: any): void;
    protected _handleSystemCommand(wsObj: any): void;
    protected addPongObserver(callback: any): void;
    protected removePongObserver(callback: any): void;
    protected _getFreePeripheralUnit(peripheral: PeripheralName): any;
}

/**
 * @packageDocumentation
 * @module ObnizCore.Hardware
 */
import { ObnizDevice } from '../../ObnizDevice';
import Button from '../../../parts/MovementSensor/Button';
import { PeripheralI2C } from '../../../obniz/libs/io_peripherals/i2c';
import { PeripheralIO as IO } from '../../../obniz/libs/io_peripherals/io';
import { ObnizBLE } from '../embeds/bleHci/ble';
import { Display } from '../embeds/display';
import { PeripheralAD } from '../io_peripherals/ad';
import { PeripheralGrove } from '../io_peripherals/grove';
import { PeripheralPWM } from '../io_peripherals/pwm';
import { PeripheralSPI } from '../io_peripherals/spi';
import { PeripheralUART } from '../io_peripherals/uart';
import { LogicAnalyzer } from '../measurements/logicanalyzer';
import { ObnizMeasure } from '../measurements/measure';
export declare class M5StackBasic extends ObnizDevice {
    /**
     * Embeded Left Button on M5Stack.
     *
     * @category Embeds
     */
    buttonA: Button;
    /**
     * Embeded Center Button on M5Stack.
     *
     * @category Embeds
     */
    buttonB: Button;
    /**
     * Embeded Right Button on M5Stack.
     *
     * @category Embeds
     */
    buttonC: Button;
    /**
     * @category Peripherals
     */
    io0: IO;
    /**
     * @ignore
     */
    io1: never;
    /**
     * @category Peripherals
     */
    io2: IO;
    /**
     * @ignore
     */
    io3: never;
    /**
     * @category Peripherals
     */
    io4: IO;
    /**
     * @category Peripherals
     */
    io5: IO;
    /**
     * @category Peripherals
     */
    io12: IO;
    /**
     * @category Peripherals
     */
    io13: IO;
    /**
     * @category Peripherals
     */
    io15: IO;
    /**
     * @category Peripherals
     */
    io16: IO;
    /**
     * @category Peripherals
     */
    io17: IO;
    /**
     * @category Peripherals
     */
    io19: IO;
    /**
     * @category Peripherals
     */
    io21: IO;
    /**
     * @category Peripherals
     */
    io22: IO;
    /**
     * @category Peripherals
     */
    io25: IO;
    /**
     * @category Peripherals
     */
    io26: IO;
    /**
     * @category Peripherals
     */
    io34: IO;
    /**
     * @category Peripherals
     */
    io35: IO;
    /**
     * @category Peripherals
     */
    io36: IO;
    /**
     * @ignore
     */
    ad0: never;
    /**
     * @ignore
     */
    ad1: never;
    /**
     * @ignore
     */
    ad2: never;
    /**
     * @ignore
     */
    ad3: never;
    /**
     * @ignore
     */
    ad4: never;
    /**
     * @ignore
     */
    ad5: never;
    /**
     * @ignore
     */
    ad6: never;
    /**
     * @ignore
     */
    ad7: never;
    /**
     * @ignore
     */
    ad8: never;
    /**
     * @ignore
     */
    ad9: never;
    /**
     * @ignore
     */
    ad10: never;
    /**
     * @ignore
     */
    ad11: never;
    /**
     * @ignore
     */
    ad32: never;
    /**
     * @ignore
     */
    ad33: never;
    /**
     * @category Peripherals
     */
    ad34: PeripheralAD;
    /**
     * @category Peripherals
     */
    ad35: PeripheralAD;
    /**
     * @category Peripherals
     */
    ad36: PeripheralAD;
    /**
     * @category Peripherals
     */
    pwm0: PeripheralPWM;
    /**
     * @category Peripherals
     */
    pwm1: PeripheralPWM;
    /**
     * @category Peripherals
     */
    pwm2: PeripheralPWM;
    /**
     * @category Peripherals
     */
    pwm3: PeripheralPWM;
    /**
     * @category Peripherals
     */
    pwm4: PeripheralPWM;
    /**
     * @category Peripherals
     */
    pwm5: PeripheralPWM;
    /**
     * @category Peripherals
     */
    uart0: PeripheralUART;
    /**
     * @category Peripherals
     */
    uart1: PeripheralUART;
    /**
     *
     *
     * @category Peripherals
     */
    spi0: PeripheralSPI;
    /**
     * @category Peripherals
     */
    spi1: PeripheralSPI;
    /**
     * @category Peripherals
     */
    i2c0: PeripheralI2C;
    /**
     * @category Peripherals
     */
    grove0: PeripheralGrove;
    /**
     * This is used by system. Please use i2c0.
     *
     * @category Peripherals
     */
    i2c1: PeripheralI2C;
    /**
     * @category Measurement
     */
    logicAnalyzer: LogicAnalyzer;
    /**
     * @category Measurement
     */
    measure: ObnizMeasure;
    /**
     * @category Embeds
     */
    display: Display;
    /**
     * @ignore
     */
    switch: never;
    /**
     * If obnizOS ver >= 3.0.0, automatically load [[ObnizCore.Components.Ble.Hci.ObnizBLE|ObnizHciBLE]],
     * and obnizOS ver < 3.0.0 throw unsupported error,
     *
     * @category Embeds
     */
    ble: ObnizBLE;
    protected io32: IO;
    protected io33: IO;
    protected io27: IO;
    protected io14: IO;
    protected io18: IO;
    protected io23: IO;
    protected io37: IO;
    protected io38: IO;
    protected io39: IO;
    constructor(id: string, options?: any);
    protected _beforeOnConnect(): void;
    protected _prepareComponents(): void;
}

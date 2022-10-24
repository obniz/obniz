/**
 * @packageDocumentation
 * @module ObnizCore.Hardware
 */
import { ObnizDevice } from '../../ObnizDevice';
import InfraredLED from '../../../parts/Infrared/InfraredLED';
import LED from '../../../parts/Light/LED';
import Button from '../../../parts/MovementSensor/Button';
import { PeripheralI2C } from '../../../obniz/libs/io_peripherals/i2c';
import { PeripheralIO as IO } from '../../../obniz/libs/io_peripherals/io';
import MPU6886 from '../../../parts/MovementSensor/MPU6886';
import SH200Q from '../../../parts/MovementSensor/SH200Q';
import AXP192 from '../../../parts/Power/AXP192';
import { ObnizBLE as ObnizBLEHci } from '../embeds/bleHci/ble';
import { Display } from '../embeds/display';
import { PeripheralAD } from '../io_peripherals/ad';
import { PeripheralGrove } from '../io_peripherals/grove';
import { PeripheralPWM } from '../io_peripherals/pwm';
import { PeripheralSPI } from '../io_peripherals/spi';
import { PeripheralUART } from '../io_peripherals/uart';
import { LogicAnalyzer } from '../measurements/logicanalyzer';
import { ObnizMeasure } from '../measurements/measure';
export declare class M5StickC extends ObnizDevice {
    /**
     * Embeded Primary Button on M5StickC. Big button right of display with print "M5". Also This button can be used as trigger of serverless function trigger.
     *
     * @category Embeds
     */
    buttonA: Button;
    /**
     * Embeded Secondary Button on M5StickC. It is on side of M5StickC.
     *
     * @category Embeds
     */
    buttonB: Button;
    /**
     * Embeded Infrared LED inside of M5StickC
     *
     * @category Embeds
     */
    ir: InfraredLED;
    /**
     * Embeded 6 axis IMU. 3 acceleration and 3 gyro.
     *
     * ```javascript
     * const data = await obniz.imu.getAllDataWait();
     * console.log('accelerometer: %o', data.accelerometer);
     * console.log('gyroscope: %o', data.gyroscope);
     * ```
     *
     * @category Embeds
     */
    imu?: MPU6886 | SH200Q;
    /**
     * Power management chip in M5StickC.
     *
     * @category Embeds
     */
    axp: AXP192;
    /**
     * Embeded Red LED on M5StickC
     *
     * @category Embeds
     */
    led: LED;
    /**
     * @ignore
     */
    io1: never;
    /**
     * @ignore
     */
    io2: never;
    /**
     * @ignore
     */
    io3: never;
    /**
     * @ignore
     */
    io4: never;
    /**
     * @ignore
     */
    io5: never;
    /**
     * @ignore
     */
    io6: never;
    /**
     * @ignore
     */
    io7: never;
    /**
     * @ignore
     */
    io8: never;
    /**
     * @ignore
     */
    io9: never;
    /**
     * @ignore
     */
    io10: never;
    /**
     * @ignore
     */
    io11: never;
    /**
     * @category Peripherals
     */
    io26: IO;
    /**
     * @category Peripherals
     */
    io32: IO;
    /**
     * @category Peripherals
     */
    io33: IO;
    /**
     * @category Peripherals
     */
    io34: IO;
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
     * @category Peripherals
     */
    ad32: PeripheralAD;
    /**
     * @category Peripherals
     */
    ad33: PeripheralAD;
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
    ble: ObnizBLEHci;
    protected io21: IO;
    protected io22: IO;
    protected io27: IO;
    protected io37: IO;
    protected io39: IO;
    private _m5i2c;
    constructor(id: string, options?: any);
    gyroWait(): Promise<{
        x: number;
        y: number;
        z: number;
    }>;
    accelerationWait(): Promise<{
        x: number;
        y: number;
        z: number;
    }>;
    setupIMUWait(imuName?: 'MPU6886' | 'SH200Q'): Promise<MPU6886 | SH200Q>;
    protected _beforeOnConnect(): void;
    protected _prepareComponents(): void;
}

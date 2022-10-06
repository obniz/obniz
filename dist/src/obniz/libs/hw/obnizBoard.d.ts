/**
 * @packageDocumentation
 * @module ObnizCore.Hardware
 */
import { ObnizDevice } from '../../ObnizDevice';
import { ObnizBLE } from '../embeds/bleHci/ble';
import { Display } from '../embeds/display';
import { ObnizSwitch } from '../embeds/switch';
import { PeripheralAD } from '../io_peripherals/ad';
import { PeripheralI2C } from '../io_peripherals/i2c';
import { PeripheralIO } from '../io_peripherals/io';
import { PeripheralPWM } from '../io_peripherals/pwm';
import { PeripheralSPI } from '../io_peripherals/spi';
import { PeripheralUART } from '../io_peripherals/uart';
import { LogicAnalyzer } from '../measurements/logicanalyzer';
import { ObnizMeasure } from '../measurements/measure';
/**
 * obniz Board interface
 */
export interface ObnizBoard extends ObnizDevice {
    io0: PeripheralIO;
    io1: PeripheralIO;
    io2: PeripheralIO;
    io3: PeripheralIO;
    io4: PeripheralIO;
    io5: PeripheralIO;
    io6: PeripheralIO;
    io7: PeripheralIO;
    io8: PeripheralIO;
    io9: PeripheralIO;
    io10: PeripheralIO;
    io11: PeripheralIO;
    ad0: PeripheralAD;
    ad1: PeripheralAD;
    ad2: PeripheralAD;
    ad3: PeripheralAD;
    ad4: PeripheralAD;
    ad5: PeripheralAD;
    ad6: PeripheralAD;
    ad7: PeripheralAD;
    ad8: PeripheralAD;
    ad9: PeripheralAD;
    ad10: PeripheralAD;
    ad11: PeripheralAD;
    pwm0: PeripheralPWM;
    pwm1: PeripheralPWM;
    pwm2: PeripheralPWM;
    pwm3: PeripheralPWM;
    pwm4: PeripheralPWM;
    pwm5: PeripheralPWM;
    uart0: PeripheralUART;
    uart1: PeripheralUART;
    spi0: PeripheralSPI;
    spi1: PeripheralSPI;
    i2c0: PeripheralI2C;
    logicAnalyzer: LogicAnalyzer;
    measure: ObnizMeasure;
    display: Display;
    switch: ObnizSwitch;
    ble: ObnizBLE;
}

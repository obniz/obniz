import {I2C} from "../obniz/libs/io_peripherals/i2c";

export interface I2cPartsOptions {
    vcc?: number;
    gnd?: number;
    sda?: number;
    scl?: number;
    i2c?: I2C
}

export interface I2cPartsAbstruct {

}

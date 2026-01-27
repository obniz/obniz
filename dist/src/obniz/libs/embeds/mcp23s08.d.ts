import { Obniz } from '../../Obniz';
import { PeripheralSPI } from '../io_peripherals/spi';
import { MCP23S08_IO } from './mcp23s08_io';
export declare class MCP23S08 {
    static MCP23S08_IO_DIRECTION: {
        OUTPUT: boolean;
        INPUT: boolean;
    };
    static MCP23S08_REGISTER: {
        IODIR: number;
        IPOL: number;
        GPINTEN: number;
        DEFVAL: number;
        INTCON: number;
        IOCON: number;
        GPPU: number;
        INTF: number;
        INTCAP: number;
        GPIO: number;
        OLAT: number;
    };
    keys: string[];
    requiredKeys: string[];
    params: any;
    protected obniz: Obniz;
    protected spi: PeripheralSPI;
    writeSlaveAddress: number;
    readSlaveAddress: number;
    private ios;
    readonly io0: MCP23S08_IO;
    readonly io1: MCP23S08_IO;
    readonly io2: MCP23S08_IO;
    readonly io3: MCP23S08_IO;
    readonly io4: MCP23S08_IO;
    readonly io5: MCP23S08_IO;
    readonly io6: MCP23S08_IO;
    readonly io7: MCP23S08_IO;
    constructor();
    wired(obniz: Obniz, spi: PeripheralSPI): void;
    /**
     * Initialize all ios. set direction=input.
     */
    initWait(obniz: Obniz): Promise<void>;
    /**
     * Read byte from address
     *
     * @param address internal register address
     * @returns readed value of address
     */
    readWait(address: number): Promise<number>;
    /**
     * Write byte to address. It will wait until success response receive
     *
     * @param address internal register address
     * @param data
     */
    writeWait(address: number, data: number): Promise<void>;
    /**
     * Write byte to address without wait.
     *
     * @param address internal register address
     * @param data
     */
    write(address: number, data: number): void;
    /**
     * Bulk write to addresses
     *
     * @param address start address
     * @param data
     */
    writeBulkWait(address: number, data: number[]): Promise<void>;
    /**
     * set output value for io. It will apply immidiately.
     * This function never change direction. set direction output before.
     * If you want to hold some changes and flush once.
     * ```
     * use following examle steps
     * this.io0.value = true;
     * this.io1.value = true;
     * this.flush("gpio");
     * ```
     *
     * @param id io address. 0-7
     * @param value boolean. true or false
     */
    output(id: number, value: boolean): void;
    /**
     * async version of output();
     *
     * @param id
     * @param value
     */
    outputWait(id: number, value: boolean): Promise<void>;
    /**
     * Read current all GPIO value.
     */
    readAllGPIOWait(): Promise<void>;
    /**
     * Read current all GPIO value and return single io value.
     *
     * @param id io 0-7
     * @returns GPIO value
     */
    inputWait(id: number): Promise<boolean>;
    flushWait(type?: 'gpio' | 'direction'): Promise<void>;
    flush(type?: 'gpio' | 'direction'): void;
}

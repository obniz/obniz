"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MCP23S08 = void 0;
const mcp23s08_io_1 = require("./mcp23s08_io");
class MCP23S08 {
    constructor() {
        this.ios = [];
        this.keys = ['vcc', 'gnd', 'frequency', 'mosi', 'miso', 'clk', 'spi', 'cs'];
        this.requiredKeys = ['cs'];
    }
    wired(obniz, spi) {
        this.obniz = obniz;
        this.spi = spi;
        this.readSlaveAddress = 0b01000001;
        this.writeSlaveAddress = 0b01000000;
        this.ios = [];
        for (let i = 0; i < 8; i++) {
            const io = new mcp23s08_io_1.MCP23S08_IO(this, i);
            this.ios.push(io);
            this['io' + i] = io;
        }
    }
    /**
     * Initialize all ios. set direction=input.
     */
    async initWait(obniz) {
        await this.writeWait(MCP23S08.MCP23S08_REGISTER.IODIR, 0xff); // input
        for (let i = MCP23S08.MCP23S08_REGISTER.IPOL; i <= MCP23S08.MCP23S08_REGISTER.OLAT; i++) {
            await this.writeWait(i, 0x00);
        }
        await this.flushWait('direction');
        await this.flushWait('gpio');
    }
    /**
     * Read byte from address
     *
     * @param address internal register address
     * @returns readed value of address
     */
    async readWait(address) {
        await this.spi.writeWait([this.readSlaveAddress, address]);
        const ret = await this.spi.writeWait([0x00]);
        return ret[0];
    }
    /**
     * Write byte to address. It will wait until success response receive
     *
     * @param address internal register address
     * @param data
     */
    async writeWait(address, data) {
        await this.spi.writeWait([this.writeSlaveAddress, address, data]);
    }
    /**
     * Write byte to address without wait.
     *
     * @param address internal register address
     * @param data
     */
    write(address, data) {
        this.spi.write([this.writeSlaveAddress, address, data]);
    }
    /**
     * Bulk write to addresses
     *
     * @param address start address
     * @param data
     */
    async writeBulkWait(address, data) {
        await this.spi.writeWait([this.writeSlaveAddress, address, ...data]);
    }
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
    output(id, value) {
        value = value === true;
        this.ios[id].value = value;
        this.flush();
    }
    /**
     * async version of output();
     *
     * @param id
     * @param value
     */
    async outputWait(id, value) {
        value = value === true;
        this.ios[id].value = value;
        await this.flushWait();
    }
    /**
     * Read current all GPIO value.
     */
    async readAllGPIOWait() {
        const ret = await this.readWait(MCP23S08.MCP23S08_REGISTER.GPIO);
        for (let i = 0; i < 8; i++) {
            if (this.ios[i].direction === MCP23S08.MCP23S08_IO_DIRECTION.INPUT) {
                this.ios[i].value = (ret & (1 << i)) !== 0;
            }
        }
    }
    /**
     * Read current all GPIO value and return single io value.
     *
     * @param id io 0-7
     * @returns GPIO value
     */
    async inputWait(id) {
        await this.readAllGPIOWait();
        return this.ios[id].value;
    }
    async flushWait(type = 'gpio') {
        const keys = {
            gpio: { key: 'value', address: MCP23S08.MCP23S08_REGISTER.GPIO },
            direction: {
                key: 'direction',
                address: MCP23S08.MCP23S08_REGISTER.IODIR,
            },
        };
        const key = keys[type].key;
        const address = keys[type].address;
        let value = 0;
        for (let i = 0; i < 8; i++) {
            if (this.ios[i][key]) {
                value = value | (1 << i);
            }
        }
        await this.writeWait(address, value);
    }
    flush(type = 'gpio') {
        const keys = {
            gpio: { key: 'value', address: MCP23S08.MCP23S08_REGISTER.GPIO },
            direction: {
                key: 'direction',
                address: MCP23S08.MCP23S08_REGISTER.IODIR,
            },
        };
        const key = keys[type].key;
        const address = keys[type].address;
        let value = 0;
        for (let i = 0; i < 8; i++) {
            if (this.ios[i][key]) {
                value = value | (1 << i);
            }
        }
        this.write(address, value);
    }
}
exports.MCP23S08 = MCP23S08;
MCP23S08.MCP23S08_IO_DIRECTION = {
    OUTPUT: false,
    INPUT: true,
};
MCP23S08.MCP23S08_REGISTER = {
    IODIR: 0x00,
    IPOL: 0x01,
    GPINTEN: 0x02,
    DEFVAL: 0x03,
    INTCON: 0x04,
    IOCON: 0x05,
    GPPU: 0x06,
    INTF: 0x07,
    INTCAP: 0x08,
    GPIO: 0x09,
    OLAT: 0x0a,
};

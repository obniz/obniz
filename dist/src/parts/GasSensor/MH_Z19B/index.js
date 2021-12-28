"use strict";
/**
 * @packageDocumentation
 * @module Parts.MH_Z19B
 */
Object.defineProperty(exports, "__esModule", { value: true });
class MH_Z19B {
    constructor() {
        this.keys = ['vcc', 'gnd', 'sensor_tx', 'sensor_rx'];
        this.requiredKeys = ['sensor_tx', 'sensor_rx'];
        this.ioKeys = this.keys;
        this.displayName = 'co2';
        this.displayIoNames = { sensor_tx: 'sensorTx', rx: 'sensorRx' };
        this.rxbuf = Buffer.alloc(9);
        this.modes = {
            Read: 0x86,
            CalibZ: 0x87,
            CalibS: 0x88,
            ACBOnOff: 0x79,
            RangeSet: 0x99,
        };
        this.rangeType = {
            2000: [0x00, 0x00, 0x00, 0x07, 0xd0],
            5000: [0x00, 0x00, 0x00, 0x13, 0x88],
            10000: [0x00, 0x00, 0x00, 0x27, 0x10],
        };
    }
    static info() {
        return {
            name: 'MH_Z19B',
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        this.vcc = this.params.vcc;
        this.gnd = this.params.gnd;
        this.my_tx = this.params.sensor_rx;
        this.my_rx = this.params.sensor_tx;
        this.obniz.setVccGnd(this.vcc, this.gnd, '5v');
        this.uart = obniz.getFreeUart();
        this.uart.start({
            tx: this.my_tx,
            rx: this.my_rx,
            baud: 9600,
        });
    }
    heatWait(seconds) {
        if (typeof seconds === 'number' && seconds > 0) {
            seconds *= 1000;
        }
        else {
            seconds = 3 * 60 * 1000;
        }
        return new Promise((resolve) => {
            setTimeout(resolve, seconds);
        });
    }
    async getWait() {
        await this.requestReadConcentraiton();
        await this.obniz.wait(10);
        if (this.uart.isDataExists()) {
            const data = this.uart.readBytes();
            // console.log("received data");
            // console.log(data);
            const val = await this.getCO2Concentration(data);
            return val;
        }
        else {
            console.log('cannot receive data');
            throw new Error('cannot receive data');
        }
    }
    calibrateZero() {
        const command = this.makeRequestCmd('CalibZ', [
            0x00,
            0x00,
            0x00,
            0x00,
            0x00,
        ]);
        this.uart.send(command);
        // console.log('send a Zero Calibration command');
    }
    calibrateSpan(ppm = 2000) {
        if (ppm < 1000) {
            return;
        }
        const span_byte = Buffer.alloc(2);
        span_byte[0] = ppm / 256;
        span_byte[1] = ppm % 256;
        const command = this.makeRequestCmd('CalibS', [
            span_byte[0],
            span_byte[1],
            0x00,
            0x00,
            0x00,
        ]);
        this.uart.send(command);
        // console.log('send a Span Calibration command');
    }
    setAutoCalibration(autoCalibration = true) {
        let command;
        if (autoCalibration) {
            command = this.makeRequestCmd('ACBOnOff', [0xa0, 0x00, 0x00, 0x00, 0x00]);
            console.log('set an Auto Calibration ON');
        }
        else {
            command = this.makeRequestCmd('ACBOnOff', [0x00, 0x00, 0x00, 0x00, 0x00]);
            console.log('set an Auto Calibration OFF');
        }
        this.uart.send(command);
    }
    setDetectionRange(range) {
        let command;
        if (range in this.rangeType) {
            command = this.makeRequestCmd('RangeSet', this.rangeType[range]);
            console.log('Configured Range : ' + String(range));
        }
        else {
            console.log('invalid range value');
            command = this.makeRequestCmd('RangeSet', this.rangeType[5000]);
        }
        this.uart.send(command);
    }
    checkSum(res8) {
        let sum = 0;
        for (let i = 1; i < 8; i++) {
            sum += res8[i];
        }
        sum = 255 - (sum % 256) + 1;
        return sum;
    }
    makeRequestCmd(mode, databox = [0x00, 0x00, 0x00, 0x00, 0x00]) {
        const _buffer = Buffer.alloc(9);
        _buffer[0] = 0xff;
        _buffer[1] = 0x01;
        _buffer[2] = this.modes[mode];
        for (let i = 3; i < 8; i++) {
            _buffer[i] = databox[i - 3];
        }
        _buffer[8] = this.checkSum(_buffer);
        return Array.from(_buffer);
    }
    requestReadConcentraiton() {
        const command = this.makeRequestCmd('Read', [
            0x00,
            0x00,
            0x00,
            0x00,
            0x00,
        ]);
        // console.log("being sent request command");
        // console.log(command);
        this.uart.send(command);
    }
    getCO2Concentration(data) {
        let co2Concentration = 0;
        const status = this.checkResponseData(data);
        if (status) {
            co2Concentration = this.rxbuf[2] * 256 + this.rxbuf[3];
        }
        else {
            console.log('checksum error');
        }
        this.rxbuf = [];
        return co2Concentration;
    }
    checkResponseData(data) {
        let cs_result = false;
        if (data.length === 9) {
            for (let i = 0; i < data.length; i++) {
                this.rxbuf[i] = data[i];
            }
            if (this.checkSum(this.rxbuf) === this.rxbuf[8]) {
                cs_result = true;
            }
            else {
                cs_result = false;
            }
        }
        data = [];
        return cs_result;
    }
}
exports.default = MH_Z19B;

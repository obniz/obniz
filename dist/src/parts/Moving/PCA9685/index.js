"use strict";
/**
 * @packageDocumentation
 * @module Parts.PCA9685
 */
Object.defineProperty(exports, "__esModule", { value: true });
class PCA9685_PWM {
    constructor(chip, id) {
        this.value = 0;
        this.state = {};
        this.chip = chip;
        this.id = id;
    }
    freq(frequency) {
        this.chip.freq(frequency);
    }
    pulse(value) {
        this.chip.pulse(this.id, value);
    }
    duty(value) {
        this.chip.duty(this.id, value);
    }
}
/* eslint max-classes-per-file: 0 */
class PCA9685 {
    constructor() {
        this.pwms = [];
        this._freq = 0;
        /* https://www.nxp.com/docs/en/data-sheet/PCA9685.pdf */
        this.keys = [
            'gnd',
            'vcc',
            'scl',
            'sda',
            'oe',
            'i2c',
            'enabled',
            'address',
            'drive',
        ];
        this.requiredKeys = [];
        this.address = 0x40;
        this._commands = {
            MODE1: 0x00,
            MODE2: 0x01,
            SUBADR1: 0x02,
            SUBADR2: 0x03,
            SUBADR3: 0x04,
            PRESCALE: 0xfe,
            LED0_ON_L: 0x06,
            ALL_LED_ON_L: 0xfa,
            bits: {
                ALLCALL: 0x01,
                SLEEP_ENABLE: 0x10,
                AUTO_INCREMENT_ENABLED: 0x20,
                RESTART: 0x80,
                OUTDRV: 0x04,
                INVRT: 0x10,
            },
        };
        this._regs = new Array(1);
        this.pwmNum = 16;
        this.pwms = [];
        this._preparePWM(this.pwmNum);
    }
    static info() {
        return {
            name: 'PCA9685',
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        if (obniz.isValidIO(this.params.oe)) {
            this.io_oe = obniz.getIO(this.params.oe);
        }
        this.obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
        if (typeof this.params.address === 'number') {
            this.address = this.params.address;
        }
        this.params.clock = this.params.clock || 400 * 1000; // for i2c
        this.params.mode = this.params.mode || 'master'; // for i2c
        this.params.pull = this.params.pull || '5v'; // for i2c
        this.i2c = obniz.getI2CWithConfig(this.params);
        if (this.obniz.isValidIO(this.params.srclr)) {
            this.io_srclr = this.obniz.getIO(this.params.srclr);
            this.io_srclr.output(true);
        }
        if (typeof this.params.enabled !== 'boolean') {
            this.params.enabled = true;
        }
        if (this.io_oe && this.params.enabled) {
            this.io_oe.output(false);
        }
        if (this.params.drive === 'open-drain') {
            this.i2c.write(this.address, [
                this._commands.MODE2,
                this._commands.bits.OUTDRV,
            ]);
        }
        let mode1 = this._commands.bits.AUTO_INCREMENT_ENABLED;
        mode1 = mode1 & ~this._commands.bits.SLEEP_ENABLE;
        this.i2c.write(this.address, [this._commands.MODE1, mode1]);
        this.i2c.write(this.address, [
            this._commands.MODE1,
            mode1 | this._commands.bits.RESTART,
        ]);
        this._regs[this._commands.MODE1] = mode1;
        obniz.wait(10);
    }
    _preparePWM(num) {
        for (let i = 0; i < num; i++) {
            this.pwms.push(new PCA9685_PWM(this, i));
        }
    }
    isValidPWM(id) {
        return typeof id === 'number' && id >= 0 && id < this.pwmNum;
    }
    getPWM(id) {
        if (!this.isValidPWM(id)) {
            throw new Error('pwm ' + id + ' is not valid pwm');
        }
        return this.pwms[id];
    }
    freq(frequency) {
        if (typeof frequency !== 'number') {
            return;
        }
        if (frequency < 24 || 1526 < frequency) {
            throw new Error('freq must be within 24-1526 hz');
        }
        if (this._freq === frequency) {
            return;
        }
        let prescaleval = 25000000.0; // 25MHz
        prescaleval /= 4096.0; // 12bit
        prescaleval /= frequency * 0.9;
        prescaleval -= 1.0;
        const prescale = Math.floor(Math.floor(prescaleval + 0.5));
        const mode1 = this._regs[this._commands.MODE1];
        this.i2c.write(this.address, [
            this._commands.MODE1,
            (mode1 & 0x7f) | this._commands.bits.SLEEP_ENABLE,
        ]); // enter sleep
        this.i2c.write(this.address, [this._commands.PRESCALE, prescale]);
        this.i2c.write(this.address, [this._commands.MODE1, mode1]); // recover from sleep
        this.obniz.wait(5);
        // save
        this._freq = frequency;
        for (let i = 0; i < this.pwms.length; i++) {
            this.pwms[i].state.freq = this._freq;
        }
    }
    pulse(index, pulse_width) {
        if (typeof this._freq !== 'number' || this._freq <= 0) {
            throw new Error('please provide freq first.');
        }
        this.duty(index, (pulse_width / 1000.0 / (1.0 / this._freq)) * 100);
    }
    duty(index, duty) {
        duty *= 1.0;
        if (typeof this._freq !== 'number' || this._freq <= 0) {
            throw new Error('please provide freq first.');
        }
        if (typeof duty !== 'number') {
            throw new Error('please provide duty in number');
        }
        if (duty < 0) {
            duty = 0;
        }
        if (duty > 100) {
            duty = 100;
        }
        this.getPWM(index).state.duty = duty;
        this.writeSingleONOFF(index, 0, (duty / 100.0) * 4095);
    }
    writeSingleONOFF(index, on, off) {
        this.i2c.write(this.address, [
            this._commands.LED0_ON_L + 4 * index,
            on & 0xff,
            on >> 8,
            off & 0xff,
            off >> 8,
        ]);
    }
    setEnable(enable) {
        if (!this.io_oe && enable === false) {
            throw new Error('pin "oe" is not specified');
        }
        this.io_oe.output(!enable);
    }
}
exports.default = PCA9685;

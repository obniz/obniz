"use strict";
/**
 * @packageDocumentation
 * @module Parts.MatrixLED_HT16K33
 */
Object.defineProperty(exports, "__esModule", { value: true });
class MatrixLED_HT16K33 {
    constructor() {
        this.width = 0;
        this.height = 0;
        this.keys = ['vcc', 'gnd', 'sda', 'scl', 'i2c', 'address'];
        this.requiredKeys = [];
        this.command = {};
        this.command.blink = 0x80;
        this.command.brightness = 0xe0;
        this.blink_mode = {};
        this.blink_mode.display_on = 0x01;
        this.blink_mode.blink_off = 0x00;
        this.blink_mode.blink_2hz = 0x01;
        this.blink_mode.blink_1hz = 0x02;
        this.blink_mode.blink_halfhz = 0x03;
        this.vram = [];
    }
    static info() {
        return {
            name: 'MatrixLED_HT16K33',
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
        this.address = this.params.address || 0x70;
        this.params.pull = '5v';
        this.params.mode = 'master';
        this.params.clock = this.params.clock || 400 * 1000;
        this.i2c = obniz.getI2CWithConfig(this.params);
        this.obniz.wait(1000);
    }
    init(width) {
        // 8 or 16
        this.width = width;
        this.height = 8; // IC static setting
        this.prepareVram(width, this.height);
        this.i2c.write(this.address, [0x21]);
        this.blinkRate(this.blink_mode.blink_off);
        this.brightness(15);
        this.obniz.wait(10);
    }
    blinkRate(val) {
        if (val < 0) {
            val = 0;
        }
        if (val > 3) {
            val = 3;
        }
        this.i2c.write(this.address, [
            this.command.blink | this.blink_mode.display_on | (val << 1),
        ]);
    }
    brightness(val) {
        if (val < 0) {
            val = 0;
        }
        if (val > 15) {
            val = 15;
        }
        this.i2c.write(this.address, [this.command.brightness | val]);
    }
    clear() {
        for (let i = 0; i < this.height; i++) {
            this.vram[i] = 0x00;
        }
        this.writeVram();
    }
    draw(ctx) {
        const imageData = ctx.getImageData(0, 0, this.width, this.height);
        const data = imageData.data;
        for (let i = 0; i < this.height; i++) {
            this.vram[i] = 0;
            for (let j = 0; j < this.width; j++) {
                const pos = i * this.height * 4 + j * 4;
                const brightness = 0.34 * data[pos] + 0.5 * data[pos + 1] + 0.16 * data[pos + 2];
                if (brightness > 0x7f) {
                    this.vram[i] |= 0x1 << j;
                }
            }
        }
        this.writeVram();
    }
    dots(data) {
        for (let i = 0; i < this.height; i++) {
            this.vram[i] = data[i];
        }
        this.writeVram();
    }
    writeVram() {
        const data = [0x00];
        for (let i = 0; i < this.height; i++) {
            data.push(this.vram[i] & 0xff);
            data.push((this.vram[i] >> 8) & 0xff);
        }
        this.i2c.write(this.address, data);
    }
    prepareVram(width, height) {
        this.vram = [];
        for (let i = 0; i < height; i++) {
            this.vram.push(0);
        }
    }
}
exports.default = MatrixLED_HT16K33;

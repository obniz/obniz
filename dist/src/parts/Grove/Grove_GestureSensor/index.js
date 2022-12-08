"use strict";
/**
 * @packageDocumentation
 * @module Parts.Grove_GestureSensor
 */
Object.defineProperty(exports, "__esModule", { value: true });
class Grove_GestureSensor {
    constructor() {
        this.GESTURE_RIGHT = 'GESTURE_RIGHT';
        this.GESTURE_LEFT = 'GESTURE_LEFT';
        this.GESTURE_UP = 'GESTURE_UP';
        this.GESTURE_DOWN = 'GESTURE_DOWN';
        this.GESTURE_FORWARD = 'GESTURE_FORWARD';
        this.GESTURE_BACKWARD = 'GESTURE_BACKWARD';
        this.GESTURE_CLOCKWISE = 'GESTURE_CLOCKWISE';
        this.GESTURE_COUNT_CLOCKWISE = 'GESTURE_COUNT_CLOCKWISE';
        this.ic2Address = 0x73;
        this.PAJ7620_ADDR_BASE = 0x00;
        this.PAJ7620_REGITER_BANK_SEL = this.PAJ7620_ADDR_BASE + 0xef;
        this.PAJ7620_BANK0 = 0 << 0;
        this.PAJ7620_BANK1 = 1 << 0;
        this.GES_RIGHT_FLAG = 1 << 0; // PAJ7620_VAL(1,0)
        this.GES_LEFT_FLAG = 1 << 1; // PAJ7620_VAL(1,1)
        this.GES_UP_FLAG = 1 << 2; // PAJ7620_VAL(1,2)
        this.GES_DOWN_FLAG = 1 << 3; // PAJ7620_VAL(1,3)
        this.GES_FORWARD_FLAG = 1 << 4; // PAJ7620_VAL(1,4)
        this.GES_BACKWARD_FLAG = 1 << 5; // PAJ7620_VAL(1,5)
        this.GES_CLOCKWISE_FLAG = 1 << 6; // PAJ7620_VAL(1,6)
        this.GES_COUNT_CLOCKWISE_FLAG = 1 << 7; // PAJ7620_VAL(1,7)
        this.GES_WAVE_FLAG = 1 << 8; // PAJ7620_VAL(1,0)
        this.initRegisterArray = [
            [0xef, 0x00],
            [0x32, 0x29],
            [0x33, 0x01],
            [0x34, 0x00],
            [0x35, 0x01],
            [0x36, 0x00],
            [0x37, 0x07],
            [0x38, 0x17],
            [0x39, 0x06],
            [0x3a, 0x12],
            [0x3f, 0x00],
            [0x40, 0x02],
            [0x41, 0xff],
            [0x42, 0x01],
            [0x46, 0x2d],
            [0x47, 0x0f],
            [0x48, 0x3c],
            [0x49, 0x00],
            [0x4a, 0x1e],
            [0x4b, 0x00],
            [0x4c, 0x20],
            [0x4d, 0x00],
            [0x4e, 0x1a],
            [0x4f, 0x14],
            [0x50, 0x00],
            [0x51, 0x10],
            [0x52, 0x00],
            [0x5c, 0x02],
            [0x5d, 0x00],
            [0x5e, 0x10],
            [0x5f, 0x3f],
            [0x60, 0x27],
            [0x61, 0x28],
            [0x62, 0x00],
            [0x63, 0x03],
            [0x64, 0xf7],
            [0x65, 0x03],
            [0x66, 0xd9],
            [0x67, 0x03],
            [0x68, 0x01],
            [0x69, 0xc8],
            [0x6a, 0x40],
            [0x6d, 0x04],
            [0x6e, 0x00],
            [0x6f, 0x00],
            [0x70, 0x80],
            [0x71, 0x00],
            [0x72, 0x00],
            [0x73, 0x00],
            [0x74, 0xf0],
            [0x75, 0x00],
            [0x80, 0x42],
            [0x81, 0x44],
            [0x82, 0x04],
            [0x83, 0x20],
            [0x84, 0x20],
            [0x85, 0x00],
            [0x86, 0x10],
            [0x87, 0x00],
            [0x88, 0x05],
            [0x89, 0x18],
            [0x8a, 0x10],
            [0x8b, 0x01],
            [0x8c, 0x37],
            [0x8d, 0x00],
            [0x8e, 0xf0],
            [0x8f, 0x81],
            [0x90, 0x06],
            [0x91, 0x06],
            [0x92, 0x1e],
            [0x93, 0x0d],
            [0x94, 0x0a],
            [0x95, 0x0a],
            [0x96, 0x0c],
            [0x97, 0x05],
            [0x98, 0x0a],
            [0x99, 0x41],
            [0x9a, 0x14],
            [0x9b, 0x0a],
            [0x9c, 0x3f],
            [0x9d, 0x33],
            [0x9e, 0xae],
            [0x9f, 0xf9],
            [0xa0, 0x48],
            [0xa1, 0x13],
            [0xa2, 0x10],
            [0xa3, 0x08],
            [0xa4, 0x30],
            [0xa5, 0x19],
            [0xa6, 0x10],
            [0xa7, 0x08],
            [0xa8, 0x24],
            [0xa9, 0x04],
            [0xaa, 0x1e],
            [0xab, 0x1e],
            [0xcc, 0x19],
            [0xcd, 0x0b],
            [0xce, 0x13],
            [0xcf, 0x64],
            [0xd0, 0x21],
            [0xd1, 0x0f],
            [0xd2, 0x88],
            [0xe0, 0x01],
            [0xe1, 0x04],
            [0xe2, 0x41],
            [0xe3, 0xd6],
            [0xe4, 0x00],
            [0xe5, 0x0c],
            [0xe6, 0x0a],
            [0xe7, 0x00],
            [0xe8, 0x00],
            [0xe9, 0x00],
            [0xee, 0x07],
            [0xef, 0x01],
            [0x00, 0x1e],
            [0x01, 0x1e],
            [0x02, 0x0f],
            [0x03, 0x10],
            [0x04, 0x02],
            [0x05, 0x00],
            [0x06, 0xb0],
            [0x07, 0x04],
            [0x08, 0x0d],
            [0x09, 0x0e],
            [0x0a, 0x9c],
            [0x0b, 0x04],
            [0x0c, 0x05],
            [0x0d, 0x0f],
            [0x0e, 0x02],
            [0x0f, 0x12],
            [0x10, 0x02],
            [0x11, 0x02],
            [0x12, 0x00],
            [0x13, 0x01],
            [0x14, 0x05],
            [0x15, 0x07],
            [0x16, 0x05],
            [0x17, 0x07],
            [0x18, 0x01],
            [0x19, 0x04],
            [0x1a, 0x05],
            [0x1b, 0x0c],
            [0x1c, 0x2a],
            [0x1d, 0x01],
            [0x1e, 0x00],
            [0x21, 0x00],
            [0x22, 0x00],
            [0x23, 0x00],
            [0x25, 0x01],
            [0x26, 0x00],
            [0x27, 0x39],
            [0x28, 0x7f],
            [0x29, 0x08],
            [0x30, 0x03],
            [0x31, 0x00],
            [0x32, 0x1a],
            [0x33, 0x1a],
            [0x34, 0x07],
            [0x35, 0x07],
            [0x36, 0x01],
            [0x37, 0xff],
            [0x38, 0x36],
            [0x39, 0x07],
            [0x3a, 0x00],
            [0x3e, 0xff],
            [0x3f, 0x00],
            [0x40, 0x77],
            [0x41, 0x40],
            [0x42, 0x00],
            [0x43, 0x30],
            [0x44, 0xa0],
            [0x45, 0x5c],
            [0x46, 0x00],
            [0x47, 0x00],
            [0x48, 0x58],
            [0x4a, 0x1e],
            [0x4b, 0x1e],
            [0x4c, 0x00],
            [0x4d, 0x00],
            [0x4e, 0xa0],
            [0x4f, 0x80],
            [0x50, 0x00],
            [0x51, 0x00],
            [0x52, 0x00],
            [0x53, 0x00],
            [0x54, 0x00],
            [0x57, 0x80],
            [0x59, 0x10],
            [0x5a, 0x08],
            [0x5b, 0x94],
            [0x5c, 0xe8],
            [0x5d, 0x08],
            [0x5e, 0x3d],
            [0x5f, 0x99],
            [0x60, 0x45],
            [0x61, 0x40],
            [0x63, 0x2d],
            [0x64, 0x02],
            [0x65, 0x96],
            [0x66, 0x00],
            [0x67, 0x97],
            [0x68, 0x01],
            [0x69, 0xcd],
            [0x6a, 0x01],
            [0x6b, 0xb0],
            [0x6c, 0x04],
            [0x6d, 0x2c],
            [0x6e, 0x01],
            [0x6f, 0x32],
            [0x71, 0x00],
            [0x72, 0x01],
            [0x73, 0x35],
            [0x74, 0x00],
            [0x75, 0x33],
            [0x76, 0x31],
            [0x77, 0x01],
            [0x7c, 0x84],
            [0x7d, 0x03],
            [0x7e, 0x01],
        ];
        this.keys = ['vcc', 'gnd', 'sda', 'scl', 'i2c', 'grove'];
        this.requiredKeys = [];
    }
    static info() {
        return {
            name: 'Grove_GestureSensor',
        };
    }
    onchange(value) {
        // do nothing.
    }
    wired(obniz) {
        this.obniz = obniz;
        const speed = 400000;
        if (this.params.grove) {
            this.i2c = this.params.grove.getI2c(speed, '5v');
        }
        else {
            this.obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
            this.params.mode = 'master';
            this.params.clock = speed;
            this.params.pull = '5v';
            this.i2c = this.obniz.getI2CWithConfig(this.params);
        }
        this.i2c.onerror = (err) => {
            // console.log('Error:', err);
        };
        // await obniz.wait(700);
        this.initWait();
    }
    async initWait() {
        // wakeup check
        await this.checkWakeUpWait();
        // initRegister
        await this.initRegisterWait();
        while (true) {
            // get data
            this.i2c.write(this.ic2Address, [0x43]);
            const resArray = await this.i2c.readWait(this.ic2Address, 1);
            const res = resArray[0];
            if (this.onchange) {
                if (this.GES_RIGHT_FLAG === res) {
                    // console.log("GES_RIGHT_FLAG");
                    this.onchange(this.GESTURE_RIGHT);
                }
                else if (this.GES_LEFT_FLAG === res) {
                    // console.log("GES_LEFT_FLAG");
                    this.onchange(this.GESTURE_LEFT);
                }
                else if (this.GES_UP_FLAG === res) {
                    // console.log("GES_UP_FLAG");
                    this.onchange(this.GESTURE_UP);
                }
                else if (this.GES_DOWN_FLAG === res) {
                    // console.log("GES_DOWN_FLAG");
                    this.onchange(this.GESTURE_DOWN);
                }
                else if (this.GES_FORWARD_FLAG === res) {
                    // console.log("GES_FORWARD_FLAG");
                    this.onchange(this.GESTURE_FORWARD);
                }
                else if (this.GES_BACKWARD_FLAG === res) {
                    // console.log("GES_BACKWARD_FLAG");
                    this.onchange(this.GESTURE_BACKWARD);
                }
                else if (this.GES_CLOCKWISE_FLAG === res) {
                    // console.log("GES_CLOCKWISE_FLAG");
                    this.onchange(this.GESTURE_CLOCKWISE);
                }
                else if (this.GES_COUNT_CLOCKWISE_FLAG === res) {
                    // console.log("GES_COUNT_CLOCKWISE_FLAG");
                    this.onchange(this.GESTURE_COUNT_CLOCKWISE);
                }
            }
            await this.obniz.wait(1000);
        }
    }
    async checkWakeUpWait() {
        // wakeup check
        this.i2c.write(this.ic2Address, [
            this.PAJ7620_REGITER_BANK_SEL,
            this.PAJ7620_BANK0,
        ]);
        let res = [0, 0];
        try {
            res = await this.i2c.readWait(this.ic2Address, 1);
        }
        catch (e) {
            // console.log(e);
        }
        if (res[0] === 0x20) {
            // console.log("wake-up finish.");
        }
    }
    async initRegisterWait() {
        // console.log("initRegister!!");
        for (let i = 0; i < this.initRegisterArray.length; i++) {
            this.i2c.write(this.ic2Address, this.initRegisterArray[i]);
        }
        // Set up gaming mode.
        this.i2c.write(this.ic2Address, [
            this.PAJ7620_REGITER_BANK_SEL,
            this.PAJ7620_BANK1,
        ]);
        // near mode 240 fps
        this.i2c.write(this.ic2Address, [0x65, 0x12]);
        this.i2c.write(this.ic2Address, [
            this.PAJ7620_REGITER_BANK_SEL,
            this.PAJ7620_BANK0,
        ]);
    }
}
exports.default = Grove_GestureSensor;

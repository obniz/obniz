"use strict";
/**
 * @packageDocumentation
 * @module Parts.Grove_MP3
 */
Object.defineProperty(exports, "__esModule", { value: true });
class Grove_MP3 {
    constructor() {
        this.keys = ['vcc', 'gnd', 'mp3_rx', 'mp3_tx', 'grove'];
        this.requiredKeys = [];
        this.ioKeys = this.keys;
        this.displayName = 'MP3';
        this.displayIoNames = { mp3_rx: 'MP3Rx', mp3_tx: 'MP3Tx' };
    }
    static info() {
        return {
            name: 'Grove_MP3',
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        if (this.params.grove) {
            this.uart = this.params.grove.getUart(9600, '5v');
        }
        else {
            obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
            this.my_tx = this.params.mp3_rx;
            this.my_rx = this.params.mp3_tx;
            this.uart = this.obniz.getFreeUart();
            this.uart.start({
                tx: this.my_tx,
                rx: this.my_rx,
                baud: 9600,
            });
        }
    }
    async initWait(strage) {
        await this.obniz.wait(100);
        this.uartSend(0x0c, 0);
        await this.obniz.wait(500);
        this.uartSend(0x0b, 0);
        await this.obniz.wait(100);
        if (strage) {
            if (strage === 'usb') {
                this.uartSend(0x09, 1);
            }
            else if (strage === 'sd') {
                this.uartSend(0x09, 2);
            }
        }
        else {
            this.uartSend(0x09, 2);
        }
        await this.obniz.wait(200);
    }
    setVolume(vol) {
        if (vol >= 0 && vol <= 31) {
            this.uartSend(0x06, vol);
        }
    }
    volUp() {
        this.uartSend(0x04, 0);
    }
    volDown() {
        this.uartSend(0x05, 0);
    }
    play(track, folder) {
        // if (!folder) folder = {};
        if (folder) {
            this.uart.send([0x7e, 0xff, 0x06, 0x0f, 0x00, folder, track, 0xef]);
        }
        else {
            // Play 'MP3' folder
            this.uartSend(0x12, track);
        }
    }
    stop() {
        this.uartSend(0x16, 0);
    }
    pause() {
        this.uartSend(0x0e, 0);
    }
    resume() {
        this.uartSend(0x0d, 0);
    }
    next() {
        this.uartSend(0x01, 0);
    }
    prev() {
        this.uartSend(0x02, 0);
    }
    uartSend(command, param) {
        const paramM = param >> 8;
        const paramL = param & 0xff;
        this.uart.send([0x7e, 0xff, 0x06, command, 0x01, paramM, paramL, 0xef]);
        const response = this.uart.readBytes();
        return response;
        // return response;
    }
}
exports.default = Grove_MP3;

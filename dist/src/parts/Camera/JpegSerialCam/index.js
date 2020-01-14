"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class JpegSerialCam {
    constructor() {
        this.keys = ["vcc", "cam_tx", "cam_rx", "gnd"];
        this.requiredKeys = ["cam_tx", "cam_rx"];
        this.ioKeys = this.keys;
        this.displayName = "Jcam";
        this.displayIoNames = { cam_tx: "camTx", cam_rx: "camRx" };
    }
    static info() {
        return {
            name: "JpegSerialCam",
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
        this.my_tx = this.params.cam_rx;
        this.my_rx = this.params.cam_tx;
        this.obniz.getIO(this.my_tx).drive("3v");
        this.uart = this.obniz.getFreeUart();
    }
    _drainUntil(uart, search, recv) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!recv) {
                recv = [];
            }
            while (true) {
                const readed = uart.readBytes();
                recv = recv.concat(readed);
                const tail = this._seekTail(search, recv);
                if (tail >= 0) {
                    recv.splice(0, tail);
                    return recv;
                }
                yield this.obniz.wait(10);
            }
        });
    }
    _seekTail(search, src) {
        let f = 0;
        for (let i = 0; i < src.length; i++) {
            if (src[i] === search[f]) {
                f++;
                if (f === search.length) {
                    return i + 1;
                }
            }
            else {
                f = 0;
            }
        }
        return -1;
    }
    arrayToBase64(array) {
        return Buffer.from(array).toString("base64");
    }
    startWait(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!obj) {
                obj = {};
            }
            this.uart.start({
                tx: this.my_tx,
                rx: this.my_rx,
                baud: obj.baud || 38400,
            });
            this.obniz.display.setPinName(this.my_tx, "JpegSerialCam", "camRx");
            this.obniz.display.setPinName(this.my_rx, "JpegSerialCam", "camTx");
            yield this.obniz.wait(2500);
        });
    }
    resetwait() {
        return __awaiter(this, void 0, void 0, function* () {
            this.uart.send([0x56, 0x00, 0x26, 0x00]);
            yield this._drainUntil(this.uart, [0x76, 0x00, 0x26, 0x00]);
            yield this.obniz.wait(2500);
        });
    }
    setSizeWait(resolution) {
        return __awaiter(this, void 0, void 0, function* () {
            let val;
            if (resolution === "640x480") {
                val = 0x00;
            }
            else if (resolution === "320x240") {
                val = 0x11;
            }
            else if (resolution === "160x120") {
                val = 0x22;
            }
            else {
                throw new Error("unsupported size");
            }
            this.uart.send([0x56, 0x00, 0x31, 0x05, 0x04, 0x01, 0x00, 0x19, val]);
            yield this._drainUntil(this.uart, [0x76, 0x00, 0x31, 0x00]);
            yield this.resetwait();
        });
    }
    setCompressibilityWait(compress) {
        return __awaiter(this, void 0, void 0, function* () {
            const val = Math.floor((compress / 100) * 0xff);
            this.uart.send([0x56, 0x00, 0x31, 0x05, 0x01, 0x01, 0x12, 0x04, val]);
            yield this._drainUntil(this.uart, [0x76, 0x00, 0x31, 0x00]);
            yield this.resetwait();
        });
    }
    setBaudWait(baud) {
        return __awaiter(this, void 0, void 0, function* () {
            let val;
            switch (baud) {
                case 9600:
                    val = [0xae, 0xc8];
                    break;
                case 19200:
                    val = [0x56, 0xe4];
                    break;
                case 38400:
                    val = [0x2a, 0xf2];
                    break;
                case 57600:
                    val = [0x1c, 0x4c];
                    break;
                case 115200:
                    val = [0x0d, 0xa6];
                    break;
                default:
                    throw new Error("invalid baud rate");
            }
            this.uart.send([
                0x56,
                0x00,
                0x31,
                0x06,
                0x04,
                0x02,
                0x00,
                0x08,
                val[0],
                val[1],
            ]);
            yield this._drainUntil(this.uart, [0x76, 0x00, 0x31, 0x00]);
            // await this.obniz.wait(1000);
            yield this.startWait({
                baud,
            });
        });
    }
    takeWait() {
        return __awaiter(this, void 0, void 0, function* () {
            const uart = this.uart;
            // console.log("stop a photo")
            uart.send([0x56, 0x00, 0x36, 0x01, 0x02]);
            yield this._drainUntil(uart, [0x76, 0x00, 0x36, 0x00, 0x00]);
            // console.log("take a photo")
            uart.send([0x56, 0x00, 0x36, 0x01, 0x00]);
            yield this._drainUntil(uart, [0x76, 0x00, 0x36, 0x00, 0x00]);
            // console.log("read length")
            uart.send([0x56, 0x00, 0x34, 0x01, 0x00]); // read length of image data
            let recv = yield this._drainUntil(uart, [
                0x76,
                0x00,
                0x34,
                0x00,
                0x04,
                0x00,
                0x00,
            ]); // ack
            let XX;
            let YY;
            while (true) {
                const readed = uart.readBytes();
                // console.log(recv);
                recv = recv.concat(readed);
                if (recv.length >= 2) {
                    XX = recv[0];
                    YY = recv[1];
                    break;
                }
                yield this.obniz.wait(1000);
            }
            const databytes = XX * 256 + YY;
            // console.log("image: " + databytes + " Bytes");
            // const high = (databytes >> 8) & 0xff;
            // const low = databytes & 0xff;
            // console.log("start reading image")
            uart.send([
                0x56,
                0x00,
                0x32,
                0x0c,
                0x00,
                0x0a,
                0x00,
                0x00,
                0x00,
                0x00,
                0x00,
                0x00,
                XX,
                YY,
                0x00,
                0xff,
            ]);
            recv = yield this._drainUntil(uart, [0x76, 0x00, 0x32, 0x00, 0x00]);
            // console.log("reading...");
            while (true) {
                const readed = uart.readBytes();
                recv = recv.concat(readed);
                // console.log(readed.length);
                if (recv.length >= databytes) {
                    break;
                }
                yield this.obniz.wait(10);
            }
            // console.log("done");
            recv = recv.splice(0, databytes); // remove tail
            recv = recv.concat([0xff, 0xd9]);
            return recv;
        });
    }
}
exports.default = JpegSerialCam;

//# sourceMappingURL=index.js.map
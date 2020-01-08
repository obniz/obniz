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
class JpegSerialCam {
    constructor() {
        this.keys = ['vcc', 'cam_tx', 'cam_rx', 'gnd'];
        this.requiredKeys = ['cam_tx', 'cam_rx'];
        this.ioKeys = this.keys;
        this.displayName = 'Jcam';
        this.displayIoNames = { cam_tx: 'camTx', cam_rx: 'camRx' };
    }
    static info() {
        return {
            name: 'JpegSerialCam',
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        this.obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
        this.my_tx = this.params.cam_rx;
        this.my_rx = this.params.cam_tx;
        this.obniz.getIO(this.my_tx).drive('3v');
        this.uart = this.obniz.getFreeUart();
    }
    _drainUntil(uart, search, recv) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!recv)
                recv = [];
            while (true) {
                let readed = uart.readBytes();
                recv = recv.concat(readed);
                let tail = this._seekTail(search, recv);
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
        return Buffer.from(array).toString('base64');
    }
    startWait(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!obj)
                obj = {};
            this.uart.start({
                tx: this.my_tx,
                rx: this.my_rx,
                baud: obj.baud || 38400,
            });
            this.obniz.display.setPinName(this.my_tx, 'JpegSerialCam', 'camRx');
            this.obniz.display.setPinName(this.my_rx, 'JpegSerialCam', 'camTx');
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
            if (resolution === '640x480') {
                val = 0x00;
            }
            else if (resolution === '320x240') {
                val = 0x11;
            }
            else if (resolution === '160x120') {
                val = 0x22;
            }
            else {
                throw new Error('unsupported size');
            }
            this.uart.send([0x56, 0x00, 0x31, 0x05, 0x04, 0x01, 0x00, 0x19, val]);
            yield this._drainUntil(this.uart, [0x76, 0x00, 0x31, 0x00]);
            yield this.resetwait();
        });
    }
    setCompressibilityWait(compress) {
        return __awaiter(this, void 0, void 0, function* () {
            let val = Math.floor((compress / 100) * 0xff);
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
                    throw new Error('invalid baud rate');
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
            //await this.obniz.wait(1000);
            yield this.startWait({
                baud,
            });
        });
    }
    takeWait() {
        return __awaiter(this, void 0, void 0, function* () {
            const uart = this.uart;
            //console.log("stop a photo")
            uart.send([0x56, 0x00, 0x36, 0x01, 0x02]);
            yield this._drainUntil(uart, [0x76, 0x00, 0x36, 0x00, 0x00]);
            //console.log("take a photo")
            uart.send([0x56, 0x00, 0x36, 0x01, 0x00]);
            yield this._drainUntil(uart, [0x76, 0x00, 0x36, 0x00, 0x00]);
            //console.log("read length")
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
                let readed = uart.readBytes();
                //console.log(recv);
                recv = recv.concat(readed);
                if (recv.length >= 2) {
                    XX = recv[0];
                    YY = recv[1];
                    break;
                }
                yield this.obniz.wait(1000);
            }
            let databytes = XX * 256 + YY;
            //console.log("image: " + databytes + " Bytes");
            // const high = (databytes >> 8) & 0xff;
            // const low = databytes & 0xff;
            //console.log("start reading image")
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
            //console.log("reading...");
            while (true) {
                let readed = uart.readBytes();
                recv = recv.concat(readed);
                //console.log(readed.length);
                if (recv.length >= databytes) {
                    break;
                }
                yield this.obniz.wait(10);
            }
            //console.log("done");
            recv = recv.splice(0, databytes); // remove tail
            recv = recv.concat([0xff, 0xd9]);
            return recv;
        });
    }
}
if (typeof module === 'object') {
    module.exports = JpegSerialCam;
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9DYW1lcmEvSnBlZ1NlcmlhbENhbS9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsTUFBTSxhQUFhO0lBQ2pCO1FBQ0UsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQy9DLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFFekMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDO1FBQzFCLElBQUksQ0FBQyxjQUFjLEdBQUcsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsQ0FBQztJQUM3RCxDQUFDO0lBRUQsTUFBTSxDQUFDLElBQUk7UUFDVCxPQUFPO1lBQ0wsSUFBSSxFQUFFLGVBQWU7U0FDdEIsQ0FBQztJQUNKLENBQUM7SUFFRCxLQUFLLENBQUMsS0FBSztRQUNULElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzdELElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDaEMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUVoQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXpDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUss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RSxDQUFDLENBQUM7YUFDM0I7WUFDRCxzQkFBc0I7WUFDdEIsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsY0FBYztZQUNoRCxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQztLQUFBO0NBQ0Y7QUFFRCxJQUFJLE9BQU8sTUFBTSxLQUFLLFFBQVEsRUFBRTtJQUM5QixNQUFNLENBQUMsT0FBTyxHQUFHLGFBQWEsQ0FBQztDQUNoQyIsImZpbGUiOiJwYXJ0cy9DYW1lcmEvSnBlZ1NlcmlhbENhbS9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIEpwZWdTZXJpYWxDYW0ge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmtleXMgPSBbJ3ZjYycsICdjYW1fdHgnLCAnY2FtX3J4JywgJ2duZCddO1xuICAgIHRoaXMucmVxdWlyZWRLZXlzID0gWydjYW1fdHgnLCAnY2FtX3J4J107XG5cbiAgICB0aGlzLmlvS2V5cyA9IHRoaXMua2V5cztcbiAgICB0aGlzLmRpc3BsYXlOYW1lID0gJ0pjYW0nO1xuICAgIHRoaXMuZGlzcGxheUlvTmFtZXMgPSB7IGNhbV90eDogJ2NhbVR4JywgY2FtX3J4OiAnY2FtUngnIH07XG4gIH1cblxuICBzdGF0aWMgaW5mbygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogJ0pwZWdTZXJpYWxDYW0nLFxuICAgIH07XG4gIH1cblxuICB3aXJlZChvYm5peikge1xuICAgIHRoaXMub2JuaXogPSBvYm5pejtcbiAgICB0aGlzLm9ibml6LnNldFZjY0duZCh0aGlzLnBhcmFtcy52Y2MsIHRoaXMucGFyYW1zLmduZCwgJzV2Jyk7XG4gICAgdGhpcy5teV90eCA9IHRoaXMucGFyYW1zLmNhbV9yeDtcbiAgICB0aGlzLm15X3J4ID0gdGhpcy5wYXJhbXMuY2FtX3R4O1xuXG4gICAgdGhpcy5vYm5pei5nZXRJTyh0aGlzLm15X3R4KS5kcml2ZSgnM3YnKTtcblxuICAgIHRoaXMudWFydCA9IHRoaXMub2JuaXouZ2V0RnJlZVVhcnQoKTtcbiAgfVxuXG4gIGFzeW5jIF9kcmFpblVudGlsKHVhcnQsIHNlYXJjaCwgcmVjdikge1xuICAgIGlmICghcmVjdikgcmVjdiA9IFtdO1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBsZXQgcmVhZGVkID0gdWFydC5yZWFkQnl0ZXMoKTtcbiAgICAgIHJlY3YgPSByZWN2LmNvbmNhdChyZWFkZWQpO1xuICAgICAgbGV0IHRhaWwgPSB0aGlzLl9zZWVrVGFpbChzZWFyY2gsIHJlY3YpO1xuICAgICAgaWYgKHRhaWwgPj0gMCkge1xuICAgICAgICByZWN2LnNwbGljZSgwLCB0YWlsKTtcbiAgICAgICAgcmV0dXJuIHJlY3Y7XG4gICAgICB9XG4gICAgICBhd2FpdCB0aGlzLm9ibml6LndhaXQoMTApO1xuICAgIH1cbiAgfVxuXG4gIF9zZWVrVGFpbChzZWFyY2gsIHNyYykge1xuICAgIGxldCBmID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNyYy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHNyY1tpXSA9PT0gc2VhcmNoW2ZdKSB7XG4gICAgICAgIGYrKztcbiAgICAgICAgaWYgKGYgPT09IHNlYXJjaC5sZW5ndGgpIHtcbiAgICAgICAgICByZXR1cm4gaSArIDE7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGYgPSAwO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gLTE7XG4gIH1cblxuICBhcnJheVRvQmFzZTY0KGFycmF5KSB7XG4gICAgcmV0dXJuIEJ1ZmZlci5mcm9tKGFycmF5KS50b1N0cmluZygnYmFzZTY0Jyk7XG4gIH1cblxuICBhc3luYyBzdGFydFdhaXQob2JqKSB7XG4gICAgaWYgKCFvYmopIG9iaiA9IHt9O1xuICAgIHRoaXMudWFydC5zdGFydCh7XG4gICAgICB0eDogdGhpcy5teV90eCxcbiAgICAgIHJ4OiB0aGlzLm15X3J4LFxuICAgICAgYmF1ZDogb2JqLmJhdWQgfHwgMzg0MDAsXG4gICAgfSk7XG4gICAgdGhpcy5vYm5pei5kaXNwbGF5LnNldFBpbk5hbWUodGhpcy5teV90eCwgJ0pwZWdTZXJpYWxDYW0nLCAnY2FtUngnKTtcbiAgICB0aGlzLm9ibml6LmRpc3BsYXkuc2V0UGluTmFtZSh0aGlzLm15X3J4LCAnSnBlZ1NlcmlhbENhbScsICdjYW1UeCcpO1xuICAgIGF3YWl0IHRoaXMub2JuaXoud2FpdCgyNTAwKTtcbiAgfVxuXG4gIGFzeW5jIHJlc2V0d2FpdCgpIHtcbiAgICB0aGlzLnVhcnQuc2VuZChbMHg1NiwgMHgwMCwgMHgyNiwgMHgwMF0pO1xuICAgIGF3YWl0IHRoaXMuX2RyYWluVW50aWwodGhpcy51YXJ0LCBbMHg3NiwgMHgwMCwgMHgyNiwgMHgwMF0pO1xuICAgIGF3YWl0IHRoaXMub2JuaXoud2FpdCgyNTAwKTtcbiAgfVxuXG4gIGFzeW5jIHNldFNpemVXYWl0KHJlc29sdXRpb24pIHtcbiAgICBsZXQgdmFsO1xuICAgIGlmIChyZXNvbHV0aW9uID09PSAnNjQweDQ4MCcpIHtcbiAgICAgIHZhbCA9IDB4MDA7XG4gICAgfSBlbHNlIGlmIChyZXNvbHV0aW9uID09PSAnMzIweDI0MCcpIHtcbiAgICAgIHZhbCA9IDB4MTE7XG4gICAgfSBlbHNlIGlmIChyZXNvbHV0aW9uID09PSAnMTYweDEyMCcpIHtcbiAgICAgIHZhbCA9IDB4MjI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcigndW5zdXBwb3J0ZWQgc2l6ZScpO1xuICAgIH1cbiAgICB0aGlzLnVhcnQuc2VuZChbMHg1NiwgMHgwMCwgMHgzMSwgMHgwNSwgMHgwNCwgMHgwMSwgMHgwMCwgMHgxOSwgdmFsXSk7XG4gICAgYXdhaXQgdGhpcy5fZHJhaW5VbnRpbCh0aGlzLnVhcnQsIFsweDc2LCAweDAwLCAweDMxLCAweDAwXSk7XG4gICAgYXdhaXQgdGhpcy5yZXNldHdhaXQoKTtcbiAgfVxuXG4gIGFzeW5jIHNldENvbXByZXNzaWJpbGl0eVdhaXQoY29tcHJlc3MpIHtcbiAgICBsZXQgdmFsID0gTWF0aC5mbG9vcigoY29tcHJlc3MgLyAxMDApICogMHhmZik7XG4gICAgdGhpcy51YXJ0LnNlbmQoWzB4NTYsIDB4MDAsIDB4MzEsIDB4MDUsIDB4MDEsIDB4MDEsIDB4MTIsIDB4MDQsIHZhbF0pO1xuICAgIGF3YWl0IHRoaXMuX2RyYWluVW50aWwodGhpcy51YXJ0LCBbMHg3NiwgMHgwMCwgMHgzMSwgMHgwMF0pO1xuICAgIGF3YWl0IHRoaXMucmVzZXR3YWl0KCk7XG4gIH1cblxuICBhc3luYyBzZXRCYXVkV2FpdChiYXVkKSB7XG4gICAgbGV0IHZhbDtcbiAgICBzd2l0Y2ggKGJhdWQpIHtcbiAgICAgIGNhc2UgOTYwMDpcbiAgICAgICAgdmFsID0gWzB4YWUsIDB4YzhdO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMTkyMDA6XG4gICAgICAgIHZhbCA9IFsweDU2LCAweGU0XTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM4NDAwOlxuICAgICAgICB2YWwgPSBbMHgyYSwgMHhmMl07XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSA1NzYwMDpcbiAgICAgICAgdmFsID0gWzB4MWMsIDB4NGNdO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMTE1MjAwOlxuICAgICAgICB2YWwgPSBbMHgwZCwgMHhhNl07XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIGJhdWQgcmF0ZScpO1xuICAgIH1cbiAgICB0aGlzLnVhcnQuc2VuZChbXG4gICAgICAweDU2LFxuICAgICAgMHgwMCxcbiAgICAgIDB4MzEsXG4gICAgICAweDA2LFxuICAgICAgMHgwNCxcbiAgICAgIDB4MDIsXG4gICAgICAweDAwLFxuICAgICAgMHgwOCxcbiAgICAgIHZhbFswXSxcbiAgICAgIHZhbFsxXSxcbiAgICBdKTtcbiAgICBhd2FpdCB0aGlzLl9kcmFpblVudGlsKHRoaXMudWFydCwgWzB4NzYsIDB4MDAsIDB4MzEsIDB4MDBdKTtcbiAgICAvL2F3YWl0IHRoaXMub2JuaXoud2FpdCgxMDAwKTtcbiAgICBhd2FpdCB0aGlzLnN0YXJ0V2FpdCh7XG4gICAgICBiYXVkLFxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgdGFrZVdhaXQoKSB7XG4gICAgY29uc3QgdWFydCA9IHRoaXMudWFydDtcbiAgICAvL2NvbnNvbGUubG9nKFwic3RvcCBhIHBob3RvXCIpXG4gICAgdWFydC5zZW5kKFsweDU2LCAweDAwLCAweDM2LCAweDAxLCAweDAyXSk7XG4gICAgYXdhaXQgdGhpcy5fZHJhaW5VbnRpbCh1YXJ0LCBbMHg3NiwgMHgwMCwgMHgzNiwgMHgwMCwgMHgwMF0pO1xuXG4gICAgLy9jb25zb2xlLmxvZyhcInRha2UgYSBwaG90b1wiKVxuICAgIHVhcnQuc2VuZChbMHg1NiwgMHgwMCwgMHgzNiwgMHgwMSwgMHgwMF0pO1xuICAgIGF3YWl0IHRoaXMuX2RyYWluVW50aWwodWFydCwgWzB4NzYsIDB4MDAsIDB4MzYsIDB4MDAsIDB4MDBdKTtcblxuICAgIC8vY29uc29sZS5sb2coXCJyZWFkIGxlbmd0aFwiKVxuICAgIHVhcnQuc2VuZChbMHg1NiwgMHgwMCwgMHgzNCwgMHgwMSwgMHgwMF0pOyAvLyByZWFkIGxlbmd0aCBvZiBpbWFnZSBkYXRhXG4gICAgbGV0IHJlY3YgPSBhd2FpdCB0aGlzLl9kcmFpblVudGlsKHVhcnQsIFtcbiAgICAgIDB4NzYsXG4gICAgICAweDAwLFxuICAgICAgMHgzNCxcbiAgICAgIDB4MDAsXG4gICAgICAweDA0LFxuICAgICAgMHgwMCxcbiAgICAgIDB4MDAsXG4gICAgXSk7IC8vIGFja1xuICAgIGxldCBYWDtcbiAgICBsZXQgWVk7XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIGxldCByZWFkZWQgPSB1YXJ0LnJlYWRCeXRlcygpO1xuICAgICAgLy9jb25zb2xlLmxvZyhyZWN2KTtcbiAgICAgIHJlY3YgPSByZWN2LmNvbmNhdChyZWFkZWQpO1xuICAgICAgaWYgKHJlY3YubGVuZ3RoID49IDIpIHtcbiAgICAgICAgWFggPSByZWN2WzBdO1xuICAgICAgICBZWSA9IHJlY3ZbMV07XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgYXdhaXQgdGhpcy5vYm5pei53YWl0KDEwMDApO1xuICAgIH1cbiAgICBsZXQgZGF0YWJ5dGVzID0gWFggKiAyNTYgKyBZWTtcbiAgICAvL2NvbnNvbGUubG9nKFwiaW1hZ2U6IFwiICsgZGF0YWJ5dGVzICsgXCIgQnl0ZXNcIik7XG4gICAgLy8gY29uc3QgaGlnaCA9IChkYXRhYnl0ZXMgPj4gOCkgJiAweGZmO1xuICAgIC8vIGNvbnN0IGxvdyA9IGRhdGFieXRlcyAmIDB4ZmY7XG5cbiAgICAvL2NvbnNvbGUubG9nKFwic3RhcnQgcmVhZGluZyBpbWFnZVwiKVxuICAgIHVhcnQuc2VuZChbXG4gICAgICAweDU2LFxuICAgICAgMHgwMCxcbiAgICAgIDB4MzIsXG4gICAgICAweDBjLFxuICAgICAgMHgwMCxcbiAgICAgIDB4MGEsXG4gICAgICAweDAwLFxuICAgICAgMHgwMCxcbiAgICAgIDB4MDAsXG4gICAgICAweDAwLFxuICAgICAgMHgwMCxcbiAgICAgIDB4MDAsXG4gICAgICBYWCxcbiAgICAgIFlZLFxuICAgICAgMHgwMCxcbiAgICAgIDB4ZmYsXG4gICAgXSk7XG4gICAgcmVjdiA9IGF3YWl0IHRoaXMuX2RyYWluVW50aWwodWFydCwgWzB4NzYsIDB4MDAsIDB4MzIsIDB4MDAsIDB4MDBdKTtcbiAgICAvL2NvbnNvbGUubG9nKFwicmVhZGluZy4uLlwiKTtcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgbGV0IHJlYWRlZCA9IHVhcnQucmVhZEJ5dGVzKCk7XG4gICAgICByZWN2ID0gcmVjdi5jb25jYXQocmVhZGVkKTtcbiAgICAgIC8vY29uc29sZS5sb2cocmVhZGVkLmxlbmd0aCk7XG4gICAgICBpZiAocmVjdi5sZW5ndGggPj0gZGF0YWJ5dGVzKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgYXdhaXQgdGhpcy5vYm5pei53YWl0KDEwKTtcbiAgICB9XG4gICAgLy9jb25zb2xlLmxvZyhcImRvbmVcIik7XG4gICAgcmVjdiA9IHJlY3Yuc3BsaWNlKDAsIGRhdGFieXRlcyk7IC8vIHJlbW92ZSB0YWlsXG4gICAgcmVjdiA9IHJlY3YuY29uY2F0KFsweGZmLCAweGQ5XSk7XG4gICAgcmV0dXJuIHJlY3Y7XG4gIH1cbn1cblxuaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gSnBlZ1NlcmlhbENhbTtcbn1cbiJdfQ==

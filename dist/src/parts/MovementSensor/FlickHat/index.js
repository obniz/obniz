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
class FlickHat {
    constructor() {
        this.keys = ["vcc", "gnd", "sda", "scl", "reset", "ts", "led1", "led2"];
        this.requiredKeys = ["gnd", "sda", "scl", "reset", "ts"];
        this.displayIoNames = {
            // vcc: 'vcc', //5v
            sda: "sda",
            scl: "scl",
            gnd: "gnd",
            reset: "reset",
            ts: "ts",
        };
    }
    static info() {
        return {
            name: "FlickHat",
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        this.address = 0x42;
        if (this.obniz.isValidIO(this.params.vcc)) {
            this.obniz.getIO(this.params.vcc).drive("5v");
            this.obniz.getIO(this.params.vcc).output(true);
        }
        this.obniz.getIO(this.params.gnd).output(false);
        this.io_reset = this.obniz.getIO(this.params.reset);
        this.io_reset.drive("3v");
        this.io_ts = this.obniz.getIO(this.params.ts);
        this.io_ts.drive("open-drain");
        this.io_ts.pull("3v");
        this.params.mode = "master";
        this.params.pull = "3v";
        this.params.clock = 100 * 1000; // 100KHz
        // PeripheralI2C
        this.i2c = this.obniz.getI2CWithConfig(this.params);
        if (this.obniz.isValidIO(this.params.led1)) {
            this.led1 = this.obniz.wired("LED", { anode: this.params.led1 });
        }
        if (this.obniz.isValidIO(this.params.led2)) {
            this.led2 = this.obniz.wired("LED", { anode: this.params.led2 });
        }
    }
    start(callbackFwInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            this.io_ts.pull("3v");
            this.io_reset.output(false);
            yield this.obniz.wait(50);
            this.io_reset.output(true);
            yield this.obniz.wait(50);
            this.onfwinfo = callbackFwInfo;
            this.fwInfo = {
                fwValid: 0,
                fwInfoReceived: false,
            };
            this.rotation = 0;
            this.lastRotation = 0;
            this.readSize = 132;
            yield this.polling();
            yield this.obniz.wait(200);
            this.i2c.write(this.address, [
                0x10,
                0x00,
                0x00,
                0xa2,
                0xa1,
                0x00,
                0x00,
                0x00,
                0x1f,
                0x00,
                0x00,
                0x00,
                0xff,
                0xff,
                0xff,
                0xff,
            ]);
            yield this.obniz.wait(100);
            this.i2c.write(this.address, [
                0x10,
                0x00,
                0x00,
                0xa2,
                0x80,
                0x00,
                0x00,
                0x00,
                0x3f,
                0x00,
                0x00,
                0x00,
                0x3f,
                0x00,
                0x00,
                0x00,
            ]);
        });
    }
    _dataArray2string(data) {
        let result = "";
        for (const n of data) {
            result += String.fromCharCode(n);
        }
        return result;
    }
    polling(timeout) {
        return __awaiter(this, void 0, void 0, function* () {
            timeout = timeout || 3000; // default: 3s
            // DataOutputConfigMask	2byte
            // const maskDSPStatus = 1;
            const maskGestureInfo = 1 << 1;
            const maskTouchInfo = 1 << 2;
            const maskAirWheelInfo = 1 << 3;
            const maskXYZPosition = 1 << 4;
            // SystemInfo	1byte
            const sysPositionValid = 1;
            const sysAirWheelValid = 1 << 1;
            // const sysDSPRunning = 1 << 7;
            const startTime = new Date();
            let ts = true;
            while (ts && new Date() - startTime < timeout) {
                ts = yield this.io_ts.inputWait();
            }
            if (!ts) {
                this.io_ts.pull("0v");
                // await this.obniz.wait(1);
                const data = yield this.i2c.readWait(this.address, this.readSize);
                const size = data[0];
                // let flag = data[1];
                const seq = data[2];
                const msgID = data[3];
                if (size !== 0xff && size > 0) {
                    if (this.debugprint || this.obniz.debugprint) {
                        console.log("flickHat: " + data.slice(0, size).map((v) => "0x" + v.toString(16)));
                    }
                    let configmask;
                    let sysinfo;
                    let gesture;
                    let touch;
                    let airwheel;
                    let statusInfo;
                    let fwInfo;
                    switch (msgID) {
                        case 0x91: // sensor data output
                            configmask = data[4] | (data[5] << 8); // little endian
                            // let timestamp = data[6]; // 200hz, 8-bit counter, max ~1.25sec
                            sysinfo = data[7];
                            // let dspstatus = data.slice(8, 10);
                            gesture = data.slice(10, 14);
                            touch = data.slice(14, 18);
                            airwheel = data.slice(18, 20);
                            // let xyz = data.slice(20, 26);
                            // let noisepow = data.slice(27, 30);
                            if (gesture[0] === 255 &&
                                gesture[1] === 255 &&
                                gesture[2] === 255 &&
                                gesture[3] === 255) {
                                break;
                            }
                            if (configmask & maskXYZPosition && sysinfo & sysPositionValid) {
                                const xyz = {
                                    // little endian
                                    x: (data[20] | (data[21] << 8)) / 65536,
                                    y: (data[22] | (data[23] << 8)) / 65536,
                                    z: (data[24] | (data[25] << 8)) / 65536,
                                    seq,
                                };
                                this.xyz = xyz;
                                if (typeof this.onxyz === "function") {
                                    this.onxyz(xyz);
                                }
                            }
                            if (configmask & maskGestureInfo && gesture[0] > 0) {
                                this.lastGesture = gesture[0];
                                const gestures = [
                                    ["", "", ""],
                                    ["garbage", "", ""],
                                    ["flick", "west", "east"],
                                    ["flick", "east", "west"],
                                    ["flick", "south", "north"],
                                    ["flick", "north", "south"],
                                    ["circle", "clockwise", ""],
                                    ["circle", "counter-clockwise", ""],
                                    ["wave", "x", ""],
                                    ["wave", "y", ""],
                                    ["hold", "", ""],
                                ];
                                for (const index in gestures) {
                                    if (index === gesture[0] &&
                                        typeof this.ongestureall === "function") {
                                        this.ongestureall({
                                            action: gestures[index][0],
                                            from: gestures[index][1],
                                            to: gestures[index][2],
                                            raw: gesture,
                                            seq,
                                        });
                                    }
                                    if (index === gesture[0] &&
                                        gestures[index][0] === "flick" &&
                                        typeof this.ongesture === "function") {
                                        this.ongesture({
                                            action: "gesture",
                                            from: gestures[index][1],
                                            to: gestures[index][2],
                                            raw: gesture,
                                            seq,
                                        });
                                    }
                                }
                            }
                            if (configmask & maskTouchInfo &&
                                !(touch[0] === 0 && touch[1] === 0) &&
                                touch[3] === 0) {
                                // console.log('touch: ' + touch.map(v => '0x' + v.toString(16)));
                                const touchAction = touch[0] | (touch[1] << 8); // little endian
                                if (touchAction === 0xffff) {
                                    break;
                                }
                                // let touchCount = touch[2] * 5; // touch counter value * 5[ms]
                                const actions = [
                                    ["touch", "south"],
                                    ["touch", "west"],
                                    ["touch", "north"],
                                    ["touch", "east"],
                                    ["touch", "center"],
                                    ["tap", "south"],
                                    ["tap", "west"],
                                    ["tap", "north"],
                                    ["tap", "east"],
                                    ["tap", "center"],
                                    ["doubletap", "south"],
                                    ["doubletap", "west"],
                                    ["doubletap", "north"],
                                    ["doubletap", "east"],
                                    ["doubletap", "center"],
                                ];
                                const touches = [];
                                const taps = [];
                                const doubletaps = [];
                                this.lastTouch = touchAction;
                                let comp = 1;
                                for (const index in actions) {
                                    const value = actions[index];
                                    if (touchAction & comp) {
                                        // console.log(`touchAction:${touchAction.toString(16)}, comp:${comp.toString(16)}, index:${index}, group:${group}`);
                                        switch (value[0]) {
                                            case "touch":
                                                touches.push(value[1]);
                                                break;
                                            case "tap":
                                                taps.push(value[1]);
                                                break;
                                            case "doubletap":
                                                doubletaps.push(value[1]);
                                                break;
                                            default:
                                        }
                                    }
                                    comp <<= 1;
                                }
                                if (touches.length > 0 && typeof this.ontouch === "function") {
                                    this.ontouch({
                                        action: "touch",
                                        positions: touches,
                                        raw: touch,
                                        seq,
                                    });
                                }
                                if (taps.length > 0 && typeof this.ontap === "function") {
                                    this.ontap({
                                        action: "tap",
                                        positions: taps,
                                        raw: touch,
                                        seq,
                                    });
                                }
                                if (doubletaps.length > 0 &&
                                    typeof this.ondoubletap === "function") {
                                    this.ondoubletap({
                                        action: "doubletap",
                                        positions: doubletaps,
                                        raw: touch,
                                        seq,
                                    });
                                }
                            }
                            if (configmask & maskAirWheelInfo && sysinfo & sysAirWheelValid) {
                                const delta = (airwheel[0] - this.lastRotation) / 32.0;
                                this.rotation += delta * 360.0;
                                this.rotation %= 360;
                                if (delta !== 0 && delta > -0.5 && delta < 0.5) {
                                    if (typeof this.onairwheel === "function") {
                                        this.onairwheel({
                                            delta: delta * 360.0,
                                            rotation: this.rotation,
                                            raw: airwheel,
                                            seq,
                                        });
                                    }
                                }
                                this.lastRotation = airwheel[0];
                            }
                            break;
                        case 0x15: // system status
                            statusInfo = {
                                msgId: data[4],
                                maxCmdSize: data[5],
                                error: data[6] | (data[7] << 8),
                            };
                            this.statusInfo = statusInfo;
                            if (this.debugprint || this.obniz.debugprint) {
                                console.log(`flickHat: system status: {msgId: ${statusInfo.msgId}, maxCmdSize: ${statusInfo.maxCmdSize}, error: ${statusInfo.error}}`);
                            }
                            break;
                        case 0x83: // farmware information
                            fwInfo = {
                                fwValid: data[4] === 0xaa,
                                hwRev: [data[5], data[6]],
                                paramStartAddr: data[7] * 128,
                                libLoaderVer: [data[8], data[9]],
                                libLoaderPlatform: data[10],
                                fwStartAddr: data[11] * 128,
                                fwVersion: this._dataArray2string(data.slice(12, 132)).split("\0")[0],
                                fwInfoReceived: true,
                            };
                            this.fwInfo = fwInfo;
                            if (typeof this.onfwinfo === "function") {
                                this.onfwinfo(fwInfo);
                            }
                            this.readSize = 26;
                            break;
                        default:
                            console.error(`unknown message: 0x${msgID.toString(16)}, data:${data
                                .slice(0, size)
                                .map((v) => "0x" + v.toString(16))}`);
                    }
                }
                this.io_ts.pull("3v");
                // await this.obniz.wait(1);
            }
        });
    }
}
exports.default = FlickHat;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9Nb3ZlbWVudFNlbnNvci9GbGlja0hhdC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLE1BQU0sUUFBUTtJQXFDWjtRQUNFLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDeEUsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUV6RCxJQUFJLENBQUMsY0FBYyxHQUFHO1lBQ3BCLG1CQUFtQjtZQUNuQixHQUFHLEVBQUUsS0FBSztZQUNWLEdBQUcsRUFBRSxLQUFLO1lBQ1YsR0FBRyxFQUFFLEtBQUs7WUFDVixLQUFLLEVBQUUsT0FBTztZQUNkLEVBQUUsRUFBRSxJQUFJO1NBQ1QsQ0FBQztJQUNKLENBQUM7SUEvQ00sTUFBTSxDQUFDLElBQUk7UUFDaEIsT0FBTztZQUNMLElBQUksRUFBRSxVQUFVO1NBQ2pCLENBQUM7SUFDSixDQUFDO0lBNkNNLEtBQUssQ0FBQyxLQUFVO1FBQ3JCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBRW5CLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBRXBCLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUN6QyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM5QyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1B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Z0NBQ0osY0FBYyxFQUFFLElBQUk7NkJBQ3JCLENBQUM7NEJBQ0YsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7NEJBQ3JCLElBQUksT0FBTyxJQUFJLENBQUMsUUFBUSxLQUFLLFVBQVUsRUFBRTtnQ0FDdkMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQzs2QkFDdkI7NEJBQ0QsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7NEJBQ25CLE1BQU07d0JBRVI7NEJBQ0UsT0FBTyxDQUFDLEtBQUssQ0FDWCxzQkFBc0IsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsVUFBVSxJQUFJO2lDQUNuRCxLQUFLLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQztpQ0FDZCxHQUFHLENBQUMsQ0FBQyxDQUFNLEVBQUUsRUFBRSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FDNUMsQ0FBQztxQkFDTDtpQkFDRjtnQkFFRCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDdEIsNEJBQTRCO2FBQzdCO1FBQ0gsQ0FBQztLQUFBO0NBQ0Y7QUFFRCxrQkFBZSxRQUFRLENBQUMiLCJmaWxlIjoic3JjL3BhcnRzL01vdmVtZW50U2Vuc29yL0ZsaWNrSGF0L2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgRmxpY2tIYXQge1xuXG4gIHB1YmxpYyBzdGF0aWMgaW5mbygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogXCJGbGlja0hhdFwiLFxuICAgIH07XG4gIH1cblxuICBwdWJsaWMga2V5czogYW55O1xuICBwdWJsaWMgcmVxdWlyZWRLZXlzOiBhbnk7XG4gIHB1YmxpYyBkaXNwbGF5SW9OYW1lczogYW55O1xuICBwdWJsaWMgb2JuaXo6IGFueTtcbiAgcHVibGljIGFkZHJlc3M6IGFueTtcbiAgcHVibGljIHBhcmFtczogYW55O1xuICBwdWJsaWMgaW9fcmVzZXQ6IGFueTtcbiAgcHVibGljIGlvX3RzOiBhbnk7XG4gIHB1YmxpYyBpMmM6IGFueTtcbiAgcHVibGljIGxlZDE6IGFueTtcbiAgcHVibGljIGxlZDI6IGFueTtcbiAgcHVibGljIG9uZndpbmZvOiBhbnk7XG4gIHB1YmxpYyBmd0luZm86IGFueTtcbiAgcHVibGljIHJvdGF0aW9uOiBhbnk7XG4gIHB1YmxpYyBsYXN0Um90YXRpb246IGFueTtcbiAgcHVibGljIHJlYWRTaXplOiBhbnk7XG4gIHB1YmxpYyBkZWJ1Z3ByaW50OiBhbnk7XG4gIHB1YmxpYyB4eXo6IGFueTtcbiAgcHVibGljIG9ueHl6OiBhbnk7XG4gIHB1YmxpYyBsYXN0R2VzdHVyZTogYW55O1xuICBwdWJsaWMgb25nZXN0dXJlYWxsOiBhbnk7XG4gIHB1YmxpYyBvbmdlc3R1cmU6IGFueTtcbiAgcHVibGljIGxhc3RUb3VjaDogYW55O1xuICBwdWJsaWMgb250b3VjaDogYW55O1xuICBwdWJsaWMgb250YXA6IGFueTtcbiAgcHVibGljIG9uZG91YmxldGFwOiBhbnk7XG4gIHB1YmxpYyBvbmFpcndoZWVsOiBhbnk7XG4gIHB1YmxpYyBzdGF0dXNJbmZvOiBhbnk7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5rZXlzID0gW1widmNjXCIsIFwiZ25kXCIsIFwic2RhXCIsIFwic2NsXCIsIFwicmVzZXRcIiwgXCJ0c1wiLCBcImxlZDFcIiwgXCJsZWQyXCJdO1xuICAgIHRoaXMucmVxdWlyZWRLZXlzID0gW1wiZ25kXCIsIFwic2RhXCIsIFwic2NsXCIsIFwicmVzZXRcIiwgXCJ0c1wiXTtcblxuICAgIHRoaXMuZGlzcGxheUlvTmFtZXMgPSB7XG4gICAgICAvLyB2Y2M6ICd2Y2MnLCAvLzV2XG4gICAgICBzZGE6IFwic2RhXCIsXG4gICAgICBzY2w6IFwic2NsXCIsXG4gICAgICBnbmQ6IFwiZ25kXCIsXG4gICAgICByZXNldDogXCJyZXNldFwiLFxuICAgICAgdHM6IFwidHNcIixcbiAgICB9O1xuICB9XG5cbiAgcHVibGljIHdpcmVkKG9ibml6OiBhbnkpIHtcbiAgICB0aGlzLm9ibml6ID0gb2JuaXo7XG5cbiAgICB0aGlzLmFkZHJlc3MgPSAweDQyO1xuXG4gICAgaWYgKHRoaXMub2JuaXouaXNWYWxpZElPKHRoaXMucGFyYW1zLnZjYykpIHtcbiAgICAgIHRoaXMub2JuaXouZ2V0SU8odGhpcy5wYXJhbXMudmNjKS5kcml2ZShcIjV2XCIpO1xuICAgICAgdGhpcy5vYm5pei5nZXRJTyh0aGlzLnBhcmFtcy52Y2MpLm91dHB1dCh0cnVlKTtcbiAgICB9XG4gICAgdGhpcy5vYm5pei5nZXRJTyh0aGlzLnBhcmFtcy5nbmQpLm91dHB1dChmYWxzZSk7XG5cbiAgICB0aGlzLmlvX3Jlc2V0ID0gdGhpcy5vYm5pei5nZXRJTyh0aGlzLnBhcmFtcy5yZXNldCk7XG4gICAgdGhpcy5pb19yZXNldC5kcml2ZShcIjN2XCIpO1xuXG4gICAgdGhpcy5pb190cyA9IHRoaXMub2JuaXouZ2V0SU8odGhpcy5wYXJhbXMudHMpO1xuICAgIHRoaXMuaW9fdHMuZHJpdmUoXCJvcGVuLWRyYWluXCIpO1xuICAgIHRoaXMuaW9fdHMucHVsbChcIjN2XCIpO1xuXG4gICAgdGhpcy5wYXJhbXMubW9kZSA9IFwibWFzdGVyXCI7XG4gICAgdGhpcy5wYXJhbXMucHVsbCA9IFwiM3ZcIjtcbiAgICB0aGlzLnBhcmFtcy5jbG9jayA9IDEwMCAqIDEwMDA7IC8vIDEwMEtIelxuXG4gICAgLy8gUGVyaXBoZXJhbEkyQ1xuICAgIHRoaXMuaTJjID0gdGhpcy5vYm5pei5nZXRJMkNXaXRoQ29uZmlnKHRoaXMucGFyYW1zKTtcblxuICAgIGlmICh0aGlzLm9ibml6LmlzVmFsaWRJTyh0aGlzLnBhcmFtcy5sZWQxKSkge1xuICAgICAgdGhpcy5sZWQxID0gdGhpcy5vYm5pei53aXJlZChcIkxFRFwiLCB7YW5vZGU6IHRoaXMucGFyYW1zLmxlZDF9KTtcbiAgICB9XG4gICAgaWYgKHRoaXMub2JuaXouaXNWYWxpZElPKHRoaXMucGFyYW1zLmxlZDIpKSB7XG4gICAgICB0aGlzLmxlZDIgPSB0aGlzLm9ibml6LndpcmVkKFwiTEVEXCIsIHthbm9kZTogdGhpcy5wYXJhbXMubGVkMn0pO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBzdGFydChjYWxsYmFja0Z3SW5mbzogYW55KSB7XG4gICAgdGhpcy5pb190cy5wdWxsKFwiM3ZcIik7XG5cbiAgICB0aGlzLmlvX3Jlc2V0Lm91dHB1dChmYWxzZSk7XG4gICAgYXdhaXQgdGhpcy5vYm5pei53YWl0KDUwKTtcbiAgICB0aGlzLmlvX3Jlc2V0Lm91dHB1dCh0cnVlKTtcbiAgICBhd2FpdCB0aGlzLm9ibml6LndhaXQoNTApO1xuXG4gICAgdGhpcy5vbmZ3aW5mbyA9IGNhbGxiYWNrRndJbmZvO1xuICAgIHRoaXMuZndJbmZvID0ge1xuICAgICAgZndWYWxpZDogMCxcbiAgICAgIGZ3SW5mb1JlY2VpdmVkOiBmYWxzZSxcbiAgICB9O1xuICAgIHRoaXMucm90YXRpb24gPSAwO1xuICAgIHRoaXMubGFzdFJvdGF0aW9uID0gMDtcbiAgICB0aGlzLnJlYWRTaXplID0gMTMyO1xuXG4gICAgYXdhaXQgdGhpcy5wb2xsaW5nKCk7XG4gICAgYXdhaXQgdGhpcy5vYm5pei53YWl0KDIwMCk7XG5cbiAgICB0aGlzLmkyYy53cml0ZSh0aGlzLmFkZHJlc3MsIFtcbiAgICAgIDB4MTAsXG4gICAgICAweDAwLFxuICAgICAgMHgwMCxcbiAgICAgIDB4YTIsXG4gICAgICAweGExLFxuICAgICAgMHgwMCxcbiAgICAgIDB4MDAsXG4gICAgICAweDAwLFxuICAgICAgMHgxZixcbiAgICAgIDB4MDAsXG4gICAgICAweDAwLFxuICAgICAgMHgwMCxcbiAgICAgIDB4ZmYsXG4gICAgICAweGZmLFxuICAgICAgMHhmZixcbiAgICAgIDB4ZmYsXG4gICAgXSk7XG4gICAgYXdhaXQgdGhpcy5vYm5pei53YWl0KDEwMCk7XG5cbiAgICB0aGlzLmkyYy53cml0ZSh0aGlzLmFkZHJlc3MsIFtcbiAgICAgIDB4MTAsXG4gICAgICAweDAwLFxuICAgICAgMHgwMCxcbiAgICAgIDB4YTIsXG4gICAgICAweDgwLFxuICAgICAgMHgwMCxcbiAgICAgIDB4MDAsXG4gICAgICAweDAwLFxuICAgICAgMHgzZixcbiAgICAgIDB4MDAsXG4gICAgICAweDAwLFxuICAgICAgMHgwMCxcbiAgICAgIDB4M2YsXG4gICAgICAweDAwLFxuICAgICAgMHgwMCxcbiAgICAgIDB4MDAsXG4gICAgXSk7XG4gIH1cblxuICBwdWJsaWMgX2RhdGFBcnJheTJzdHJpbmcoZGF0YTogYW55KSB7XG4gICAgbGV0IHJlc3VsdDogYW55ID0gXCJcIjtcbiAgICBmb3IgKGNvbnN0IG4gb2YgZGF0YSkge1xuICAgICAgcmVzdWx0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUobik7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgcG9sbGluZyh0aW1lb3V0PzogYW55KSB7XG4gICAgdGltZW91dCA9IHRpbWVvdXQgfHwgMzAwMDsgLy8gZGVmYXVsdDogM3NcblxuICAgIC8vIERhdGFPdXRwdXRDb25maWdNYXNrXHQyYnl0ZVxuICAgIC8vIGNvbnN0IG1hc2tEU1BTdGF0dXMgPSAxO1xuICAgIGNvbnN0IG1hc2tHZXN0dXJlSW5mbzogYW55ID0gMSA8PCAxO1xuICAgIGNvbnN0IG1hc2tUb3VjaEluZm86IGFueSA9IDEgPDwgMjtcbiAgICBjb25zdCBtYXNrQWlyV2hlZWxJbmZvOiBhbnkgPSAxIDw8IDM7XG4gICAgY29uc3QgbWFza1hZWlBvc2l0aW9uOiBhbnkgPSAxIDw8IDQ7XG5cbiAgICAvLyBTeXN0ZW1JbmZvXHQxYnl0ZVxuICAgIGNvbnN0IHN5c1Bvc2l0aW9uVmFsaWQ6IGFueSA9IDE7XG4gICAgY29uc3Qgc3lzQWlyV2hlZWxWYWxpZDogYW55ID0gMSA8PCAxO1xuICAgIC8vIGNvbnN0IHN5c0RTUFJ1bm5pbmcgPSAxIDw8IDc7XG5cbiAgICBjb25zdCBzdGFydFRpbWU6IGFueSA9IG5ldyBEYXRlKCk7XG4gICAgbGV0IHRzOiBhbnkgPSB0cnVlO1xuICAgIHdoaWxlICh0cyAmJiAobmV3IERhdGUoKSBhcyBhbnkpIC0gc3RhcnRUaW1lIDwgdGltZW91dCkge1xuICAgICAgdHMgPSBhd2FpdCB0aGlzLmlvX3RzLmlucHV0V2FpdCgpO1xuICAgIH1cbiAgICBpZiAoIXRzKSB7XG4gICAgICB0aGlzLmlvX3RzLnB1bGwoXCIwdlwiKTtcbiAgICAgIC8vIGF3YWl0IHRoaXMub2JuaXoud2FpdCgxKTtcblxuICAgICAgY29uc3QgZGF0YTogYW55ID0gYXdhaXQgdGhpcy5pMmMucmVhZFdhaXQodGhpcy5hZGRyZXNzLCB0aGlzLnJlYWRTaXplKTtcbiAgICAgIGNvbnN0IHNpemU6IGFueSA9IGRhdGFbMF07XG4gICAgICAvLyBsZXQgZmxhZyA9IGRhdGFbMV07XG4gICAgICBjb25zdCBzZXE6IGFueSA9IGRhdGFbMl07XG4gICAgICBjb25zdCBtc2dJRDogYW55ID0gZGF0YVszXTtcblxuICAgICAgaWYgKHNpemUgIT09IDB4ZmYgJiYgc2l6ZSA+IDApIHtcbiAgICAgICAgaWYgKHRoaXMuZGVidWdwcmludCB8fCB0aGlzLm9ibml6LmRlYnVncHJpbnQpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgIFwiZmxpY2tIYXQ6IFwiICsgZGF0YS5zbGljZSgwLCBzaXplKS5tYXAoKHY6IGFueSkgPT4gXCIweFwiICsgdi50b1N0cmluZygxNikpLFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGNvbmZpZ21hc2s6IGFueTtcbiAgICAgICAgbGV0IHN5c2luZm86IGFueTtcbiAgICAgICAgbGV0IGdlc3R1cmU6IGFueTtcbiAgICAgICAgbGV0IHRvdWNoOiBhbnk7XG4gICAgICAgIGxldCBhaXJ3aGVlbDogYW55O1xuICAgICAgICBsZXQgc3RhdHVzSW5mbzogYW55O1xuICAgICAgICBsZXQgZndJbmZvOiBhbnk7XG4gICAgICAgIHN3aXRjaCAobXNnSUQpIHtcbiAgICAgICAgICBjYXNlIDB4OTE6IC8vIHNlbnNvciBkYXRhIG91dHB1dFxuICAgICAgICAgICAgY29uZmlnbWFzayA9IGRhdGFbNF0gfCAoZGF0YVs1XSA8PCA4KTsgLy8gbGl0dGxlIGVuZGlhblxuICAgICAgICAgICAgLy8gbGV0IHRpbWVzdGFtcCA9IGRhdGFbNl07IC8vIDIwMGh6LCA4LWJpdCBjb3VudGVyLCBtYXggfjEuMjVzZWNcbiAgICAgICAgICAgIHN5c2luZm8gPSBkYXRhWzddO1xuICAgICAgICAgICAgLy8gbGV0IGRzcHN0YXR1cyA9IGRhdGEuc2xpY2UoOCwgMTApO1xuICAgICAgICAgICAgZ2VzdHVyZSA9IGRhdGEuc2xpY2UoMTAsIDE0KTtcbiAgICAgICAgICAgIHRvdWNoID0gZGF0YS5zbGljZSgxNCwgMTgpO1xuICAgICAgICAgICAgYWlyd2hlZWwgPSBkYXRhLnNsaWNlKDE4LCAyMCk7XG4gICAgICAgICAgICAvLyBsZXQgeHl6ID0gZGF0YS5zbGljZSgyMCwgMjYpO1xuICAgICAgICAgICAgLy8gbGV0IG5vaXNlcG93ID0gZGF0YS5zbGljZSgyNywgMzApO1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICBnZXN0dXJlWzBdID09PSAyNTUgJiZcbiAgICAgICAgICAgICAgZ2VzdHVyZVsxXSA9PT0gMjU1ICYmXG4gICAgICAgICAgICAgIGdlc3R1cmVbMl0gPT09IDI1NSAmJlxuICAgICAgICAgICAgICBnZXN0dXJlWzNdID09PSAyNTVcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGNvbmZpZ21hc2sgJiBtYXNrWFlaUG9zaXRpb24gJiYgc3lzaW5mbyAmIHN5c1Bvc2l0aW9uVmFsaWQpIHtcbiAgICAgICAgICAgICAgY29uc3QgeHl6OiBhbnkgPSB7XG4gICAgICAgICAgICAgICAgLy8gbGl0dGxlIGVuZGlhblxuICAgICAgICAgICAgICAgIHg6IChkYXRhWzIwXSB8IChkYXRhWzIxXSA8PCA4KSkgLyA2NTUzNixcbiAgICAgICAgICAgICAgICB5OiAoZGF0YVsyMl0gfCAoZGF0YVsyM10gPDwgOCkpIC8gNjU1MzYsXG4gICAgICAgICAgICAgICAgejogKGRhdGFbMjRdIHwgKGRhdGFbMjVdIDw8IDgpKSAvIDY1NTM2LFxuICAgICAgICAgICAgICAgIHNlcSxcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgdGhpcy54eXogPSB4eXo7XG4gICAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5vbnh5eiA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vbnh5eih4eXopO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjb25maWdtYXNrICYgbWFza0dlc3R1cmVJbmZvICYmIGdlc3R1cmVbMF0gPiAwKSB7XG4gICAgICAgICAgICAgIHRoaXMubGFzdEdlc3R1cmUgPSBnZXN0dXJlWzBdO1xuICAgICAgICAgICAgICBjb25zdCBnZXN0dXJlczogYW55ID0gW1xuICAgICAgICAgICAgICAgIFtcIlwiLCBcIlwiLCBcIlwiXSwgLy8gbm8gZ2VzdHVyZVxuICAgICAgICAgICAgICAgIFtcImdhcmJhZ2VcIiwgXCJcIiwgXCJcIl0sXG4gICAgICAgICAgICAgICAgW1wiZmxpY2tcIiwgXCJ3ZXN0XCIsIFwiZWFzdFwiXSwgLy8gMlxuICAgICAgICAgICAgICAgIFtcImZsaWNrXCIsIFwiZWFzdFwiLCBcIndlc3RcIl0sIC8vIDNcbiAgICAgICAgICAgICAgICBbXCJmbGlja1wiLCBcInNvdXRoXCIsIFwibm9ydGhcIl0sIC8vIDRcbiAgICAgICAgICAgICAgICBbXCJmbGlja1wiLCBcIm5vcnRoXCIsIFwic291dGhcIl0sIC8vIDVcbiAgICAgICAgICAgICAgICBbXCJjaXJjbGVcIiwgXCJjbG9ja3dpc2VcIiwgXCJcIl0sXG4gICAgICAgICAgICAgICAgW1wiY2lyY2xlXCIsIFwiY291bnRlci1jbG9ja3dpc2VcIiwgXCJcIl0sXG4gICAgICAgICAgICAgICAgW1wid2F2ZVwiLCBcInhcIiwgXCJcIl0sXG4gICAgICAgICAgICAgICAgW1wid2F2ZVwiLCBcInlcIiwgXCJcIl0sXG4gICAgICAgICAgICAgICAgW1wiaG9sZFwiLCBcIlwiLCBcIlwiXSxcbiAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgICAgZm9yIChjb25zdCBpbmRleCBpbiBnZXN0dXJlcykge1xuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgIGluZGV4ID09PSBnZXN0dXJlWzBdICYmXG4gICAgICAgICAgICAgICAgICB0eXBlb2YgdGhpcy5vbmdlc3R1cmVhbGwgPT09IFwiZnVuY3Rpb25cIlxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgdGhpcy5vbmdlc3R1cmVhbGwoe1xuICAgICAgICAgICAgICAgICAgICBhY3Rpb246IGdlc3R1cmVzW2luZGV4XVswXSxcbiAgICAgICAgICAgICAgICAgICAgZnJvbTogZ2VzdHVyZXNbaW5kZXhdWzFdLFxuICAgICAgICAgICAgICAgICAgICB0bzogZ2VzdHVyZXNbaW5kZXhdWzJdLFxuICAgICAgICAgICAgICAgICAgICByYXc6IGdlc3R1cmUsXG4gICAgICAgICAgICAgICAgICAgIHNlcSxcbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICBpbmRleCA9PT0gZ2VzdHVyZVswXSAmJlxuICAgICAgICAgICAgICAgICAgZ2VzdHVyZXNbaW5kZXhdWzBdID09PSBcImZsaWNrXCIgJiZcbiAgICAgICAgICAgICAgICAgIHR5cGVvZiB0aGlzLm9uZ2VzdHVyZSA9PT0gXCJmdW5jdGlvblwiXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLm9uZ2VzdHVyZSh7XG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbjogXCJnZXN0dXJlXCIsXG4gICAgICAgICAgICAgICAgICAgIGZyb206IGdlc3R1cmVzW2luZGV4XVsxXSxcbiAgICAgICAgICAgICAgICAgICAgdG86IGdlc3R1cmVzW2luZGV4XVsyXSxcbiAgICAgICAgICAgICAgICAgICAgcmF3OiBnZXN0dXJlLFxuICAgICAgICAgICAgICAgICAgICBzZXEsXG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICBjb25maWdtYXNrICYgbWFza1RvdWNoSW5mbyAmJlxuICAgICAgICAgICAgICAhKHRvdWNoWzBdID09PSAwICYmIHRvdWNoWzFdID09PSAwKSAmJlxuICAgICAgICAgICAgICB0b3VjaFszXSA9PT0gMFxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCd0b3VjaDogJyArIHRvdWNoLm1hcCh2ID0+ICcweCcgKyB2LnRvU3RyaW5nKDE2KSkpO1xuICAgICAgICAgICAgICBjb25zdCB0b3VjaEFjdGlvbjogYW55ID0gdG91Y2hbMF0gfCAodG91Y2hbMV0gPDwgOCk7IC8vIGxpdHRsZSBlbmRpYW5cbiAgICAgICAgICAgICAgaWYgKHRvdWNoQWN0aW9uID09PSAweGZmZmYpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAvLyBsZXQgdG91Y2hDb3VudCA9IHRvdWNoWzJdICogNTsgLy8gdG91Y2ggY291bnRlciB2YWx1ZSAqIDVbbXNdXG4gICAgICAgICAgICAgIGNvbnN0IGFjdGlvbnM6IGFueSA9IFtcbiAgICAgICAgICAgICAgICBbXCJ0b3VjaFwiLCBcInNvdXRoXCJdLCAvLyAwXG4gICAgICAgICAgICAgICAgW1widG91Y2hcIiwgXCJ3ZXN0XCJdLCAvLyAxXG4gICAgICAgICAgICAgICAgW1widG91Y2hcIiwgXCJub3J0aFwiXSwgLy8gMlxuICAgICAgICAgICAgICAgIFtcInRvdWNoXCIsIFwiZWFzdFwiXSwgLy8gM1xuICAgICAgICAgICAgICAgIFtcInRvdWNoXCIsIFwiY2VudGVyXCJdLCAvLyA0XG4gICAgICAgICAgICAgICAgW1widGFwXCIsIFwic291dGhcIl0sIC8vIDVcbiAgICAgICAgICAgICAgICBbXCJ0YXBcIiwgXCJ3ZXN0XCJdLCAvLyA2XG4gICAgICAgICAgICAgICAgW1widGFwXCIsIFwibm9ydGhcIl0sIC8vIDdcbiAgICAgICAgICAgICAgICBbXCJ0YXBcIiwgXCJlYXN0XCJdLCAvLyA4XG4gICAgICAgICAgICAgICAgW1widGFwXCIsIFwiY2VudGVyXCJdLCAvLyA5XG4gICAgICAgICAgICAgICAgW1wiZG91YmxldGFwXCIsIFwic291dGhcIl0sIC8vIDEwXG4gICAgICAgICAgICAgICAgW1wiZG91YmxldGFwXCIsIFwid2VzdFwiXSwgLy8gMTFcbiAgICAgICAgICAgICAgICBbXCJkb3VibGV0YXBcIiwgXCJub3J0aFwiXSwgLy8gMTJcbiAgICAgICAgICAgICAgICBbXCJkb3VibGV0YXBcIiwgXCJlYXN0XCJdLCAvLyAxM1xuICAgICAgICAgICAgICAgIFtcImRvdWJsZXRhcFwiLCBcImNlbnRlclwiXSwgLy8gMTRcbiAgICAgICAgICAgICAgXTtcblxuICAgICAgICAgICAgICBjb25zdCB0b3VjaGVzOiBhbnkgPSBbXTtcbiAgICAgICAgICAgICAgY29uc3QgdGFwczogYW55ID0gW107XG4gICAgICAgICAgICAgIGNvbnN0IGRvdWJsZXRhcHM6IGFueSA9IFtdO1xuICAgICAgICAgICAgICB0aGlzLmxhc3RUb3VjaCA9IHRvdWNoQWN0aW9uO1xuXG4gICAgICAgICAgICAgIGxldCBjb21wOiBhbnkgPSAxO1xuICAgICAgICAgICAgICBmb3IgKGNvbnN0IGluZGV4IGluIGFjdGlvbnMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZTogYW55ID0gYWN0aW9uc1tpbmRleF07XG4gICAgICAgICAgICAgICAgaWYgKHRvdWNoQWN0aW9uICYgY29tcCkge1xuICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYHRvdWNoQWN0aW9uOiR7dG91Y2hBY3Rpb24udG9TdHJpbmcoMTYpfSwgY29tcDoke2NvbXAudG9TdHJpbmcoMTYpfSwgaW5kZXg6JHtpbmRleH0sIGdyb3VwOiR7Z3JvdXB9YCk7XG4gICAgICAgICAgICAgICAgICBzd2l0Y2ggKHZhbHVlWzBdKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJ0b3VjaFwiOlxuICAgICAgICAgICAgICAgICAgICAgIHRvdWNoZXMucHVzaCh2YWx1ZVsxXSk7XG4gICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJ0YXBcIjpcbiAgICAgICAgICAgICAgICAgICAgICB0YXBzLnB1c2godmFsdWVbMV0pO1xuICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiZG91YmxldGFwXCI6XG4gICAgICAgICAgICAgICAgICAgICAgZG91YmxldGFwcy5wdXNoKHZhbHVlWzFdKTtcbiAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29tcCA8PD0gMTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGlmICh0b3VjaGVzLmxlbmd0aCA+IDAgJiYgdHlwZW9mIHRoaXMub250b3VjaCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vbnRvdWNoKHtcbiAgICAgICAgICAgICAgICAgIGFjdGlvbjogXCJ0b3VjaFwiLFxuICAgICAgICAgICAgICAgICAgcG9zaXRpb25zOiB0b3VjaGVzLFxuICAgICAgICAgICAgICAgICAgcmF3OiB0b3VjaCxcbiAgICAgICAgICAgICAgICAgIHNlcSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGlmICh0YXBzLmxlbmd0aCA+IDAgJiYgdHlwZW9mIHRoaXMub250YXAgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIHRoaXMub250YXAoe1xuICAgICAgICAgICAgICAgICAgYWN0aW9uOiBcInRhcFwiLFxuICAgICAgICAgICAgICAgICAgcG9zaXRpb25zOiB0YXBzLFxuICAgICAgICAgICAgICAgICAgcmF3OiB0b3VjaCxcbiAgICAgICAgICAgICAgICAgIHNlcSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBkb3VibGV0YXBzLmxlbmd0aCA+IDAgJiZcbiAgICAgICAgICAgICAgICB0eXBlb2YgdGhpcy5vbmRvdWJsZXRhcCA9PT0gXCJmdW5jdGlvblwiXG4gICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHRoaXMub25kb3VibGV0YXAoe1xuICAgICAgICAgICAgICAgICAgYWN0aW9uOiBcImRvdWJsZXRhcFwiLFxuICAgICAgICAgICAgICAgICAgcG9zaXRpb25zOiBkb3VibGV0YXBzLFxuICAgICAgICAgICAgICAgICAgcmF3OiB0b3VjaCxcbiAgICAgICAgICAgICAgICAgIHNlcSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoY29uZmlnbWFzayAmIG1hc2tBaXJXaGVlbEluZm8gJiYgc3lzaW5mbyAmIHN5c0FpcldoZWVsVmFsaWQpIHtcbiAgICAgICAgICAgICAgY29uc3QgZGVsdGE6IGFueSA9IChhaXJ3aGVlbFswXSAtIHRoaXMubGFzdFJvdGF0aW9uKSAvIDMyLjA7XG4gICAgICAgICAgICAgIHRoaXMucm90YXRpb24gKz0gZGVsdGEgKiAzNjAuMDtcbiAgICAgICAgICAgICAgdGhpcy5yb3RhdGlvbiAlPSAzNjA7XG4gICAgICAgICAgICAgIGlmIChkZWx0YSAhPT0gMCAmJiBkZWx0YSA+IC0wLjUgJiYgZGVsdGEgPCAwLjUpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMub25haXJ3aGVlbCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLm9uYWlyd2hlZWwoe1xuICAgICAgICAgICAgICAgICAgICBkZWx0YTogZGVsdGEgKiAzNjAuMCxcbiAgICAgICAgICAgICAgICAgICAgcm90YXRpb246IHRoaXMucm90YXRpb24sXG4gICAgICAgICAgICAgICAgICAgIHJhdzogYWlyd2hlZWwsXG4gICAgICAgICAgICAgICAgICAgIHNlcSxcbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB0aGlzLmxhc3RSb3RhdGlvbiA9IGFpcndoZWVsWzBdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBjYXNlIDB4MTU6IC8vIHN5c3RlbSBzdGF0dXNcbiAgICAgICAgICAgIHN0YXR1c0luZm8gPSB7XG4gICAgICAgICAgICAgIG1zZ0lkOiBkYXRhWzRdLFxuICAgICAgICAgICAgICBtYXhDbWRTaXplOiBkYXRhWzVdLFxuICAgICAgICAgICAgICBlcnJvcjogZGF0YVs2XSB8IChkYXRhWzddIDw8IDgpLCAvLyBsaXR0bGUgZW5kaWFuXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5zdGF0dXNJbmZvID0gc3RhdHVzSW5mbztcbiAgICAgICAgICAgIGlmICh0aGlzLmRlYnVncHJpbnQgfHwgdGhpcy5vYm5pei5kZWJ1Z3ByaW50KSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgICAgIGBmbGlja0hhdDogc3lzdGVtIHN0YXR1czoge21zZ0lkOiAke1xuICAgICAgICAgICAgICAgICAgc3RhdHVzSW5mby5tc2dJZFxuICAgICAgICAgICAgICAgIH0sIG1heENtZFNpemU6ICR7c3RhdHVzSW5mby5tYXhDbWRTaXplfSwgZXJyb3I6ICR7XG4gICAgICAgICAgICAgICAgICBzdGF0dXNJbmZvLmVycm9yXG4gICAgICAgICAgICAgICAgfX1gLFxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBjYXNlIDB4ODM6IC8vIGZhcm13YXJlIGluZm9ybWF0aW9uXG4gICAgICAgICAgICBmd0luZm8gPSB7XG4gICAgICAgICAgICAgIGZ3VmFsaWQ6IGRhdGFbNF0gPT09IDB4YWEsXG4gICAgICAgICAgICAgIGh3UmV2OiBbZGF0YVs1XSwgZGF0YVs2XV0sXG4gICAgICAgICAgICAgIHBhcmFtU3RhcnRBZGRyOiBkYXRhWzddICogMTI4LFxuICAgICAgICAgICAgICBsaWJMb2FkZXJWZXI6IFtkYXRhWzhdLCBkYXRhWzldXSxcbiAgICAgICAgICAgICAgbGliTG9hZGVyUGxhdGZvcm06IGRhdGFbMTBdLFxuICAgICAgICAgICAgICBmd1N0YXJ0QWRkcjogZGF0YVsxMV0gKiAxMjgsXG4gICAgICAgICAgICAgIGZ3VmVyc2lvbjogdGhpcy5fZGF0YUFycmF5MnN0cmluZyhkYXRhLnNsaWNlKDEyLCAxMzIpKS5zcGxpdChcbiAgICAgICAgICAgICAgICBcIlxcMFwiLFxuICAgICAgICAgICAgICApWzBdLFxuICAgICAgICAgICAgICBmd0luZm9SZWNlaXZlZDogdHJ1ZSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLmZ3SW5mbyA9IGZ3SW5mbztcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5vbmZ3aW5mbyA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgIHRoaXMub25md2luZm8oZndJbmZvKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucmVhZFNpemUgPSAyNjtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgICAgIGB1bmtub3duIG1lc3NhZ2U6IDB4JHttc2dJRC50b1N0cmluZygxNil9LCBkYXRhOiR7ZGF0YVxuICAgICAgICAgICAgICAgIC5zbGljZSgwLCBzaXplKVxuICAgICAgICAgICAgICAgIC5tYXAoKHY6IGFueSkgPT4gXCIweFwiICsgdi50b1N0cmluZygxNikpfWAsXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuaW9fdHMucHVsbChcIjN2XCIpO1xuICAgICAgLy8gYXdhaXQgdGhpcy5vYm5pei53YWl0KDEpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBGbGlja0hhdDtcbiJdfQ==

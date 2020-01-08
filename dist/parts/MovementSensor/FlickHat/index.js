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
class FlickHat {
    constructor() {
        this.keys = ['vcc', 'gnd', 'sda', 'scl', 'reset', 'ts', 'led1', 'led2'];
        this.requiredKeys = ['gnd', 'sda', 'scl', 'reset', 'ts'];
        this.displayIoNames = {
            //vcc: 'vcc', //5v
            sda: 'sda',
            scl: 'scl',
            gnd: 'gnd',
            reset: 'reset',
            ts: 'ts',
        };
    }
    static info() {
        return {
            name: 'FlickHat',
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        this.address = 0x42;
        if (this.obniz.isValidIO(this.params.vcc)) {
            this.obniz.getIO(this.params.vcc).drive('5v');
            this.obniz.getIO(this.params.vcc).output(true);
        }
        this.obniz.getIO(this.params.gnd).output(false);
        this.io_reset = this.obniz.getIO(this.params.reset);
        this.io_reset.drive('3v');
        this.io_ts = this.obniz.getIO(this.params.ts);
        this.io_ts.drive('open-drain');
        this.io_ts.pull('3v');
        this.params.mode = 'master';
        this.params.pull = '3v';
        this.params.clock = 100 * 1000; //100KHz
        //PeripheralI2C
        this.i2c = this.obniz.getI2CWithConfig(this.params);
        if (this.obniz.isValidIO(this.params.led1)) {
            this.led1 = this.obniz.wired('LED', { anode: this.params.led1 });
        }
        if (this.obniz.isValidIO(this.params.led2)) {
            this.led2 = this.obniz.wired('LED', { anode: this.params.led2 });
        }
    }
    start(callbackFwInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            this.io_ts.pull('3v');
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
        let result = '';
        for (let n of data) {
            result += String.fromCharCode(n);
        }
        return result;
    }
    polling(timeout) {
        return __awaiter(this, void 0, void 0, function* () {
            timeout = timeout || 3000; //default: 3s
            //DataOutputConfigMask	2byte
            // const maskDSPStatus = 1;
            const maskGestureInfo = 1 << 1;
            const maskTouchInfo = 1 << 2;
            const maskAirWheelInfo = 1 << 3;
            const maskXYZPosition = 1 << 4;
            //SystemInfo	1byte
            const sysPositionValid = 1;
            const sysAirWheelValid = 1 << 1;
            // const sysDSPRunning = 1 << 7;
            let startTime = new Date();
            let ts = true;
            while (ts && new Date() - startTime < timeout)
                ts = yield this.io_ts.inputWait();
            if (!ts) {
                this.io_ts.pull('0v');
                //await this.obniz.wait(1);
                let data = yield this.i2c.readWait(this.address, this.readSize);
                let size = data[0];
                // let flag = data[1];
                let seq = data[2];
                let msgID = data[3];
                if (size != 0xff && size > 0) {
                    if (this.debugprint || this.obniz.debugprint) {
                        console.log('flickHat: ' + data.slice(0, size).map(v => '0x' + v.toString(16)));
                    }
                    let configmask, sysinfo, gesture, touch, airwheel, statusInfo, fwInfo;
                    switch (msgID) {
                        case 0x91: //sensor data output
                            configmask = data[4] | (data[5] << 8); //little endian
                            // let timestamp = data[6]; // 200hz, 8-bit counter, max ~1.25sec
                            sysinfo = data[7];
                            // let dspstatus = data.slice(8, 10);
                            gesture = data.slice(10, 14);
                            touch = data.slice(14, 18);
                            airwheel = data.slice(18, 20);
                            // let xyz = data.slice(20, 26);
                            // let noisepow = data.slice(27, 30);
                            if (gesture[0] == 255 &&
                                gesture[1] == 255 &&
                                gesture[2] == 255 &&
                                gesture[3] == 255)
                                break;
                            if (configmask & maskXYZPosition && sysinfo & sysPositionValid) {
                                let xyz = {
                                    //little endian
                                    x: (data[20] | (data[21] << 8)) / 65536,
                                    y: (data[22] | (data[23] << 8)) / 65536,
                                    z: (data[24] | (data[25] << 8)) / 65536,
                                    seq: seq,
                                };
                                this.xyz = xyz;
                                if (typeof this.onxyz == 'function')
                                    this.onxyz(xyz);
                            }
                            if (configmask & maskGestureInfo && gesture[0] > 0) {
                                this.lastGesture = gesture[0];
                                const gestures = [
                                    ['', '', ''],
                                    ['garbage', '', ''],
                                    ['flick', 'west', 'east'],
                                    ['flick', 'east', 'west'],
                                    ['flick', 'south', 'north'],
                                    ['flick', 'north', 'south'],
                                    ['circle', 'clockwise', ''],
                                    ['circle', 'counter-clockwise', ''][('wave', 'x', '')],
                                    ['wave', 'y', ''],
                                    ['hold', '', ''],
                                ];
                                for (let index in gestures) {
                                    if (index == gesture[0] &&
                                        typeof this.ongestureall == 'function')
                                        this.ongestureall({
                                            action: gestures[index][0],
                                            from: gestures[index][1],
                                            to: gestures[index][2],
                                            raw: gesture,
                                            seq: seq,
                                        });
                                    if (index == gesture[0] &&
                                        gestures[index][0] == 'flick' &&
                                        typeof this.ongesture == 'function')
                                        this.ongesture({
                                            action: 'gesture',
                                            from: gestures[index][1],
                                            to: gestures[index][2],
                                            raw: gesture,
                                            seq: seq,
                                        });
                                }
                            }
                            if (configmask & maskTouchInfo &&
                                !(touch[0] == 0 && touch[1] == 0) &&
                                touch[3] == 0) {
                                //console.log('touch: ' + touch.map(v => '0x' + v.toString(16)));
                                let touchAction = touch[0] | (touch[1] << 8); //little endian
                                if (touchAction == 0xffff)
                                    break;
                                // let touchCount = touch[2] * 5; // touch counter value * 5[ms]
                                const actions = [
                                    ['touch', 'south'],
                                    ['touch', 'west'],
                                    ['touch', 'north'],
                                    ['touch', 'east'],
                                    ['touch', 'center'],
                                    ['tap', 'south'],
                                    ['tap', 'west'],
                                    ['tap', 'north'],
                                    ['tap', 'east'],
                                    ['tap', 'center'],
                                    ['doubletap', 'south'],
                                    ['doubletap', 'west'],
                                    ['doubletap', 'north'],
                                    ['doubletap', 'east'],
                                    ['doubletap', 'center'],
                                ];
                                let touches = [];
                                let taps = [];
                                let doubletaps = [];
                                this.lastTouch = touchAction;
                                let comp = 1;
                                for (let index in actions) {
                                    let value = actions[index];
                                    if (touchAction & comp) {
                                        //console.log(`touchAction:${touchAction.toString(16)}, comp:${comp.toString(16)}, index:${index}, group:${group}`);
                                        switch (value[0]) {
                                            case 'touch':
                                                touches.push(value[1]);
                                                break;
                                            case 'tap':
                                                taps.push(value[1]);
                                                break;
                                            case 'doubletap':
                                                doubletaps.push(value[1]);
                                                break;
                                            default:
                                        }
                                    }
                                    comp <<= 1;
                                }
                                if (touches.length > 0 && typeof this.ontouch == 'function')
                                    this.ontouch({
                                        action: 'touch',
                                        positions: touches,
                                        raw: touch,
                                        seq: seq,
                                    });
                                if (taps.length > 0 && typeof this.ontap == 'function')
                                    this.ontap({
                                        action: 'tap',
                                        positions: taps,
                                        raw: touch,
                                        seq: seq,
                                    });
                                if (doubletaps.length > 0 &&
                                    typeof this.ondoubletap == 'function')
                                    this.ondoubletap({
                                        action: 'doubletap',
                                        positions: doubletaps,
                                        raw: touch,
                                        seq: seq,
                                    });
                            }
                            if (configmask & maskAirWheelInfo && sysinfo & sysAirWheelValid) {
                                let delta = (airwheel[0] - this.lastRotation) / 32.0;
                                this.rotation += delta * 360.0;
                                this.rotation %= 360;
                                if (delta != 0 && delta > -0.5 && delta < 0.5) {
                                    if (typeof this.onairwheel == 'function')
                                        this.onairwheel({
                                            delta: delta * 360.0,
                                            rotation: this.rotation,
                                            raw: airwheel,
                                            seq: seq,
                                        });
                                }
                                this.lastRotation = airwheel[0];
                            }
                            break;
                        case 0x15: //system status
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
                                fwValid: data[4] == 0xaa,
                                hwRev: [data[5], data[6]],
                                paramStartAddr: data[7] * 128,
                                libLoaderVer: [data[8], data[9]],
                                libLoaderPlatform: data[10],
                                fwStartAddr: data[11] * 128,
                                fwVersion: this._dataArray2string(data.slice(12, 132)).split('\0')[0],
                                fwInfoReceived: true,
                            };
                            this.fwInfo = fwInfo;
                            if (typeof this.onfwinfo == 'function')
                                this.onfwinfo(fwInfo);
                            this.readSize = 26;
                            break;
                        default:
                            console.error(`unknown message: 0x${msgID.toString(16)}, data:${data
                                .slice(0, size)
                                .map(v => '0x' + v.toString(16))}`);
                    }
                }
                this.io_ts.pull('3v');
                //await this.obniz.wait(1);
            }
        });
    }
}
if (typeof module === 'object') {
    module.exports = FlickHat;
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9Nb3ZlbWVudFNlbnNvci9GbGlja0hhdC9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsTUFBTSxRQUFRO0lBQ1o7UUFDRSxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3hFLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFekQsSUFBSSxDQUFDLGNBQWMsR0FBRztZQUNwQixrQkFBa0I7WUFDbEIsR0FBRyxFQUFFLEtBQUs7WUFDVixHQUFHLEVBQUUsS0FBSztZQUNWLEdBQUcsRUFBRSxLQUFLO1lBQ1YsS0FBSyxFQUFFLE9BQU87WUFDZCxFQUFFLEVBQUUsSUFBSTtTQUNULENBQUM7SUFDSixDQUFDO0lBRUQsTUFBTSxDQUFDLElBQUk7UUFDVCxPQUFPO1lBQ0wsSUFBSSxFQUFFLFVBQVU7U0FDakIsQ0FBQztJQUNKLENBQUM7SUFFRCxLQUFLLENBQUMsS0FBSztRQUNULElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBRW5CLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBRXBCLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUN6QyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM5QyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FB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TUFBTSxDQUFDLENBQUM7NEJBQzlELElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDOzRCQUNuQixNQUFNO3dCQUVSOzRCQUNFLE9BQU8sQ0FBQyxLQUFLLENBQ1gsc0JBQXNCLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLFVBQVUsSUFBSTtpQ0FDbkQsS0FBSyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUM7aUNBQ2QsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUNyQyxDQUFDO3FCQUNMO2lCQUNGO2dCQUVELElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN0QiwyQkFBMkI7YUFDNUI7UUFDSCxDQUFDO0tBQUE7Q0FDRjtBQUVELElBQUksT0FBTyxNQUFNLEtBQUssUUFBUSxFQUFFO0lBQzlCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDO0NBQzNCIiwiZmlsZSI6InBhcnRzL01vdmVtZW50U2Vuc29yL0ZsaWNrSGF0L2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgRmxpY2tIYXQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmtleXMgPSBbJ3ZjYycsICdnbmQnLCAnc2RhJywgJ3NjbCcsICdyZXNldCcsICd0cycsICdsZWQxJywgJ2xlZDInXTtcbiAgICB0aGlzLnJlcXVpcmVkS2V5cyA9IFsnZ25kJywgJ3NkYScsICdzY2wnLCAncmVzZXQnLCAndHMnXTtcblxuICAgIHRoaXMuZGlzcGxheUlvTmFtZXMgPSB7XG4gICAgICAvL3ZjYzogJ3ZjYycsIC8vNXZcbiAgICAgIHNkYTogJ3NkYScsXG4gICAgICBzY2w6ICdzY2wnLFxuICAgICAgZ25kOiAnZ25kJyxcbiAgICAgIHJlc2V0OiAncmVzZXQnLFxuICAgICAgdHM6ICd0cycsXG4gICAgfTtcbiAgfVxuXG4gIHN0YXRpYyBpbmZvKCkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiAnRmxpY2tIYXQnLFxuICAgIH07XG4gIH1cblxuICB3aXJlZChvYm5peikge1xuICAgIHRoaXMub2JuaXogPSBvYm5pejtcblxuICAgIHRoaXMuYWRkcmVzcyA9IDB4NDI7XG5cbiAgICBpZiAodGhpcy5vYm5pei5pc1ZhbGlkSU8odGhpcy5wYXJhbXMudmNjKSkge1xuICAgICAgdGhpcy5vYm5pei5nZXRJTyh0aGlzLnBhcmFtcy52Y2MpLmRyaXZlKCc1dicpO1xuICAgICAgdGhpcy5vYm5pei5nZXRJTyh0aGlzLnBhcmFtcy52Y2MpLm91dHB1dCh0cnVlKTtcbiAgICB9XG4gICAgdGhpcy5vYm5pei5nZXRJTyh0aGlzLnBhcmFtcy5nbmQpLm91dHB1dChmYWxzZSk7XG5cbiAgICB0aGlzLmlvX3Jlc2V0ID0gdGhpcy5vYm5pei5nZXRJTyh0aGlzLnBhcmFtcy5yZXNldCk7XG4gICAgdGhpcy5pb19yZXNldC5kcml2ZSgnM3YnKTtcblxuICAgIHRoaXMuaW9fdHMgPSB0aGlzLm9ibml6LmdldElPKHRoaXMucGFyYW1zLnRzKTtcbiAgICB0aGlzLmlvX3RzLmRyaXZlKCdvcGVuLWRyYWluJyk7XG4gICAgdGhpcy5pb190cy5wdWxsKCczdicpO1xuXG4gICAgdGhpcy5wYXJhbXMubW9kZSA9ICdtYXN0ZXInO1xuICAgIHRoaXMucGFyYW1zLnB1bGwgPSAnM3YnO1xuICAgIHRoaXMucGFyYW1zLmNsb2NrID0gMTAwICogMTAwMDsgLy8xMDBLSHpcblxuICAgIC8vUGVyaXBoZXJhbEkyQ1xuICAgIHRoaXMuaTJjID0gdGhpcy5vYm5pei5nZXRJMkNXaXRoQ29uZmlnKHRoaXMucGFyYW1zKTtcblxuICAgIGlmICh0aGlzLm9ibml6LmlzVmFsaWRJTyh0aGlzLnBhcmFtcy5sZWQxKSkge1xuICAgICAgdGhpcy5sZWQxID0gdGhpcy5vYm5pei53aXJlZCgnTEVEJywgeyBhbm9kZTogdGhpcy5wYXJhbXMubGVkMSB9KTtcbiAgICB9XG4gICAgaWYgKHRoaXMub2JuaXouaXNWYWxpZElPKHRoaXMucGFyYW1zLmxlZDIpKSB7XG4gICAgICB0aGlzLmxlZDIgPSB0aGlzLm9ibml6LndpcmVkKCdMRUQnLCB7IGFub2RlOiB0aGlzLnBhcmFtcy5sZWQyIH0pO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIHN0YXJ0KGNhbGxiYWNrRndJbmZvKSB7XG4gICAgdGhpcy5pb190cy5wdWxsKCczdicpO1xuXG4gICAgdGhpcy5pb19yZXNldC5vdXRwdXQoZmFsc2UpO1xuICAgIGF3YWl0IHRoaXMub2JuaXoud2FpdCg1MCk7XG4gICAgdGhpcy5pb19yZXNldC5vdXRwdXQodHJ1ZSk7XG4gICAgYXdhaXQgdGhpcy5vYm5pei53YWl0KDUwKTtcblxuICAgIHRoaXMub25md2luZm8gPSBjYWxsYmFja0Z3SW5mbztcbiAgICB0aGlzLmZ3SW5mbyA9IHtcbiAgICAgIGZ3VmFsaWQ6IDAsXG4gICAgICBmd0luZm9SZWNlaXZlZDogZmFsc2UsXG4gICAgfTtcbiAgICB0aGlzLnJvdGF0aW9uID0gMDtcbiAgICB0aGlzLmxhc3RSb3RhdGlvbiA9IDA7XG4gICAgdGhpcy5yZWFkU2l6ZSA9IDEzMjtcblxuICAgIGF3YWl0IHRoaXMucG9sbGluZygpO1xuICAgIGF3YWl0IHRoaXMub2JuaXoud2FpdCgyMDApO1xuXG4gICAgdGhpcy5pMmMud3JpdGUodGhpcy5hZGRyZXNzLCBbXG4gICAgICAweDEwLFxuICAgICAgMHgwMCxcbiAgICAgIDB4MDAsXG4gICAgICAweGEyLFxuICAgICAgMHhhMSxcbiAgICAgIDB4MDAsXG4gICAgICAweDAwLFxuICAgICAgMHgwMCxcbiAgICAgIDB4MWYsXG4gICAgICAweDAwLFxuICAgICAgMHgwMCxcbiAgICAgIDB4MDAsXG4gICAgICAweGZmLFxuICAgICAgMHhmZixcbiAgICAgIDB4ZmYsXG4gICAgICAweGZmLFxuICAgIF0pO1xuICAgIGF3YWl0IHRoaXMub2JuaXoud2FpdCgxMDApO1xuXG4gICAgdGhpcy5pMmMud3JpdGUodGhpcy5hZGRyZXNzLCBbXG4gICAgICAweDEwLFxuICAgICAgMHgwMCxcbiAgICAgIDB4MDAsXG4gICAgICAweGEyLFxuICAgICAgMHg4MCxcbiAgICAgIDB4MDAsXG4gICAgICAweDAwLFxuICAgICAgMHgwMCxcbiAgICAgIDB4M2YsXG4gICAgICAweDAwLFxuICAgICAgMHgwMCxcbiAgICAgIDB4MDAsXG4gICAgICAweDNmLFxuICAgICAgMHgwMCxcbiAgICAgIDB4MDAsXG4gICAgICAweDAwLFxuICAgIF0pO1xuICB9XG5cbiAgX2RhdGFBcnJheTJzdHJpbmcoZGF0YSkge1xuICAgIGxldCByZXN1bHQgPSAnJztcbiAgICBmb3IgKGxldCBuIG9mIGRhdGEpIHtcbiAgICAgIHJlc3VsdCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKG4pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgYXN5bmMgcG9sbGluZyh0aW1lb3V0KSB7XG4gICAgdGltZW91dCA9IHRpbWVvdXQgfHwgMzAwMDsgLy9kZWZhdWx0OiAzc1xuXG4gICAgLy9EYXRhT3V0cHV0Q29uZmlnTWFza1x0MmJ5dGVcbiAgICAvLyBjb25zdCBtYXNrRFNQU3RhdHVzID0gMTtcbiAgICBjb25zdCBtYXNrR2VzdHVyZUluZm8gPSAxIDw8IDE7XG4gICAgY29uc3QgbWFza1RvdWNoSW5mbyA9IDEgPDwgMjtcbiAgICBjb25zdCBtYXNrQWlyV2hlZWxJbmZvID0gMSA8PCAzO1xuICAgIGNvbnN0IG1hc2tYWVpQb3NpdGlvbiA9IDEgPDwgNDtcblxuICAgIC8vU3lzdGVtSW5mb1x0MWJ5dGVcbiAgICBjb25zdCBzeXNQb3NpdGlvblZhbGlkID0gMTtcbiAgICBjb25zdCBzeXNBaXJXaGVlbFZhbGlkID0gMSA8PCAxO1xuICAgIC8vIGNvbnN0IHN5c0RTUFJ1bm5pbmcgPSAxIDw8IDc7XG5cbiAgICBsZXQgc3RhcnRUaW1lID0gbmV3IERhdGUoKTtcbiAgICBsZXQgdHMgPSB0cnVlO1xuICAgIHdoaWxlICh0cyAmJiBuZXcgRGF0ZSgpIC0gc3RhcnRUaW1lIDwgdGltZW91dClcbiAgICAgIHRzID0gYXdhaXQgdGhpcy5pb190cy5pbnB1dFdhaXQoKTtcbiAgICBpZiAoIXRzKSB7XG4gICAgICB0aGlzLmlvX3RzLnB1bGwoJzB2Jyk7XG4gICAgICAvL2F3YWl0IHRoaXMub2JuaXoud2FpdCgxKTtcblxuICAgICAgbGV0IGRhdGEgPSBhd2FpdCB0aGlzLmkyYy5yZWFkV2FpdCh0aGlzLmFkZHJlc3MsIHRoaXMucmVhZFNpemUpO1xuICAgICAgbGV0IHNpemUgPSBkYXRhWzBdO1xuICAgICAgLy8gbGV0IGZsYWcgPSBkYXRhWzFdO1xuICAgICAgbGV0IHNlcSA9IGRhdGFbMl07XG4gICAgICBsZXQgbXNnSUQgPSBkYXRhWzNdO1xuXG4gICAgICBpZiAoc2l6ZSAhPSAweGZmICYmIHNpemUgPiAwKSB7XG4gICAgICAgIGlmICh0aGlzLmRlYnVncHJpbnQgfHwgdGhpcy5vYm5pei5kZWJ1Z3ByaW50KSB7XG4gICAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICAnZmxpY2tIYXQ6ICcgKyBkYXRhLnNsaWNlKDAsIHNpemUpLm1hcCh2ID0+ICcweCcgKyB2LnRvU3RyaW5nKDE2KSlcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIGxldCBjb25maWdtYXNrLCBzeXNpbmZvLCBnZXN0dXJlLCB0b3VjaCwgYWlyd2hlZWwsIHN0YXR1c0luZm8sIGZ3SW5mbztcbiAgICAgICAgc3dpdGNoIChtc2dJRCkge1xuICAgICAgICAgIGNhc2UgMHg5MTogLy9zZW5zb3IgZGF0YSBvdXRwdXRcbiAgICAgICAgICAgIGNvbmZpZ21hc2sgPSBkYXRhWzRdIHwgKGRhdGFbNV0gPDwgOCk7IC8vbGl0dGxlIGVuZGlhblxuICAgICAgICAgICAgLy8gbGV0IHRpbWVzdGFtcCA9IGRhdGFbNl07IC8vIDIwMGh6LCA4LWJpdCBjb3VudGVyLCBtYXggfjEuMjVzZWNcbiAgICAgICAgICAgIHN5c2luZm8gPSBkYXRhWzddO1xuICAgICAgICAgICAgLy8gbGV0IGRzcHN0YXR1cyA9IGRhdGEuc2xpY2UoOCwgMTApO1xuICAgICAgICAgICAgZ2VzdHVyZSA9IGRhdGEuc2xpY2UoMTAsIDE0KTtcbiAgICAgICAgICAgIHRvdWNoID0gZGF0YS5zbGljZSgxNCwgMTgpO1xuICAgICAgICAgICAgYWlyd2hlZWwgPSBkYXRhLnNsaWNlKDE4LCAyMCk7XG4gICAgICAgICAgICAvLyBsZXQgeHl6ID0gZGF0YS5zbGljZSgyMCwgMjYpO1xuICAgICAgICAgICAgLy8gbGV0IG5vaXNlcG93ID0gZGF0YS5zbGljZSgyNywgMzApO1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICBnZXN0dXJlWzBdID09IDI1NSAmJlxuICAgICAgICAgICAgICBnZXN0dXJlWzFdID09IDI1NSAmJlxuICAgICAgICAgICAgICBnZXN0dXJlWzJdID09IDI1NSAmJlxuICAgICAgICAgICAgICBnZXN0dXJlWzNdID09IDI1NVxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgaWYgKGNvbmZpZ21hc2sgJiBtYXNrWFlaUG9zaXRpb24gJiYgc3lzaW5mbyAmIHN5c1Bvc2l0aW9uVmFsaWQpIHtcbiAgICAgICAgICAgICAgbGV0IHh5eiA9IHtcbiAgICAgICAgICAgICAgICAvL2xpdHRsZSBlbmRpYW5cbiAgICAgICAgICAgICAgICB4OiAoZGF0YVsyMF0gfCAoZGF0YVsyMV0gPDwgOCkpIC8gNjU1MzYsXG4gICAgICAgICAgICAgICAgeTogKGRhdGFbMjJdIHwgKGRhdGFbMjNdIDw8IDgpKSAvIDY1NTM2LFxuICAgICAgICAgICAgICAgIHo6IChkYXRhWzI0XSB8IChkYXRhWzI1XSA8PCA4KSkgLyA2NTUzNixcbiAgICAgICAgICAgICAgICBzZXE6IHNlcSxcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgdGhpcy54eXogPSB4eXo7XG4gICAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5vbnh5eiA9PSAnZnVuY3Rpb24nKSB0aGlzLm9ueHl6KHh5eik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjb25maWdtYXNrICYgbWFza0dlc3R1cmVJbmZvICYmIGdlc3R1cmVbMF0gPiAwKSB7XG4gICAgICAgICAgICAgIHRoaXMubGFzdEdlc3R1cmUgPSBnZXN0dXJlWzBdO1xuICAgICAgICAgICAgICBjb25zdCBnZXN0dXJlcyA9IFtcbiAgICAgICAgICAgICAgICBbJycsICcnLCAnJ10sIC8vbm8gZ2VzdHVyZVxuICAgICAgICAgICAgICAgIFsnZ2FyYmFnZScsICcnLCAnJ10sXG4gICAgICAgICAgICAgICAgWydmbGljaycsICd3ZXN0JywgJ2Vhc3QnXSwgLy8yXG4gICAgICAgICAgICAgICAgWydmbGljaycsICdlYXN0JywgJ3dlc3QnXSwgLy8zXG4gICAgICAgICAgICAgICAgWydmbGljaycsICdzb3V0aCcsICdub3J0aCddLCAvLzRcbiAgICAgICAgICAgICAgICBbJ2ZsaWNrJywgJ25vcnRoJywgJ3NvdXRoJ10sIC8vNVxuICAgICAgICAgICAgICAgIFsnY2lyY2xlJywgJ2Nsb2Nrd2lzZScsICcnXSxcbiAgICAgICAgICAgICAgICBbJ2NpcmNsZScsICdjb3VudGVyLWNsb2Nrd2lzZScsICcnXVsoJ3dhdmUnLCAneCcsICcnKV0sXG4gICAgICAgICAgICAgICAgWyd3YXZlJywgJ3knLCAnJ10sXG4gICAgICAgICAgICAgICAgWydob2xkJywgJycsICcnXSxcbiAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgICAgZm9yIChsZXQgaW5kZXggaW4gZ2VzdHVyZXMpIHtcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICBpbmRleCA9PSBnZXN0dXJlWzBdICYmXG4gICAgICAgICAgICAgICAgICB0eXBlb2YgdGhpcy5vbmdlc3R1cmVhbGwgPT0gJ2Z1bmN0aW9uJ1xuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgIHRoaXMub25nZXN0dXJlYWxsKHtcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiBnZXN0dXJlc1tpbmRleF1bMF0sXG4gICAgICAgICAgICAgICAgICAgIGZyb206IGdlc3R1cmVzW2luZGV4XVsxXSxcbiAgICAgICAgICAgICAgICAgICAgdG86IGdlc3R1cmVzW2luZGV4XVsyXSxcbiAgICAgICAgICAgICAgICAgICAgcmF3OiBnZXN0dXJlLFxuICAgICAgICAgICAgICAgICAgICBzZXE6IHNlcSxcbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgIGluZGV4ID09IGdlc3R1cmVbMF0gJiZcbiAgICAgICAgICAgICAgICAgIGdlc3R1cmVzW2luZGV4XVswXSA9PSAnZmxpY2snICYmXG4gICAgICAgICAgICAgICAgICB0eXBlb2YgdGhpcy5vbmdlc3R1cmUgPT0gJ2Z1bmN0aW9uJ1xuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgIHRoaXMub25nZXN0dXJlKHtcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiAnZ2VzdHVyZScsXG4gICAgICAgICAgICAgICAgICAgIGZyb206IGdlc3R1cmVzW2luZGV4XVsxXSxcbiAgICAgICAgICAgICAgICAgICAgdG86IGdlc3R1cmVzW2luZGV4XVsyXSxcbiAgICAgICAgICAgICAgICAgICAgcmF3OiBnZXN0dXJlLFxuICAgICAgICAgICAgICAgICAgICBzZXE6IHNlcSxcbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgY29uZmlnbWFzayAmIG1hc2tUb3VjaEluZm8gJiZcbiAgICAgICAgICAgICAgISh0b3VjaFswXSA9PSAwICYmIHRvdWNoWzFdID09IDApICYmXG4gICAgICAgICAgICAgIHRvdWNoWzNdID09IDBcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCd0b3VjaDogJyArIHRvdWNoLm1hcCh2ID0+ICcweCcgKyB2LnRvU3RyaW5nKDE2KSkpO1xuICAgICAgICAgICAgICBsZXQgdG91Y2hBY3Rpb24gPSB0b3VjaFswXSB8ICh0b3VjaFsxXSA8PCA4KTsgLy9saXR0bGUgZW5kaWFuXG4gICAgICAgICAgICAgIGlmICh0b3VjaEFjdGlvbiA9PSAweGZmZmYpIGJyZWFrO1xuICAgICAgICAgICAgICAvLyBsZXQgdG91Y2hDb3VudCA9IHRvdWNoWzJdICogNTsgLy8gdG91Y2ggY291bnRlciB2YWx1ZSAqIDVbbXNdXG4gICAgICAgICAgICAgIGNvbnN0IGFjdGlvbnMgPSBbXG4gICAgICAgICAgICAgICAgWyd0b3VjaCcsICdzb3V0aCddLCAvLzBcbiAgICAgICAgICAgICAgICBbJ3RvdWNoJywgJ3dlc3QnXSwgLy8xXG4gICAgICAgICAgICAgICAgWyd0b3VjaCcsICdub3J0aCddLCAvLzJcbiAgICAgICAgICAgICAgICBbJ3RvdWNoJywgJ2Vhc3QnXSwgLy8zXG4gICAgICAgICAgICAgICAgWyd0b3VjaCcsICdjZW50ZXInXSwgLy80XG4gICAgICAgICAgICAgICAgWyd0YXAnLCAnc291dGgnXSwgLy81XG4gICAgICAgICAgICAgICAgWyd0YXAnLCAnd2VzdCddLCAvLzZcbiAgICAgICAgICAgICAgICBbJ3RhcCcsICdub3J0aCddLCAvLzdcbiAgICAgICAgICAgICAgICBbJ3RhcCcsICdlYXN0J10sIC8vOFxuICAgICAgICAgICAgICAgIFsndGFwJywgJ2NlbnRlciddLCAvLzlcbiAgICAgICAgICAgICAgICBbJ2RvdWJsZXRhcCcsICdzb3V0aCddLCAvLzEwXG4gICAgICAgICAgICAgICAgWydkb3VibGV0YXAnLCAnd2VzdCddLCAvLzExXG4gICAgICAgICAgICAgICAgWydkb3VibGV0YXAnLCAnbm9ydGgnXSwgLy8xMlxuICAgICAgICAgICAgICAgIFsnZG91YmxldGFwJywgJ2Vhc3QnXSwgLy8xM1xuICAgICAgICAgICAgICAgIFsnZG91YmxldGFwJywgJ2NlbnRlciddLCAvLzE0XG4gICAgICAgICAgICAgIF07XG5cbiAgICAgICAgICAgICAgbGV0IHRvdWNoZXMgPSBbXTtcbiAgICAgICAgICAgICAgbGV0IHRhcHMgPSBbXTtcbiAgICAgICAgICAgICAgbGV0IGRvdWJsZXRhcHMgPSBbXTtcbiAgICAgICAgICAgICAgdGhpcy5sYXN0VG91Y2ggPSB0b3VjaEFjdGlvbjtcblxuICAgICAgICAgICAgICBsZXQgY29tcCA9IDE7XG4gICAgICAgICAgICAgIGZvciAobGV0IGluZGV4IGluIGFjdGlvbnMpIHtcbiAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSBhY3Rpb25zW2luZGV4XTtcbiAgICAgICAgICAgICAgICBpZiAodG91Y2hBY3Rpb24gJiBjb21wKSB7XG4gICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGB0b3VjaEFjdGlvbjoke3RvdWNoQWN0aW9uLnRvU3RyaW5nKDE2KX0sIGNvbXA6JHtjb21wLnRvU3RyaW5nKDE2KX0sIGluZGV4OiR7aW5kZXh9LCBncm91cDoke2dyb3VwfWApO1xuICAgICAgICAgICAgICAgICAgc3dpdGNoICh2YWx1ZVswXSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlICd0b3VjaCc6XG4gICAgICAgICAgICAgICAgICAgICAgdG91Y2hlcy5wdXNoKHZhbHVlWzFdKTtcbiAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAndGFwJzpcbiAgICAgICAgICAgICAgICAgICAgICB0YXBzLnB1c2godmFsdWVbMV0pO1xuICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdkb3VibGV0YXAnOlxuICAgICAgICAgICAgICAgICAgICAgIGRvdWJsZXRhcHMucHVzaCh2YWx1ZVsxXSk7XG4gICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbXAgPDw9IDE7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBpZiAodG91Y2hlcy5sZW5ndGggPiAwICYmIHR5cGVvZiB0aGlzLm9udG91Y2ggPT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICAgICAgICB0aGlzLm9udG91Y2goe1xuICAgICAgICAgICAgICAgICAgYWN0aW9uOiAndG91Y2gnLFxuICAgICAgICAgICAgICAgICAgcG9zaXRpb25zOiB0b3VjaGVzLFxuICAgICAgICAgICAgICAgICAgcmF3OiB0b3VjaCxcbiAgICAgICAgICAgICAgICAgIHNlcTogc2VxLFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgIGlmICh0YXBzLmxlbmd0aCA+IDAgJiYgdHlwZW9mIHRoaXMub250YXAgPT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICAgICAgICB0aGlzLm9udGFwKHtcbiAgICAgICAgICAgICAgICAgIGFjdGlvbjogJ3RhcCcsXG4gICAgICAgICAgICAgICAgICBwb3NpdGlvbnM6IHRhcHMsXG4gICAgICAgICAgICAgICAgICByYXc6IHRvdWNoLFxuICAgICAgICAgICAgICAgICAgc2VxOiBzZXEsXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIGRvdWJsZXRhcHMubGVuZ3RoID4gMCAmJlxuICAgICAgICAgICAgICAgIHR5cGVvZiB0aGlzLm9uZG91YmxldGFwID09ICdmdW5jdGlvbidcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIHRoaXMub25kb3VibGV0YXAoe1xuICAgICAgICAgICAgICAgICAgYWN0aW9uOiAnZG91YmxldGFwJyxcbiAgICAgICAgICAgICAgICAgIHBvc2l0aW9uczogZG91YmxldGFwcyxcbiAgICAgICAgICAgICAgICAgIHJhdzogdG91Y2gsXG4gICAgICAgICAgICAgICAgICBzZXE6IHNlcSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGNvbmZpZ21hc2sgJiBtYXNrQWlyV2hlZWxJbmZvICYmIHN5c2luZm8gJiBzeXNBaXJXaGVlbFZhbGlkKSB7XG4gICAgICAgICAgICAgIGxldCBkZWx0YSA9IChhaXJ3aGVlbFswXSAtIHRoaXMubGFzdFJvdGF0aW9uKSAvIDMyLjA7XG4gICAgICAgICAgICAgIHRoaXMucm90YXRpb24gKz0gZGVsdGEgKiAzNjAuMDtcbiAgICAgICAgICAgICAgdGhpcy5yb3RhdGlvbiAlPSAzNjA7XG4gICAgICAgICAgICAgIGlmIChkZWx0YSAhPSAwICYmIGRlbHRhID4gLTAuNSAmJiBkZWx0YSA8IDAuNSkge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5vbmFpcndoZWVsID09ICdmdW5jdGlvbicpXG4gICAgICAgICAgICAgICAgICB0aGlzLm9uYWlyd2hlZWwoe1xuICAgICAgICAgICAgICAgICAgICBkZWx0YTogZGVsdGEgKiAzNjAuMCxcbiAgICAgICAgICAgICAgICAgICAgcm90YXRpb246IHRoaXMucm90YXRpb24sXG4gICAgICAgICAgICAgICAgICAgIHJhdzogYWlyd2hlZWwsXG4gICAgICAgICAgICAgICAgICAgIHNlcTogc2VxLFxuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgdGhpcy5sYXN0Um90YXRpb24gPSBhaXJ3aGVlbFswXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgY2FzZSAweDE1OiAvL3N5c3RlbSBzdGF0dXNcbiAgICAgICAgICAgIHN0YXR1c0luZm8gPSB7XG4gICAgICAgICAgICAgIG1zZ0lkOiBkYXRhWzRdLFxuICAgICAgICAgICAgICBtYXhDbWRTaXplOiBkYXRhWzVdLFxuICAgICAgICAgICAgICBlcnJvcjogZGF0YVs2XSB8IChkYXRhWzddIDw8IDgpLCAvL2xpdHRsZSBlbmRpYW5cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLnN0YXR1c0luZm8gPSBzdGF0dXNJbmZvO1xuICAgICAgICAgICAgaWYgKHRoaXMuZGVidWdwcmludCB8fCB0aGlzLm9ibml6LmRlYnVncHJpbnQpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICAgICAgYGZsaWNrSGF0OiBzeXN0ZW0gc3RhdHVzOiB7bXNnSWQ6ICR7XG4gICAgICAgICAgICAgICAgICBzdGF0dXNJbmZvLm1zZ0lkXG4gICAgICAgICAgICAgICAgfSwgbWF4Q21kU2l6ZTogJHtzdGF0dXNJbmZvLm1heENtZFNpemV9LCBlcnJvcjogJHtcbiAgICAgICAgICAgICAgICAgIHN0YXR1c0luZm8uZXJyb3JcbiAgICAgICAgICAgICAgICB9fWBcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgY2FzZSAweDgzOiAvLyBmYXJtd2FyZSBpbmZvcm1hdGlvblxuICAgICAgICAgICAgZndJbmZvID0ge1xuICAgICAgICAgICAgICBmd1ZhbGlkOiBkYXRhWzRdID09IDB4YWEsXG4gICAgICAgICAgICAgIGh3UmV2OiBbZGF0YVs1XSwgZGF0YVs2XV0sXG4gICAgICAgICAgICAgIHBhcmFtU3RhcnRBZGRyOiBkYXRhWzddICogMTI4LFxuICAgICAgICAgICAgICBsaWJMb2FkZXJWZXI6IFtkYXRhWzhdLCBkYXRhWzldXSxcbiAgICAgICAgICAgICAgbGliTG9hZGVyUGxhdGZvcm06IGRhdGFbMTBdLFxuICAgICAgICAgICAgICBmd1N0YXJ0QWRkcjogZGF0YVsxMV0gKiAxMjgsXG4gICAgICAgICAgICAgIGZ3VmVyc2lvbjogdGhpcy5fZGF0YUFycmF5MnN0cmluZyhkYXRhLnNsaWNlKDEyLCAxMzIpKS5zcGxpdChcbiAgICAgICAgICAgICAgICAnXFwwJ1xuICAgICAgICAgICAgICApWzBdLFxuICAgICAgICAgICAgICBmd0luZm9SZWNlaXZlZDogdHJ1ZSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLmZ3SW5mbyA9IGZ3SW5mbztcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5vbmZ3aW5mbyA9PSAnZnVuY3Rpb24nKSB0aGlzLm9uZndpbmZvKGZ3SW5mbyk7XG4gICAgICAgICAgICB0aGlzLnJlYWRTaXplID0gMjY7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICAgICAgICBgdW5rbm93biBtZXNzYWdlOiAweCR7bXNnSUQudG9TdHJpbmcoMTYpfSwgZGF0YToke2RhdGFcbiAgICAgICAgICAgICAgICAuc2xpY2UoMCwgc2l6ZSlcbiAgICAgICAgICAgICAgICAubWFwKHYgPT4gJzB4JyArIHYudG9TdHJpbmcoMTYpKX1gXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuaW9fdHMucHVsbCgnM3YnKTtcbiAgICAgIC8vYXdhaXQgdGhpcy5vYm5pei53YWl0KDEpO1xuICAgIH1cbiAgfVxufVxuXG5pZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBGbGlja0hhdDtcbn1cbiJdfQ==

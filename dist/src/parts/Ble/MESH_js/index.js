"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MESH_js {
    constructor() {
        this._battery = -1;
        this.onBattery = null;
        this.onStatusButtonPressed = null;
    }
    feature() {
        return [0, 2, 1, 3];
    }
    get battery() {
        return this._battery;
    }
    notify(data) {
        this.updateBattery(data);
        this.updateStatusButton(data);
    }
    printData(message) {
        console.log('bat: ' + this._battery + ', ' + message);
    }
    checkSum(command) {
        let sum = 0;
        command.forEach((val) => {
            sum += val;
        });
        return sum % 256;
    }
    errorMessage(message) {
        console.log('[Error] Can not parse; ' + message);
    }
    errorOutOfRange(message) {
        console.log(this.errorMessage('out of range ' + message));
    }
    updateBattery(data) {
        if (data.length !== 4) {
            return;
        }
        if (data[0] !== 0) {
            return;
        }
        if (data[1] !== 0) {
            return;
        }
        // if (data[2] === this.battery) {
        //   return;
        // }
        this._battery = data[2];
        if (typeof this.onBattery !== 'function') {
            return;
        }
        this.onBattery(this._battery);
    }
    updateStatusButton(data) {
        if (data.length !== 4) {
            return;
        }
        if (data[0] !== 0) {
            return;
        }
        if (data[1] !== 1) {
            return;
        }
        if (data[2] !== 0) {
            return;
        }
        if (typeof this.onStatusButtonPressed !== 'function') {
            return;
        }
        this.onStatusButtonPressed();
    }
}
exports.MESH_js = MESH_js;
class MESH_BU extends MESH_js {
    constructor() {
        super(...arguments);
        // public static type = { single: 1, long: 2, double: 3 } as const;
        this.type = { single: 1, long: 2, double: 3 };
        this.onSinglePressed = null;
        this.onLongPressed = null;
        this.onDoublePressed = null;
    }
    // public onButton: ((resp: number) => void) | null = null;
    notify(data) {
        super.notify(data);
        if (data.length !== 4) {
            return;
        }
        if (data[0] !== 1) {
            return;
        }
        if (data[1] !== 0) {
            return;
        }
        // if (typeof this.onButton !== 'function') {
        //   return;
        // }
        // this.onButton(data[2]);
        switch (data[2]) {
            case this.type.single:
                if (typeof this.onSinglePressed === 'function') {
                    this.onSinglePressed();
                }
                break;
            case this.type.long:
                if (typeof this.onLongPressed === 'function') {
                    this.onLongPressed();
                }
                break;
            case this.type.double:
                if (typeof this.onDoublePressed === 'function') {
                    this.onDoublePressed();
                }
                break;
            default:
                break;
        }
    }
}
exports.MESH_BU = MESH_BU;
class MESH_LE extends MESH_js {
    constructor() {
        super(...arguments);
        this._pattern = { BLICK: 1, FUWA: 2 };
    }
    notify(data) {
        super.notify(data);
    }
    lightup(red, green, blue, time, cycle_on, cycle_off, pattern) {
        if (red < 0 || 127 < red) {
            this.errorOutOfRange('red (' + red + ') must be 0 ~ 127.');
            return [];
        }
        if (green < 0 || 127 < green) {
            this.errorOutOfRange('green (' + green + ') must be 0 ~ 127.');
            return [];
        }
        if (blue < 0 || 127 < blue) {
            this.errorOutOfRange('blue (' + blue + ') must be 0 ~ 127.');
            return [];
        }
        if (time < 0 || 65535 < time) {
            this.errorOutOfRange('time (' + time + ') must be 0 ~ 65,535.');
            return [];
        }
        if (cycle_on < 0 || 65535 < cycle_on) {
            this.errorOutOfRange('cycle_on (' + cycle_on + ') must be 0 ~ 65,535.');
            return [];
        }
        if (cycle_off < 0 || 65535 < cycle_off) {
            this.errorOutOfRange('cycle_off (' + cycle_off + ') must be 0 ~ 65,535.');
            return [];
        }
        const data = [
            1,
            0,
            red,
            0,
            green,
            0,
            blue,
            time % 256,
            Math.floor(time / 256),
            cycle_on % 256,
            Math.floor(cycle_on / 256),
            cycle_off % 256,
            Math.floor(cycle_off / 256),
            pattern,
        ];
        data.push(this.checkSum(data));
        return data;
    }
}
exports.MESH_LE = MESH_LE;
class MESH_AC extends MESH_js {
    constructor() {
        super(...arguments);
        this.accele = { x: -1, y: -1, z: -1 };
        this.face = -1;
        this.onTapped = null;
        this.onShaked = null;
        this.onFlipped = null;
        this.onDirection = null;
    }
    notify(data) {
        super.notify(data);
        this.updateFace(data);
        this.updateAccele(data);
        if (data[0] !== 1) {
            return;
        }
        switch (data[1]) {
            case 0: // Tap
                if (typeof this.onTapped === 'function') {
                    this.onTapped(this.accele);
                }
                break;
            case 1: // Shake
                if (typeof this.onShaked === 'function') {
                    this.onShaked(this.accele);
                }
                break;
            case 2: // Flip
                if (typeof this.onFlipped === 'function') {
                    this.onFlipped(this.accele);
                }
                break;
            case 3: // Direction
                if (typeof this.onDirection === 'function') {
                    this.onDirection(this.face, this.accele);
                }
                break;
            default:
                break;
        }
    }
    getAccele() {
        return this.accele;
    }
    getFace() {
        return this.face;
    }
    printData() {
        super.printData('face: ' +
            this.face +
            ', accele {x: ' +
            this.accele.x +
            ',y: ' +
            this.accele.y +
            ',z: ' +
            this.accele.z +
            '}');
    }
    updateFace(data) {
        if (data.length !== 17) {
            return;
        }
        if (data[0] !== 1) {
            return;
        }
        if (data[1] !== 3) {
            return;
        }
        this.face = data[2];
    }
    updateAccele(data) {
        if (data.length !== 17) {
            return;
        }
        if (data[0] !== 1) {
            return;
        }
        this.accele.x = 256 * data[5] + data[4];
        this.accele.y = 256 * data[7] + data[6];
        this.accele.z = 256 * data[9] + data[8];
    }
}
exports.MESH_AC = MESH_AC;
class MESH_PA extends MESH_js {
    notify(data) {
        super.notify(data);
    }
}
exports.MESH_PA = MESH_PA;
class MESH_TH extends MESH_js {
    notify(data) {
        super.notify(data);
    }
    setMode(temperature_upper, temperature_bottom, temperature_condition, humidity_upper, humidity_bottom, humidity_condision, type) {
        const data = [
            1,
            0,
            1,
            (100 * temperature_upper) % 256,
            Math.floor((100 * temperature_upper) / 256),
            (100 * temperature_bottom) % 256,
            Math.floor((100 * temperature_bottom) / 256),
            (100 * humidity_upper) % 256,
            Math.floor((100 * humidity_upper) / 256),
            (100 * humidity_bottom) % 256,
            Math.floor((100 * humidity_bottom) / 256),
            temperature_condition,
            humidity_condision,
            type,
        ];
        data.push(this.checkSum(data));
        return data;
    }
}
exports.MESH_TH = MESH_TH;
class MESH_MD extends MESH_js {
    notify(data) {
        super.notify(data);
        if (data[0] !== 1) {
            return;
        }
        if (data[1] !== 0) {
            return;
        }
    }
    setMode(requestid, mode, time1, time2) {
        const data = [
            1,
            0,
            requestid,
            mode,
            time1 % 256,
            Math.floor(time1 / 256),
            time2 % 256,
            Math.floor(time2 / 256),
        ];
        data.push(this.checkSum(data));
        console.log('send data:' + data);
        return data;
    }
}
exports.MESH_MD = MESH_MD;

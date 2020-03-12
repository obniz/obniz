"use strict";
/**
 * @packageDocumentation
 * @module Parts.iBS01T
 */
Object.defineProperty(exports, "__esModule", { value: true });
class IBS01T {
    constructor() {
        this.deviceAdv = [
            0xff,
            0x59,
            0x00,
            0x80,
            0xbc,
            -1,
            -1,
            -1,
            -1,
            -1,
            -1,
            -1,
            -1,
            -1,
            -1,
            -1,
            -1,
            -1,
        ];
        this.repeat_flg = false;
        this.ble_setting = {
            duplicate: true,
        };
        this.keys = [];
        this.requiredKeys = [];
        this.periperal = null;
    }
    static info() {
        return {
            name: "iBS01T",
        };
    }
    wired(obniz) {
        this.obniz = obniz;
    }
    scan(address = "") {
        this.obniz.ble.scan.onfind = (peripheral) => {
            const advertise = peripheral.advertise_data_rows.filter((adv) => {
                let find = false;
                if (this.deviceAdv.length > adv.length) {
                    return find;
                }
                for (let index = 0; index < this.deviceAdv.length; index++) {
                    if (this.deviceAdv[index] === -1) {
                        continue;
                    }
                    if (adv[index] === this.deviceAdv[index]) {
                        find = true;
                        continue;
                    }
                    find = false;
                    break;
                }
                return find;
            });
            //    console.log(advertise);
            if (advertise.length === 0) {
                return;
            }
            if (advertise[0][8] === 0xff &&
                advertise[0][9] === 0xff &&
                advertise[0][10] === 0xff &&
                advertise[0][11] === 0xff) {
                // error iBS01T
                return;
            }
            const data = {
                battery: (advertise[0][5] + advertise[0][6] * 0xff) * 0.01,
                event: advertise[0][7],
                temperature: this.signed16FromBinary(advertise[0][8], advertise[0][9]) * 0.01,
                humidity: this.signed16FromBinary(advertise[0][10], advertise[0][11]),
                address: peripheral.address,
            };
            // console.log(`battery ${data.battery}V event ${data.event} temperature ${data.temperature} humidity ${data.humidity}`);
            if (this.onNotification) {
                this.onNotification(data);
            }
        };
        this.obniz.ble.scan.onfinish = () => {
            if (this.repeat_flg) {
                this.obniz.ble.scan.start(null, this.ble_setting);
            }
        };
        this.obniz.ble.initWait();
        if (address && address.length >= 12) {
            this.obniz.ble.scan.start({ deviceAddress: address }, this.ble_setting);
        }
        else {
            this.obniz.ble.scan.start(null, this.ble_setting);
        }
        this.repeat_flg = true;
    }
    end() {
        this.repeat_flg = false;
        this.obniz.ble.scan.end();
    }
    signed16FromBinary(val1, val2) {
        let val = val1 + val2 * 0xff;
        if ((val & 0x8000) !== 0) {
            val = val - 0x10000;
        }
        return val;
    }
}
exports.default = IBS01T;

//# sourceMappingURL=index.js.map

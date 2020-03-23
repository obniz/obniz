"use strict";
/**
 * @packageDocumentation
 * @module Parts.iBS03
 */
Object.defineProperty(exports, "__esModule", { value: true });
class IBS03 {
    constructor() {
        this.deviceAdv = [
            0xff,
            0x0d,
            0x00,
            0x83,
            0xbc,
            -1,
            -1,
            -1,
            -1,
            -1,
            -1,
            -1,
            0x00,
            -1,
            -1,
            -1,
            0x00,
            0x00,
        ];
        this.repeat_flg = false;
        this.ble_setting = {
            duplicate: true,
        };
        this.keys = [];
        this.requiredKeys = [];
    }
    static info() {
        return {
            name: "iBS03",
        };
    }
    static signed16FromBinary(val1, val2) {
        let val = val1 + val2 * 256;
        if ((val & 0x8000) !== 0) {
            val = val - 0x10000;
        }
        return val;
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
            if (advertise.length === 0) {
                return;
            }
            const type = advertise[0][14];
            if (type !== 16) {
                // iBS03以外
                return;
            }
            const data = {
                battery: (advertise[0][5] + advertise[0][6] * 256) * 0.01,
                event: advertise[0][7],
                address: peripheral.address,
            };
            // console.log(`battery ${data.battery}V event ${data.event} address ${data.address}`);
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
}
exports.default = IBS03;

//# sourceMappingURL=index.js.map

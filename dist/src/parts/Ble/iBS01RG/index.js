"use strict";
/**
 * @packageDocumentation
 * @module Parts.iBS01RG
 */
Object.defineProperty(exports, "__esModule", { value: true });
class IBS01RG {
    constructor() {
        this.deviceAdv = [
            0xff,
            0x59,
            0x00,
            0x81,
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
        this.oldActiveFlg = false;
        this.oldButtonFlg = false;
    }
    static info() {
        return {
            name: "iBS01RG",
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
            //    console.log(advertise);
            if (advertise.length === 0) {
                return;
            }
            const accelArray = [];
            for (let i = 0; i < 3; i++) {
                accelArray.push({
                    x: IBS01RG.signed16FromBinary(advertise[0][7 + i * 6], advertise[0][8 + i * 6]),
                    y: IBS01RG.signed16FromBinary(advertise[0][9 + i * 6], advertise[0][10 + i * 6]),
                    z: IBS01RG.signed16FromBinary(advertise[0][11 + i * 6], advertise[0][12 + i * 6]),
                });
            }
            console.log((advertise[0][6] & 0x0f) * 0xff);
            console.log((advertise[0][6] & 0x30) >> 4);
            const data = {
                battery: (advertise[0][5] + (advertise[0][6] & 0x0f) * 256) * 0.01,
                active: Boolean((advertise[0][6] & 0x10) >> 4),
                button: Boolean((advertise[0][6] & 0x20) >> 5),
                acceleration: accelArray,
                address: peripheral.address,
            };
            // console.log(`battery ${data.battery}V event ${data.event});
            if (this.onNotification) {
                this.onNotification(data);
            }
            if (this.onChangeButton) {
                const button = Boolean((advertise[0][6] & 0x20) >> 5);
                if (button !== this.oldButtonFlg) {
                    this.onChangeButton(button, peripheral.address);
                    this.oldButtonFlg = button;
                }
            }
            if (this.onChangeActive) {
                const actived = Boolean((advertise[0][6] & 0x10) >> 4);
                if (actived !== this.oldActiveFlg) {
                    this.onChangeActive(actived, peripheral.address);
                    this.oldActiveFlg = actived;
                }
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
exports.default = IBS01RG;

//# sourceMappingURL=index.js.map

"use strict";
/**
 * @packageDocumentation
 * @module Parts.iBS03TP
 */
Object.defineProperty(exports, "__esModule", { value: true });
class IBS03TP {
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
        this.periperal = null;
    }
    static info() {
        return {
            name: "iBS03TP",
        };
    }
    wired(obniz) {
        this.obniz = obniz;
    }
    scan() {
        this.obniz.ble.scan.onfind = (peripheral) => {
            if (peripheral.address === "806fb0c8a2cb") {
                console.log(peripheral);
            }
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
            const type = advertise[0][14];
            if (type !== 23) {
                // iBS03TP以外
                return;
            }
            const data = {
                battery: (advertise[0][5] + advertise[0][6] * 0xff) * 0.01,
                event: advertise[0][7],
                temp: this.signedNumberFromBinary(advertise[0][8], advertise[0][9]) * 0.01,
                probe_temp: this.signedNumberFromBinary(advertise[0][10], advertise[0][11]) * 0.01,
            };
            // console.log(
            //   `battery ${data.battery}V event ${data.event} uuid ${data.uuid} major ${data.major} minor ${data.minor} rssi ${data.rssi}`,
            // );
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
        this.obniz.ble.scan.start(null, this.ble_setting);
        this.repeat_flg = true;
    }
    end() {
        this.repeat_flg = false;
        this.obniz.ble.scan.end();
    }
    signedNumberFromBinary(val1, val2) {
        let val = (val2 & 0x7f) * 256 + val1;
        if ((val2 & 0x80) !== 0) {
            val = val - Math.pow(2, 15);
        }
        return val;
    }
}
exports.default = IBS03TP;

//# sourceMappingURL=index.js.map

"use strict";
/**
 * @packageDocumentation
 * @module Parts.iBS01
 */
Object.defineProperty(exports, "__esModule", { value: true });
class IBS01 {
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
        this.oldButtonFlg = false;
        this.oldMovingFlg = false;
        this.oldHallSensorFlg = false;
    }
    static info() {
        return {
            name: "iBS01",
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
            if (advertise[0][8] !== 0xff &&
                advertise[0][9] !== 0xff &&
                advertise[0][10] !== 0xff &&
                advertise[0][11] !== 0xff) {
                // error iBS01
                return;
            }
            const data = {
                battery: (advertise[0][5] + advertise[0][6] * 256) * 0.01,
                event: advertise[0][7],
                address: peripheral.address,
            };
            // console.log(`battery ${data.battery}V event ${data.event});
            if (this.onNotification) {
                this.onNotification(data);
            }
            if (this.onChangeButton) {
                const button = Boolean(advertise[0][7] & 0b001);
                if (button !== this.oldButtonFlg) {
                    this.onChangeButton(button, peripheral.address);
                    this.oldButtonFlg = button;
                }
            }
            if (this.onChangeMoving) {
                const moved = Boolean((advertise[0][7] & 0b010) >> 1);
                if (moved !== this.oldMovingFlg) {
                    this.onChangeMoving(moved, peripheral.address);
                    this.oldMovingFlg = moved;
                }
            }
            if (this.onChangeHallSensor) {
                const closed = Boolean((advertise[0][7] & 0b100) >> 2);
                if (closed !== this.oldHallSensorFlg) {
                    this.onChangeHallSensor(closed, peripheral.address);
                    this.oldHallSensorFlg = closed;
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
exports.default = IBS01;

//# sourceMappingURL=index.js.map

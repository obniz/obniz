"use strict";
/**
 * @packageDocumentation
 * @module Parts.iBS04i
 */
Object.defineProperty(exports, "__esModule", { value: true });
class IBS04I {
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
            0xff,
            0xff,
            0xff,
            0xff,
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
            name: "iBS04i",
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
            if (advertise.length === 0) {
                if (peripheral.localName && peripheral.localName === "iBS04") {
                    const d = {
                        battery: -1,
                        event: -1,
                        uuid: peripheral.iBeacon.uuid,
                        major: peripheral.iBeacon.major,
                        minor: peripheral.iBeacon.minor,
                        power: peripheral.iBeacon.power,
                        rssi: peripheral.iBeacon.rssi,
                        address: peripheral.address,
                    };
                    if (this.onNotification) {
                        this.onNotification(d);
                    }
                }
                return;
            }
            const type = advertise[0][14];
            if (type !== 24) {
                // iBS04i以外
                return;
            }
            //    console.log(advertise);
            const data = {
                battery: (advertise[0][5] + advertise[0][6] * 0xff) * 0.01,
                event: advertise[0][7],
                uuid: peripheral.iBeacon.uuid,
                major: peripheral.iBeacon.major,
                minor: peripheral.iBeacon.minor,
                power: peripheral.iBeacon.power,
                rssi: peripheral.iBeacon.rssi,
                address: peripheral.address,
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
exports.default = IBS04I;

//# sourceMappingURL=index.js.map

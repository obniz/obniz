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
        this.ble_setting = {
            duplicate: true,
        };
        this.keys = [];
        this.requiredKeys = [];
        this.periperal = null;
    }
    static info() {
        return {
            name: "iBS04i",
        };
    }
    wired(obniz) {
        this.obniz = obniz;
    }
    async scanWait() {
        this.obniz.ble.scan.onfind = (peripheral) => {
            // console.log(peripheral);
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
                    };
                    if (this.onNotification) {
                        this.onNotification(d);
                    }
                }
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
            };
            console.log(`battery ${data.battery}V event ${data.event} uuid ${data.uuid} major ${data.major} minor ${data.minor} rssi ${data.rssi}`);
            if (this.onNotification) {
                this.onNotification(data);
            }
        };
        this.obniz.ble.scan.onfinish = () => {
            console.log("scan timeout!");
            this.obniz.ble.scan.start(null, this.ble_setting);
        };
        await this.obniz.ble.initWait();
        this.obniz.ble.scan.start(null, this.ble_setting);
    }
    end() {
        this.obniz.ble.scan.end();
    }
}
exports.default = IBS04I;

//# sourceMappingURL=index.js.map

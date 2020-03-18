"use strict";
/**
 * @packageDocumentation
 * @module Parts.SCBTGAAAC
 */
Object.defineProperty(exports, "__esModule", { value: true });
class SCBTGAAAC {
    constructor() {
        this.repeat_flg = false;
        this.ble_setting = {
            duplicate: true,
        };
        this.keys = [];
        this.requiredKeys = [];
    }
    static info() {
        return {
            name: "S-CBTGAAAC",
        };
    }
    wired(obniz) {
        this.obniz = obniz;
    }
    scan(address = "") {
        this.obniz.ble.scan.onfind = (peripheral) => {
            if (peripheral.iBeacon) {
                console.log(peripheral);
                if (this.onNotification) {
                    this.onNotification(peripheral.iBeacon.minor);
                }
            }
            // console.log(`battery ${data.battery}V event ${data.event} address ${data.address});
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
exports.default = SCBTGAAAC;

//# sourceMappingURL=index.js.map

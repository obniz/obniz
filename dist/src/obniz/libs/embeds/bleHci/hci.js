"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
class ObnizBLEHci {
    constructor(Obniz) {
        this.Obniz = Obniz;
    }
    write(hciCommand) {
        this.Obniz.send({
            ble: {
                hci: {
                    write: hciCommand,
                },
            },
        });
    }
    notified(obj) {
        if (obj.read && obj.read.data) {
            this.onread(obj.read.data);
        }
    }
    onread(data) {
    }
}
exports.default = ObnizBLEHci;

//# sourceMappingURL=hci.js.map

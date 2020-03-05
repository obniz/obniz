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
    /**
     * Initialize BLE HCI module
     */
    init() {
        this.Obniz.send({
            ble: {
                hci: {
                    initialize: true,
                },
            },
        });
    }
    /**
     * Deinitalize BLE HCI module
     */
    end() {
        this.Obniz.send({
            ble: {
                hci: null,
            },
        });
    }
    /**
     * write HCI command to HCI module
     * @param hciCommand
     */
    write(hciCommand) {
        this.Obniz.send({
            ble: {
                hci: {
                    write: hciCommand,
                },
            },
        });
    }
    /**
     * @ignore
     * @param obj
     */
    notified(obj) {
        if (obj.read && obj.read.data) {
            this.onread(obj.read.data);
        }
    }
    /**
     * Callback on HCI command received.
     * @param data
     */
    onread(data) {
    }
}
exports.default = ObnizBLEHci;
//# sourceMappingURL=hci.js.map
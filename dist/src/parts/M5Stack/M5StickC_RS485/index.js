"use strict";
/**
 * @packageDocumentation
 * @module Parts.M5StackC_RS485
 */
Object.defineProperty(exports, "__esModule", { value: true });
class M5StickC_RS485 {
    constructor() {
        this.keys = ["tx", "rx", "gnd", "vcc", "baud"];
        this.requiredKeys = ["tx", "rx"];
    }
    static info() {
        return {
            name: "M5StickC_RS485",
        };
    }
    wired(obniz) {
        if (obniz.isValidIO(this.params.gnd)) {
            obniz.getIO(this.params.gnd).output(false);
        }
        if (obniz.isValidIO(this.params.vcc)) {
            obniz.getIO(this.params.vcc).output(true);
        }
        this.params.baud = this.params.baud || 9600;
        this.uart = obniz.getFreeUart();
        this.uart.start({
            tx: this.params.tx,
            rx: this.params.rx,
            baud: this.params.baud,
        });
        this.uart.onreceive = (data, text) => {
            if (typeof this.onreceive === "function") {
                this.onreceive(data, text);
            }
        };
    }
    send(data) {
        this.uart.send(data);
    }
}
exports.default = M5StickC_RS485;
//# sourceMappingURL=index.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LED {
    constructor() {
        this.keys = ["anode", "cathode"];
        this.requiredKeys = ["anode"];
    }
    static info() {
        return {
            name: "LED",
        };
    }
    wired(obniz) {
        function getIO(io) {
            if (io && typeof io === "object") {
                if (typeof io.output === "function") {
                    return io;
                }
            }
            return obniz.getIO(io);
        }
        this.obniz = obniz;
        if (this.obniz.isValidIO(this.params.anode)) {
            this.io_anode = getIO(this.params.anode);
        }
        if (this.obniz.isValidIO(this.params.cathode)) {
            this.io_cathode = getIO(this.params.cathode);
        }
        this.animationName = "Led-" + this.params.anode;
    }
    on() {
        this.endBlink();
        if (this.io_anode) {
            this.io_anode.output(true);
        }
        if (this.io_cathode) {
            this.io_cathode.output(false);
        }
    }
    off() {
        this.endBlink();
        if (this.io_anode) {
            this.io_anode.output(false);
        }
        if (this.io_cathode) {
            this.io_cathode.output(true);
        }
    }
    output(value) {
        if (value) {
            this.on();
        }
        else {
            this.off();
        }
    }
    endBlink() {
        this.obniz.io.animation(this.animationName, "pause");
    }
    blink(interval) {
        if (!interval) {
            interval = 100;
        }
        const frames = [
            {
                duration: interval,
                state: (index) => {
                    // index = 0
                    this.on(); // on
                },
            },
            {
                duration: interval,
                state: (index) => {
                    // index = 0
                    this.off();
                },
            },
        ];
        this.obniz.io.animation(this.animationName, "loop", frames);
    }
}
exports.default = LED;

//# sourceMappingURL=index.js.map

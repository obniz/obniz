"use strict";
/**
 * @packageDocumentation
 * @module Parts.Grove_Collision_sensor
 */
Object.defineProperty(exports, "__esModule", { value: true });
class Grove_Collision {
    constructor() {
        this.isCollided = null;
        this.onchange = null;
        this.onChangeForStateWait = (pressed) => { };
        this.keys = ["gnd", "vcc", "signal", "grove"];
        this.requiredKeys = [];
    }
    static info() {
        return {
            name: "Grove_Collision_sensor",
        };
    } // 変数,その他宣言、設定
    // 接続
    wired(obniz) {
        // groveの時の接続方法
        if (this.params.grove) {
            const groveIOs = this.params.grove.getDigital("3v");
            this.io_signal = groveIOs.primary;
        }
        else {
            // groveじゃない時の接続方法
            this.io_signal = obniz.getIO(this.params.signal);
            obniz.setVccGnd(this.params.vcc, this.params.gnd, "3v");
        }
        this.io_signal.pull("3v");
        this.io_signal.input((value) => {
            this.isCollided = value;
            if (this.onchange) {
                this.onchange(value);
            }
            this.onChangeForStateWait(value);
        });
    }
    async isCollidedWait() {
        return await this.io_signal.inputWait();
    }
    stateWait(isCollided) {
        return new Promise((resolve, reject) => {
            this.onChangeForStateWait = (pressed) => {
                if (isCollided === pressed) {
                    this.onChangeForStateWait = () => { };
                    resolve();
                }
            };
        });
    }
}
exports.default = Grove_Collision;

//# sourceMappingURL=index.js.map

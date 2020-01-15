"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class ENC03R_Module {
    constructor() {
        this.keys = ["vcc", "out1", "out2", "gnd"];
        this.requiredKeys = ["out1", "out2"];
        this.Sens = 0.00067; // Sensitivity, 0.67mV / deg/sec
    }
    static info() {
        return {
            name: "ENC03R_Module",
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
        this.ad0 = obniz.getAD(this.params.out1);
        this.ad1 = obniz.getAD(this.params.out2);
        this.ad0.start((value) => {
            this.sens1 = (value - 1.45) / this.Sens; // [Angular velocity(deg/sec)] = ( [AD Voltage]-1.35V ) / 0.67mV
            if (this.onchange1) {
                this.onchange1(this.sens1);
            }
        });
        this.ad1.start((value) => {
            this.sens2 = (value - 1.35) / this.Sens; // [Angular velocity(deg/sec)] = ( [AD Voltage]-1.35V ) / 0.67mV
            if (this.onchange2) {
                this.onchange2(this.sens2);
            }
        });
    }
    get1Wait() {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            const value = this.ad0.getWait();
            this.sens1 = (value - 1.45) / this.Sens;
            resolve(this.sens1);
        }));
    }
    get2Wait() {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            const value = this.ad1.getWait();
            this.sens2 = (value - 1.35) / this.Sens;
            resolve(this.sens2);
        }));
    }
}
exports.default = ENC03R_Module;

//# sourceMappingURL=index.js.map

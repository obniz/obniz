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
class I2cPartsAbstruct {
    constructor() {
        this.keys = ["gnd", "vcc", "sda", "scl", "i2c", "vcc"];
        this.requiredKeys = [];
        this.i2cinfo = this.i2cInfo();
        this.address = this.i2cinfo.address;
    }
    i2cInfo() {
        throw new Error("abstruct class");
        // eslint-disable-next-line no-unreachable
        return {
            address: 0x00,
            clock: 100000,
            voltage: "3v",
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        obniz.setVccGnd(this.params.vcc, this.params.gnd, this.i2cinfo.voltage);
        this.params.clock = this.i2cinfo.clock;
        this.params.pull = this.i2cinfo.voltage;
        this.params.mode = "master";
        // @ts-ignore
        this.i2c = this.obniz.getI2CWithConfig(this.params);
    }
    char2short(val1, val2) {
        const buffer = new ArrayBuffer(2);
        const dv = new DataView(buffer);
        dv.setUint8(0, val1);
        dv.setUint8(1, val2);
        return dv.getInt16(0, false);
    }
    readWait(command, length) {
        return __awaiter(this, void 0, void 0, function* () {
            this.i2c.write(this.address, [command]);
            return yield this.i2c.readWait(this.address, length);
        });
    }
    readUint16Wait(command, length) {
        return __awaiter(this, void 0, void 0, function* () {
            this.i2c.write(this.address, [command]);
            return yield this.i2c.readWait(this.address, length);
        });
    }
    write(command, buf) {
        if (!Array.isArray(buf)) {
            buf = [buf];
        }
        this.i2c.write(this.address, [command, ...buf]);
    }
}
exports.default = I2cPartsAbstruct;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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QUFDLENBQUM7U0FDYjtRQUNELElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxPQUFPLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ2xELENBQUM7Q0FDRjtBQUVELGtCQUFlLGdCQUFnQixDQUFDIiwiZmlsZSI6InNyYy9wYXJ0cy9pMmNQYXJ0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIEkyY1BhcnRzQWJzdHJ1Y3Qge1xuICBwdWJsaWMga2V5czogYW55O1xuICBwdWJsaWMgcmVxdWlyZWRLZXlzOiBhbnk7XG4gIHB1YmxpYyBpMmNpbmZvOiBhbnk7XG4gIHB1YmxpYyBhZGRyZXNzOiBhbnk7XG4gIHB1YmxpYyBvYm5pejogYW55O1xuICBwdWJsaWMgcGFyYW1zOiBhbnk7XG4gIHB1YmxpYyBpMmM6IGFueTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmtleXMgPSBbXCJnbmRcIiwgXCJ2Y2NcIiwgXCJzZGFcIiwgXCJzY2xcIiwgXCJpMmNcIiwgXCJ2Y2NcIl07XG4gICAgdGhpcy5yZXF1aXJlZEtleXMgPSBbXTtcblxuICAgIHRoaXMuaTJjaW5mbyA9IHRoaXMuaTJjSW5mbygpO1xuICAgIHRoaXMuYWRkcmVzcyA9IHRoaXMuaTJjaW5mby5hZGRyZXNzO1xuICB9XG5cbiAgcHVibGljIGkyY0luZm8oKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiYWJzdHJ1Y3QgY2xhc3NcIik7XG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5yZWFjaGFibGVcbiAgICByZXR1cm4ge1xuICAgICAgYWRkcmVzczogMHgwMCxcbiAgICAgIGNsb2NrOiAxMDAwMDAsXG4gICAgICB2b2x0YWdlOiBcIjN2XCIsXG4gICAgfTtcbiAgfVxuXG4gIHB1YmxpYyB3aXJlZChvYm5pejogYW55KSB7XG4gICAgdGhpcy5vYm5peiA9IG9ibml6O1xuXG4gICAgb2JuaXouc2V0VmNjR25kKHRoaXMucGFyYW1zLnZjYywgdGhpcy5wYXJhbXMuZ25kLCB0aGlzLmkyY2luZm8udm9sdGFnZSk7XG4gICAgdGhpcy5wYXJhbXMuY2xvY2sgPSB0aGlzLmkyY2luZm8uY2xvY2s7XG4gICAgdGhpcy5wYXJhbXMucHVsbCA9IHRoaXMuaTJjaW5mby52b2x0YWdlO1xuICAgIHRoaXMucGFyYW1zLm1vZGUgPSBcIm1hc3RlclwiO1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICB0aGlzLmkyYyA9IHRoaXMub2JuaXouZ2V0STJDV2l0aENvbmZpZyh0aGlzLnBhcmFtcyk7XG4gIH1cblxuICBwdWJsaWMgY2hhcjJzaG9ydCh2YWwxOiBhbnksIHZhbDI6IGFueSkge1xuICAgIGNvbnN0IGJ1ZmZlcjogYW55ID0gbmV3IEFycmF5QnVmZmVyKDIpO1xuICAgIGNvbnN0IGR2OiBhbnkgPSBuZXcgRGF0YVZpZXcoYnVmZmVyKTtcbiAgICBkdi5zZXRVaW50OCgwLCB2YWwxKTtcbiAgICBkdi5zZXRVaW50OCgxLCB2YWwyKTtcbiAgICByZXR1cm4gZHYuZ2V0SW50MTYoMCwgZmFsc2UpO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIHJlYWRXYWl0KGNvbW1hbmQ6IGFueSwgbGVuZ3RoOiBhbnkpIHtcbiAgICB0aGlzLmkyYy53cml0ZSh0aGlzLmFkZHJlc3MsIFtjb21tYW5kXSk7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuaTJjLnJlYWRXYWl0KHRoaXMuYWRkcmVzcywgbGVuZ3RoKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyByZWFkVWludDE2V2FpdChjb21tYW5kOiBhbnksIGxlbmd0aDogYW55KSB7XG4gICAgdGhpcy5pMmMud3JpdGUodGhpcy5hZGRyZXNzLCBbY29tbWFuZF0pO1xuICAgIHJldHVybiBhd2FpdCB0aGlzLmkyYy5yZWFkV2FpdCh0aGlzLmFkZHJlc3MsIGxlbmd0aCk7XG4gIH1cblxuICBwdWJsaWMgd3JpdGUoY29tbWFuZDogYW55LCBidWY6IGFueSkge1xuICAgIGlmICghQXJyYXkuaXNBcnJheShidWYpKSB7XG4gICAgICBidWYgPSBbYnVmXTtcbiAgICB9XG4gICAgdGhpcy5pMmMud3JpdGUodGhpcy5hZGRyZXNzLCBbY29tbWFuZCwgLi4uYnVmXSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgSTJjUGFydHNBYnN0cnVjdDtcbiJdfQ==

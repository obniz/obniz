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
class _24LC256 {
    constructor() {
        this.requiredKeys = ["address"];
        this.keys = ["sda", "scl", "clock", "pull", "i2c", "address"];
    }
    static info() {
        return {
            name: "24LC256",
        };
    }
    wired(obniz) {
        this.params.mode = this.params.mode || "master"; // for i2c
        this.params.clock = this.params.clock || 400 * 1000; // for i2c
        this.i2c = obniz.getI2CWithConfig(this.params);
    }
    // Module functions
    set(address, data) {
        const array = [];
        array.push((address >> 8) & 0xff);
        array.push(address & 0xff);
        array.push.apply(array, data);
        this.i2c.write(0x50, array);
        this.obniz.wait(4 + 1); // write cycle time = 4ms for 24XX00, 1.5ms for 24C01C, 24C02C
    }
    getWait(address, length) {
        return __awaiter(this, void 0, void 0, function* () {
            const array = [];
            array.push((address >> 8) & 0xff);
            array.push(address & 0xff);
            this.i2c.write(0x50, array);
            return yield this.i2c.readWait(0x50, length);
        });
    }
}
exports.default = _24LC256;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9NZW1vcnkvMjRMQzI1Ni9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLE1BQU0sUUFBUTtJQWNaO1FBQ0UsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFmTSxNQUFNLENBQUMsSUFBSTtRQUNoQixPQUFPO1lBQ0wsSUFBSSxFQUFFLFNBQVM7U0FDaEIsQ0FBQztJQUNKLENBQUM7SUFhTSxLQUFLLENBQUMsS0FBVTtRQUNyQixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxRQUFRLENBQUMsQ0FBQyxVQUFVO1FBQzNELElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxVQUFVO1FBQy9ELElBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBRUQsbUJBQW1CO0lBRVosR0FBRyxDQUFDLE9BQVksRUFBRSxJQUFTO1FBQ2hDLE1BQU0sS0FBSyxHQUFRLEVBQUUsQ0FBQztRQUN0QixLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO1FBQ2xDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxDQUFDO1FBQzNCLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM5QixJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDNUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsOERBQThEO0lBQ3hGLENBQUM7SUFFWSxPQUFPLENBQUMsT0FBWSxFQUFFLE1BQVc7O1lBQzVDLE1BQU0sS0FBSyxHQUFRLEVBQUUsQ0FBQztZQUN0QixLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO1lBQ2xDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxDQUFDO1lBQzNCLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztZQUM1QixPQUFPLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQy9DLENBQUM7S0FBQTtDQUNGO0FBRUQsa0JBQWUsUUFBUSxDQUFDIiwiZmlsZSI6InNyYy9wYXJ0cy9NZW1vcnkvMjRMQzI1Ni9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIF8yNExDMjU2IHtcblxuICBwdWJsaWMgc3RhdGljIGluZm8oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6IFwiMjRMQzI1NlwiLFxuICAgIH07XG4gIH1cblxuICBwdWJsaWMgcmVxdWlyZWRLZXlzOiBhbnk7XG4gIHB1YmxpYyBrZXlzOiBhbnk7XG4gIHB1YmxpYyBwYXJhbXM6IGFueTtcbiAgcHVibGljIGkyYzogYW55O1xuICBwdWJsaWMgb2JuaXo6IGFueTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJlcXVpcmVkS2V5cyA9IFtcImFkZHJlc3NcIl07XG4gICAgdGhpcy5rZXlzID0gW1wic2RhXCIsIFwic2NsXCIsIFwiY2xvY2tcIiwgXCJwdWxsXCIsIFwiaTJjXCIsIFwiYWRkcmVzc1wiXTtcbiAgfVxuXG4gIHB1YmxpYyB3aXJlZChvYm5pejogYW55KSB7XG4gICAgdGhpcy5wYXJhbXMubW9kZSA9IHRoaXMucGFyYW1zLm1vZGUgfHwgXCJtYXN0ZXJcIjsgLy8gZm9yIGkyY1xuICAgIHRoaXMucGFyYW1zLmNsb2NrID0gdGhpcy5wYXJhbXMuY2xvY2sgfHwgNDAwICogMTAwMDsgLy8gZm9yIGkyY1xuICAgIHRoaXMuaTJjID0gb2JuaXouZ2V0STJDV2l0aENvbmZpZyh0aGlzLnBhcmFtcyk7XG4gIH1cblxuICAvLyBNb2R1bGUgZnVuY3Rpb25zXG5cbiAgcHVibGljIHNldChhZGRyZXNzOiBhbnksIGRhdGE6IGFueSkge1xuICAgIGNvbnN0IGFycmF5OiBhbnkgPSBbXTtcbiAgICBhcnJheS5wdXNoKChhZGRyZXNzID4+IDgpICYgMHhmZik7XG4gICAgYXJyYXkucHVzaChhZGRyZXNzICYgMHhmZik7XG4gICAgYXJyYXkucHVzaC5hcHBseShhcnJheSwgZGF0YSk7XG4gICAgdGhpcy5pMmMud3JpdGUoMHg1MCwgYXJyYXkpO1xuICAgIHRoaXMub2JuaXoud2FpdCg0ICsgMSk7IC8vIHdyaXRlIGN5Y2xlIHRpbWUgPSA0bXMgZm9yIDI0WFgwMCwgMS41bXMgZm9yIDI0QzAxQywgMjRDMDJDXG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZ2V0V2FpdChhZGRyZXNzOiBhbnksIGxlbmd0aDogYW55KSB7XG4gICAgY29uc3QgYXJyYXk6IGFueSA9IFtdO1xuICAgIGFycmF5LnB1c2goKGFkZHJlc3MgPj4gOCkgJiAweGZmKTtcbiAgICBhcnJheS5wdXNoKGFkZHJlc3MgJiAweGZmKTtcbiAgICB0aGlzLmkyYy53cml0ZSgweDUwLCBhcnJheSk7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuaTJjLnJlYWRXYWl0KDB4NTAsIGxlbmd0aCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgXzI0TEMyNTY7XG4iXX0=

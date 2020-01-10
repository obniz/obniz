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
class S11059 {
    constructor() {
        this.keys = ["vcc", "sda", "scl", "i2c", "gnd"];
        this.requiredKeys = [];
        this.address = 0x2a;
        this.regAdrs = {};
        this.regAdrs.ctrl = 0x00;
        this.regAdrs.manualTiming = 0x01;
        this.regAdrs.sensorRed = 0x03;
    }
    static info() {
        return {
            name: "S11059",
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        obniz.setVccGnd(this.params.vcc, this.params.gnd, "3v");
        this.obniz.wait(100);
        this.params.clock = 100000;
        this.params.pull = "3v";
        this.params.mode = "master";
        this.i2c = obniz.getI2CWithConfig(this.params);
        this.obniz.wait(100);
    }
    init(gain, intTime) {
        this.i2c.write(this.address, [this.regAdrs.ctrl, 0x80]); // Reset
        const val = (gain << 3) | intTime;
        this.i2c.write(this.address, [this.regAdrs.ctrl, val]); // Set gain,interger time
    }
    getVal() {
        return __awaiter(this, void 0, void 0, function* () {
            this.i2c.write(this.address, [this.regAdrs.sensorRed]);
            const ret = yield this.i2c.readWait(this.address, 8);
            const level = [0, 0, 0, 0];
            level[0] = (ret[0] << 8) | ret[1];
            level[1] = (ret[2] << 8) | ret[3];
            level[2] = (ret[4] << 8) | ret[5];
            level[3] = (ret[6] << 8) | ret[7];
            return level;
        });
    }
}
exports.default = S11059;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9Db2xvclNlbnNvci9TMTEwNTkvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxNQUFNLE1BQU07SUFnQlY7UUFDRSxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ2hELElBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO1FBRXZCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUN6QixJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7UUFDakMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0lBQ2hDLENBQUM7SUF2Qk0sTUFBTSxDQUFDLElBQUk7UUFDaEIsT0FBTztZQUNMLElBQUksRUFBRSxRQUFRO1NBQ2YsQ0FBQztJQUNKLENBQUM7SUFxQk0sS0FBSyxDQUFDLEtBQVU7UUFDckIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN4RCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVyQixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUM7UUFDM0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQztRQUM1QixJQUFJLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDL0MsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDdkIsQ0FBQztJQUVNLElBQUksQ0FBQyxJQUFTLEVBQUUsT0FBWTtRQUNqQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVE7UUFDakUsTUFBTSxHQUFHLEdBQVEsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMseUJBQXlCO0lBQ25GLENBQUM7SUFFWSxNQUFNOztZQUNqQixJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ3ZELE1BQU0sR0FBRyxHQUFRLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztZQUMxRCxNQUFNLEtBQUssR0FBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2hDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEMsT0FBTyxLQUFLLENBQUM7UUFDZixDQUFDO0tBQUE7Q0FDRjtBQUVELGtCQUFlLE1BQU0sQ0FBQyIsImZpbGUiOiJzcmMvcGFydHMvQ29sb3JTZW5zb3IvUzExMDU5L2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgUzExMDU5IHtcblxuICBwdWJsaWMgc3RhdGljIGluZm8oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6IFwiUzExMDU5XCIsXG4gICAgfTtcbiAgfVxuXG4gIHB1YmxpYyBrZXlzOiBhbnk7XG4gIHB1YmxpYyByZXF1aXJlZEtleXM6IGFueTtcbiAgcHVibGljIGFkZHJlc3M6IGFueTtcbiAgcHVibGljIHJlZ0FkcnM6IGFueTtcbiAgcHVibGljIG9ibml6OiBhbnk7XG4gIHB1YmxpYyBwYXJhbXM6IGFueTtcbiAgcHVibGljIGkyYzogYW55O1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMua2V5cyA9IFtcInZjY1wiLCBcInNkYVwiLCBcInNjbFwiLCBcImkyY1wiLCBcImduZFwiXTtcbiAgICB0aGlzLnJlcXVpcmVkS2V5cyA9IFtdO1xuXG4gICAgdGhpcy5hZGRyZXNzID0gMHgyYTtcbiAgICB0aGlzLnJlZ0FkcnMgPSB7fTtcbiAgICB0aGlzLnJlZ0FkcnMuY3RybCA9IDB4MDA7XG4gICAgdGhpcy5yZWdBZHJzLm1hbnVhbFRpbWluZyA9IDB4MDE7XG4gICAgdGhpcy5yZWdBZHJzLnNlbnNvclJlZCA9IDB4MDM7XG4gIH1cblxuICBwdWJsaWMgd2lyZWQob2JuaXo6IGFueSkge1xuICAgIHRoaXMub2JuaXogPSBvYm5pejtcbiAgICBvYm5pei5zZXRWY2NHbmQodGhpcy5wYXJhbXMudmNjLCB0aGlzLnBhcmFtcy5nbmQsIFwiM3ZcIik7XG4gICAgdGhpcy5vYm5pei53YWl0KDEwMCk7XG5cbiAgICB0aGlzLnBhcmFtcy5jbG9jayA9IDEwMDAwMDtcbiAgICB0aGlzLnBhcmFtcy5wdWxsID0gXCIzdlwiO1xuICAgIHRoaXMucGFyYW1zLm1vZGUgPSBcIm1hc3RlclwiO1xuICAgIHRoaXMuaTJjID0gb2JuaXouZ2V0STJDV2l0aENvbmZpZyh0aGlzLnBhcmFtcyk7XG4gICAgdGhpcy5vYm5pei53YWl0KDEwMCk7XG4gIH1cblxuICBwdWJsaWMgaW5pdChnYWluOiBhbnksIGludFRpbWU6IGFueSkge1xuICAgIHRoaXMuaTJjLndyaXRlKHRoaXMuYWRkcmVzcywgW3RoaXMucmVnQWRycy5jdHJsLCAweDgwXSk7IC8vIFJlc2V0XG4gICAgY29uc3QgdmFsOiBhbnkgPSAoZ2FpbiA8PCAzKSB8IGludFRpbWU7XG4gICAgdGhpcy5pMmMud3JpdGUodGhpcy5hZGRyZXNzLCBbdGhpcy5yZWdBZHJzLmN0cmwsIHZhbF0pOyAvLyBTZXQgZ2FpbixpbnRlcmdlciB0aW1lXG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZ2V0VmFsKCkge1xuICAgIHRoaXMuaTJjLndyaXRlKHRoaXMuYWRkcmVzcywgW3RoaXMucmVnQWRycy5zZW5zb3JSZWRdKTtcbiAgICBjb25zdCByZXQ6IGFueSA9IGF3YWl0IHRoaXMuaTJjLnJlYWRXYWl0KHRoaXMuYWRkcmVzcywgOCk7XG4gICAgY29uc3QgbGV2ZWw6IGFueSA9IFswLCAwLCAwLCAwXTtcbiAgICBsZXZlbFswXSA9IChyZXRbMF0gPDwgOCkgfCByZXRbMV07XG4gICAgbGV2ZWxbMV0gPSAocmV0WzJdIDw8IDgpIHwgcmV0WzNdO1xuICAgIGxldmVsWzJdID0gKHJldFs0XSA8PCA4KSB8IHJldFs1XTtcbiAgICBsZXZlbFszXSA9IChyZXRbNl0gPDwgOCkgfCByZXRbN107XG4gICAgcmV0dXJuIGxldmVsO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFMxMTA1OTtcbiJdfQ==

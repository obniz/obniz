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
class ADT7410 {
    constructor() {
        this.keys = ["vcc", "gnd", "sda", "scl", "addressMode"];
        this.requiredKeys = ["addressMode"];
    }
    static info() {
        return {
            name: "ADT7410",
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
        if (this.params.addressMode === 8) {
            this.address = 0x48;
        }
        else if (this.params.addressMode === 9) {
            this.address = 0x49;
        }
        this.params.clock = 400000;
        this.params.pull = "5v";
        this.params.mode = "master";
        this.i2c = obniz.getI2CWithConfig(this.params);
    }
    getTempWait() {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.i2c.readWait(this.address, 2);
            let tempBin = ret[0] << 8;
            tempBin |= ret[1];
            tempBin = tempBin >> 3;
            if (tempBin & 0x1000) {
                tempBin = tempBin - 8192;
            }
            return tempBin / 16;
        });
    }
}
exports.default = ADT7410;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9UZW1wZXJhdHVyZVNlbnNvci9pMmMvQURUNzQxMC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLE1BQU0sT0FBTztJQWVYO1FBQ0UsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxhQUFhLENBQUMsQ0FBQztRQUN4RCxJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQWhCTSxNQUFNLENBQUMsSUFBSTtRQUNoQixPQUFPO1lBQ0wsSUFBSSxFQUFFLFNBQVM7U0FDaEIsQ0FBQztJQUNKLENBQUM7SUFjTSxLQUFLLENBQUMsS0FBVTtRQUNyQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRXhELElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEtBQUssQ0FBQyxFQUFFO1lBQ2pDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1NBQ3JCO2FBQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsS0FBSyxDQUFDLEVBQUU7WUFDeEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7U0FDckI7UUFFRCxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUM7UUFDM0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQztRQUU1QixJQUFJLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDakQsQ0FBQztJQUVZLFdBQVc7O1lBQ3RCLE1BQU0sR0FBRyxHQUFRLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztZQUMxRCxJQUFJLE9BQU8sR0FBUSxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQy9CLE9BQU8sSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEIsT0FBTyxHQUFHLE9BQU8sSUFBSSxDQUFDLENBQUM7WUFFdkIsSUFBSSxPQUFPLEdBQUcsTUFBTSxFQUFFO2dCQUNwQixPQUFPLEdBQUcsT0FBTyxHQUFHLElBQUksQ0FBQzthQUMxQjtZQUVELE9BQU8sT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUN0QixDQUFDO0tBQUE7Q0FDRjtBQUVELGtCQUFlLE9BQU8sQ0FBQyIsImZpbGUiOiJzcmMvcGFydHMvVGVtcGVyYXR1cmVTZW5zb3IvaTJjL0FEVDc0MTAvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBBRFQ3NDEwIHtcblxuICBwdWJsaWMgc3RhdGljIGluZm8oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6IFwiQURUNzQxMFwiLFxuICAgIH07XG4gIH1cblxuICBwdWJsaWMga2V5czogYW55O1xuICBwdWJsaWMgcmVxdWlyZWRLZXlzOiBhbnk7XG4gIHB1YmxpYyBvYm5pejogYW55O1xuICBwdWJsaWMgcGFyYW1zOiBhbnk7XG4gIHB1YmxpYyBhZGRyZXNzOiBhbnk7XG4gIHB1YmxpYyBpMmM6IGFueTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmtleXMgPSBbXCJ2Y2NcIiwgXCJnbmRcIiwgXCJzZGFcIiwgXCJzY2xcIiwgXCJhZGRyZXNzTW9kZVwiXTtcbiAgICB0aGlzLnJlcXVpcmVkS2V5cyA9IFtcImFkZHJlc3NNb2RlXCJdO1xuICB9XG5cbiAgcHVibGljIHdpcmVkKG9ibml6OiBhbnkpIHtcbiAgICB0aGlzLm9ibml6ID0gb2JuaXo7XG4gICAgb2JuaXouc2V0VmNjR25kKHRoaXMucGFyYW1zLnZjYywgdGhpcy5wYXJhbXMuZ25kLCBcIjV2XCIpO1xuXG4gICAgaWYgKHRoaXMucGFyYW1zLmFkZHJlc3NNb2RlID09PSA4KSB7XG4gICAgICB0aGlzLmFkZHJlc3MgPSAweDQ4O1xuICAgIH0gZWxzZSBpZiAodGhpcy5wYXJhbXMuYWRkcmVzc01vZGUgPT09IDkpIHtcbiAgICAgIHRoaXMuYWRkcmVzcyA9IDB4NDk7XG4gICAgfVxuXG4gICAgdGhpcy5wYXJhbXMuY2xvY2sgPSA0MDAwMDA7XG4gICAgdGhpcy5wYXJhbXMucHVsbCA9IFwiNXZcIjtcbiAgICB0aGlzLnBhcmFtcy5tb2RlID0gXCJtYXN0ZXJcIjtcblxuICAgIHRoaXMuaTJjID0gb2JuaXouZ2V0STJDV2l0aENvbmZpZyh0aGlzLnBhcmFtcyk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZ2V0VGVtcFdhaXQoKSB7XG4gICAgY29uc3QgcmV0OiBhbnkgPSBhd2FpdCB0aGlzLmkyYy5yZWFkV2FpdCh0aGlzLmFkZHJlc3MsIDIpO1xuICAgIGxldCB0ZW1wQmluOiBhbnkgPSByZXRbMF0gPDwgODtcbiAgICB0ZW1wQmluIHw9IHJldFsxXTtcbiAgICB0ZW1wQmluID0gdGVtcEJpbiA+PiAzO1xuXG4gICAgaWYgKHRlbXBCaW4gJiAweDEwMDApIHtcbiAgICAgIHRlbXBCaW4gPSB0ZW1wQmluIC0gODE5MjtcbiAgICB9XG5cbiAgICByZXR1cm4gdGVtcEJpbiAvIDE2O1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEFEVDc0MTA7XG4iXX0=

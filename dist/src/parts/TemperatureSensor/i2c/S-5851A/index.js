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
// sensor response not found
class S5851A {
    constructor() {
        this.requiredKeys = ["vcc", "gnd", "adr0", "adr1", "adr_select"];
        this.keys = ["sda", "scl", "adr0", "adr1", "adr_select", "i2c"];
    }
    static info() {
        return {
            name: "S5851A",
        };
    }
    wired(obniz) {
        // params: pwr, gnd, sda, scl, adr0, adr1, adr_select
        this.io_adr0 = obniz.getIO(this.params.adr0);
        this.io_adr1 = obniz.getIO(this.params.adr1);
        this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
        switch (this.params.adr_select) {
            case 8:
                this.io_adr0.output(false);
                this.io_adr1.output(false);
                this.address = 0x48;
                break;
            case 9:
                this.io_adr0.pull(null);
                this.io_adr1.output(false);
                this.address = 0x49;
                break;
            case "A":
                this.io_adr0.output(true);
                this.io_adr1.output(false);
                this.address = 0x4a;
                break;
            case "B":
                this.io_adr0.output(false);
                this.io_adr1.output(true);
                this.address = 0x4b;
                break;
            case "C":
                this.io_adr0.pull(null);
                this.io_adr1.output(true);
                this.address = 0x4c;
                break;
            case "D":
                this.io_adr0.output(true);
                this.io_adr1.output(true);
                this.address = 0x4d;
                break;
            case "E":
                this.io_adr0.output(false);
                this.io_adr1.pull(null);
                this.address = 0x4e;
                break;
            case "F":
                this.io_adr0.output(true);
                this.io_adr1.pull(null);
                this.address = 0x4f;
                break;
            default:
                this.io_adr0.output(false);
                this.io_adr1.output(false);
                this.address = 0x48;
                break;
        }
        console.log("i2c address=" + this.address);
        this.params.clock = this.params.clock || 400 * 1000; // for i2c
        this.params.mode = this.params.mode || "master"; // for i2c
        this.params.pull = this.params.pull || "5v"; // for i2c
        this.i2c = obniz.getI2CWithConfig(this.params);
        // obniz.i2c0.write(address, [0x20, 0x24]);
    }
    getTempWait() {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log("gettempwait");
            // obniz.i2c0.write(address, [0x20, 0x24]);
            // obniz.i2c0.write(address, [0xE0, 0x00]);
            const ret = yield this.i2c0.readWait(this.address, 2);
            // console.log('ret:' + ret);
            const tempBin = ret[0].toString(2) + ("00000000" + ret[1].toString(2)).slice(-8);
            const temperature = -45 + 175 * (parseInt(tempBin, 2) / (65536 - 1));
            return temperature;
        });
    }
    getHumdWait() {
        return __awaiter(this, void 0, void 0, function* () {
            this.i2c.write(this.address, [0x20, 0x24]);
            this.i2c.write(this.address, [0xe0, 0x00]);
            const ret = yield this.i2c.readWait(this.address, 4);
            const humdBin = ret[2].toString(2) + ("00000000" + ret[3].toString(2)).slice(-8);
            const humidity = 100 * (parseInt(humdBin, 2) / (65536 - 1));
            return humidity;
        });
    }
}
exports.default = S5851A;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9UZW1wZXJhdHVyZVNlbnNvci9pMmMvUy01ODUxQS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLDRCQUE0QjtBQUM1QixNQUFNLE1BQU07SUFrQlY7UUFDRSxJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQ2pFLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ2xFLENBQUM7SUFuQk0sTUFBTSxDQUFDLElBQUk7UUFDaEIsT0FBTztZQUNMLElBQUksRUFBRSxRQUFRO1NBQ2YsQ0FBQztJQUNKLENBQUM7SUFpQk0sS0FBSyxDQUFDLEtBQVU7UUFDckIscURBQXFEO1FBQ3JELElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdDLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRTdDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRTdELFFBQVEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUU7WUFDOUIsS0FBSyxDQUFDO2dCQUNKLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUMzQixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDM0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7Z0JBQ3BCLE1BQU07WUFDUixLQUFLLENBQUM7Z0JBQ0osSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3hCLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUMzQixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztnQkFDcEIsTUFBTTtZQUNSLEtBQUssR0FBRztnQkFDTixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDMUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzNCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO2dCQUNwQixNQUFNO1lBQ1IsS0FBSyxHQUFHO2dCQUNOLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUMzQixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDMUIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7Z0JBQ3BCLE1BQU07WUFDUixLQUFLLEdBQUc7Z0JBQ04sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3hCLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUMxQixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztnQkFDcEIsTUFBTTtZQUNSLEtBQUssR0FBRztnQkFDTixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDMUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQzFCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO2dCQUNwQixNQUFNO1lBQ1IsS0FBSyxHQUFHO2dCQUNOLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUMzQixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDeEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7Z0JBQ3BCLE1BQU07WUFDUixLQUFLLEdBQUc7Z0JBQ04sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQzFCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN4QixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztnQkFDcEIsTUFBTTtZQUNSO2dCQUNFLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUMzQixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDM0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7Z0JBQ3BCLE1BQU07U0FDVDtRQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUUzQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsVUFBVTtRQUMvRCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxRQUFRLENBQUMsQ0FBQyxVQUFVO1FBQzNELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxDQUFDLFVBQVU7UUFDdkQsSUFBSSxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQy9DLDJDQUEyQztJQUM3QyxDQUFDO0lBRVksV0FBVzs7WUFDdEIsOEJBQThCO1lBQzlCLDJDQUEyQztZQUMzQywyQ0FBMkM7WUFDM0MsTUFBTSxHQUFHLEdBQVEsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzNELDZCQUE2QjtZQUM3QixNQUFNLE9BQU8sR0FDWCxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuRSxNQUFNLFdBQVcsR0FBUSxDQUFDLEVBQUUsR0FBRyxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUUsT0FBTyxXQUFXLENBQUM7UUFDckIsQ0FBQztLQUFBO0lBRVksV0FBVzs7WUFDdEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQzNDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUMzQyxNQUFNLEdBQUcsR0FBUSxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDMUQsTUFBTSxPQUFPLEdBQ1gsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkUsTUFBTSxRQUFRLEdBQVEsR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pFLE9BQU8sUUFBUSxDQUFDO1FBQ2xCLENBQUM7S0FBQTtDQUNGO0FBRUQsa0JBQWUsTUFBTSxDQUFDIiwiZmlsZSI6InNyYy9wYXJ0cy9UZW1wZXJhdHVyZVNlbnNvci9pMmMvUy01ODUxQS9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIHNlbnNvciByZXNwb25zZSBub3QgZm91bmRcbmNsYXNzIFM1ODUxQSB7XG5cbiAgcHVibGljIHN0YXRpYyBpbmZvKCkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiBcIlM1ODUxQVwiLFxuICAgIH07XG4gIH1cblxuICBwdWJsaWMgcmVxdWlyZWRLZXlzOiBhbnk7XG4gIHB1YmxpYyBrZXlzOiBhbnk7XG4gIHB1YmxpYyBpb19hZHIwOiBhbnk7XG4gIHB1YmxpYyBwYXJhbXM6IGFueTtcbiAgcHVibGljIGlvX2FkcjE6IGFueTtcbiAgcHVibGljIG9ibml6OiBhbnk7XG4gIHB1YmxpYyBhZGRyZXNzOiBhbnk7XG4gIHB1YmxpYyBpMmM6IGFueTtcbiAgcHVibGljIGkyYzA6IGFueTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJlcXVpcmVkS2V5cyA9IFtcInZjY1wiLCBcImduZFwiLCBcImFkcjBcIiwgXCJhZHIxXCIsIFwiYWRyX3NlbGVjdFwiXTtcbiAgICB0aGlzLmtleXMgPSBbXCJzZGFcIiwgXCJzY2xcIiwgXCJhZHIwXCIsIFwiYWRyMVwiLCBcImFkcl9zZWxlY3RcIiwgXCJpMmNcIl07XG4gIH1cblxuICBwdWJsaWMgd2lyZWQob2JuaXo6IGFueSkge1xuICAgIC8vIHBhcmFtczogcHdyLCBnbmQsIHNkYSwgc2NsLCBhZHIwLCBhZHIxLCBhZHJfc2VsZWN0XG4gICAgdGhpcy5pb19hZHIwID0gb2JuaXouZ2V0SU8odGhpcy5wYXJhbXMuYWRyMCk7XG4gICAgdGhpcy5pb19hZHIxID0gb2JuaXouZ2V0SU8odGhpcy5wYXJhbXMuYWRyMSk7XG5cbiAgICB0aGlzLm9ibml6LnNldFZjY0duZCh0aGlzLnBhcmFtcy52Y2MsIHRoaXMucGFyYW1zLmduZCwgXCI1dlwiKTtcblxuICAgIHN3aXRjaCAodGhpcy5wYXJhbXMuYWRyX3NlbGVjdCkge1xuICAgICAgY2FzZSA4OlxuICAgICAgICB0aGlzLmlvX2FkcjAub3V0cHV0KGZhbHNlKTtcbiAgICAgICAgdGhpcy5pb19hZHIxLm91dHB1dChmYWxzZSk7XG4gICAgICAgIHRoaXMuYWRkcmVzcyA9IDB4NDg7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSA5OlxuICAgICAgICB0aGlzLmlvX2FkcjAucHVsbChudWxsKTtcbiAgICAgICAgdGhpcy5pb19hZHIxLm91dHB1dChmYWxzZSk7XG4gICAgICAgIHRoaXMuYWRkcmVzcyA9IDB4NDk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIkFcIjpcbiAgICAgICAgdGhpcy5pb19hZHIwLm91dHB1dCh0cnVlKTtcbiAgICAgICAgdGhpcy5pb19hZHIxLm91dHB1dChmYWxzZSk7XG4gICAgICAgIHRoaXMuYWRkcmVzcyA9IDB4NGE7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIkJcIjpcbiAgICAgICAgdGhpcy5pb19hZHIwLm91dHB1dChmYWxzZSk7XG4gICAgICAgIHRoaXMuaW9fYWRyMS5vdXRwdXQodHJ1ZSk7XG4gICAgICAgIHRoaXMuYWRkcmVzcyA9IDB4NGI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIkNcIjpcbiAgICAgICAgdGhpcy5pb19hZHIwLnB1bGwobnVsbCk7XG4gICAgICAgIHRoaXMuaW9fYWRyMS5vdXRwdXQodHJ1ZSk7XG4gICAgICAgIHRoaXMuYWRkcmVzcyA9IDB4NGM7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIkRcIjpcbiAgICAgICAgdGhpcy5pb19hZHIwLm91dHB1dCh0cnVlKTtcbiAgICAgICAgdGhpcy5pb19hZHIxLm91dHB1dCh0cnVlKTtcbiAgICAgICAgdGhpcy5hZGRyZXNzID0gMHg0ZDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiRVwiOlxuICAgICAgICB0aGlzLmlvX2FkcjAub3V0cHV0KGZhbHNlKTtcbiAgICAgICAgdGhpcy5pb19hZHIxLnB1bGwobnVsbCk7XG4gICAgICAgIHRoaXMuYWRkcmVzcyA9IDB4NGU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIkZcIjpcbiAgICAgICAgdGhpcy5pb19hZHIwLm91dHB1dCh0cnVlKTtcbiAgICAgICAgdGhpcy5pb19hZHIxLnB1bGwobnVsbCk7XG4gICAgICAgIHRoaXMuYWRkcmVzcyA9IDB4NGY7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy5pb19hZHIwLm91dHB1dChmYWxzZSk7XG4gICAgICAgIHRoaXMuaW9fYWRyMS5vdXRwdXQoZmFsc2UpO1xuICAgICAgICB0aGlzLmFkZHJlc3MgPSAweDQ4O1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgY29uc29sZS5sb2coXCJpMmMgYWRkcmVzcz1cIiArIHRoaXMuYWRkcmVzcyk7XG5cbiAgICB0aGlzLnBhcmFtcy5jbG9jayA9IHRoaXMucGFyYW1zLmNsb2NrIHx8IDQwMCAqIDEwMDA7IC8vIGZvciBpMmNcbiAgICB0aGlzLnBhcmFtcy5tb2RlID0gdGhpcy5wYXJhbXMubW9kZSB8fCBcIm1hc3RlclwiOyAvLyBmb3IgaTJjXG4gICAgdGhpcy5wYXJhbXMucHVsbCA9IHRoaXMucGFyYW1zLnB1bGwgfHwgXCI1dlwiOyAvLyBmb3IgaTJjXG4gICAgdGhpcy5pMmMgPSBvYm5pei5nZXRJMkNXaXRoQ29uZmlnKHRoaXMucGFyYW1zKTtcbiAgICAvLyBvYm5pei5pMmMwLndyaXRlKGFkZHJlc3MsIFsweDIwLCAweDI0XSk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZ2V0VGVtcFdhaXQoKSB7XG4gICAgLy8gY29uc29sZS5sb2coXCJnZXR0ZW1wd2FpdFwiKTtcbiAgICAvLyBvYm5pei5pMmMwLndyaXRlKGFkZHJlc3MsIFsweDIwLCAweDI0XSk7XG4gICAgLy8gb2JuaXouaTJjMC53cml0ZShhZGRyZXNzLCBbMHhFMCwgMHgwMF0pO1xuICAgIGNvbnN0IHJldDogYW55ID0gYXdhaXQgdGhpcy5pMmMwLnJlYWRXYWl0KHRoaXMuYWRkcmVzcywgMik7XG4gICAgLy8gY29uc29sZS5sb2coJ3JldDonICsgcmV0KTtcbiAgICBjb25zdCB0ZW1wQmluOiBhbnkgPVxuICAgICAgcmV0WzBdLnRvU3RyaW5nKDIpICsgKFwiMDAwMDAwMDBcIiArIHJldFsxXS50b1N0cmluZygyKSkuc2xpY2UoLTgpO1xuICAgIGNvbnN0IHRlbXBlcmF0dXJlOiBhbnkgPSAtNDUgKyAxNzUgKiAocGFyc2VJbnQodGVtcEJpbiwgMikgLyAoNjU1MzYgLSAxKSk7XG4gICAgcmV0dXJuIHRlbXBlcmF0dXJlO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGdldEh1bWRXYWl0KCkge1xuICAgIHRoaXMuaTJjLndyaXRlKHRoaXMuYWRkcmVzcywgWzB4MjAsIDB4MjRdKTtcbiAgICB0aGlzLmkyYy53cml0ZSh0aGlzLmFkZHJlc3MsIFsweGUwLCAweDAwXSk7XG4gICAgY29uc3QgcmV0OiBhbnkgPSBhd2FpdCB0aGlzLmkyYy5yZWFkV2FpdCh0aGlzLmFkZHJlc3MsIDQpO1xuICAgIGNvbnN0IGh1bWRCaW46IGFueSA9XG4gICAgICByZXRbMl0udG9TdHJpbmcoMikgKyAoXCIwMDAwMDAwMFwiICsgcmV0WzNdLnRvU3RyaW5nKDIpKS5zbGljZSgtOCk7XG4gICAgY29uc3QgaHVtaWRpdHk6IGFueSA9IDEwMCAqIChwYXJzZUludChodW1kQmluLCAyKSAvICg2NTUzNiAtIDEpKTtcbiAgICByZXR1cm4gaHVtaWRpdHk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUzU4NTFBO1xuIl19
